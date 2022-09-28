/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
import { messages } from '@client/i18n/messages/views/userSetup'
import { withTheme } from '@client/styledComponents'
import * as React from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { Query } from '@client/components/Query'
import { FETCH_TIME_LOGGED_METRICS_FOR_PRACTITIONER } from '@client/user/queries'
import {
  GQLQuery,
  GQLTimeLoggedMetrics
} from '@opencrvs/gateway/src/graphql/schema'
import {
  ArrowDownBlue,
  StatusCollected,
  StatusGray,
  StatusGreen,
  StatusOrange,
  StatusProgress,
  StatusRejected,
  StatusWaitingValidation
} from '@opencrvs/components/lib/icons'
import styled from 'styled-components'
import { LinkButton } from '@opencrvs/components/lib/buttons'
import { LoadingGrey } from '@opencrvs/components/lib/ListTable'
import { Table } from '@opencrvs/components/lib/Table'
import { GenericErrorToast } from '@client/components/GenericErrorToast'
import { DateRangePicker } from '@client/components/DateRangePicker'
import { ITheme } from '@opencrvs/components/lib/theme'
import {
  IColumn,
  ColumnContentAlignment
} from '@opencrvs/components/lib/Workqueue'
import { getUserAuditDescription } from '@client/views/SysAdmin/Team/utils'
import { constantsMessages } from '@client/i18n/messages/constants'
import { orderBy } from 'lodash'
import { SORT_ORDER } from '@client/views/SysAdmin/Performance/reports/completenessRates/CompletenessDataTable'
import subMonths from 'date-fns/subMonths'
import format from '@client/utils/date-formatting'
import { messages as performanceMessages } from '@client/i18n/messages/views/performance'
import { PerformanceSelect } from '@client/views/SysAdmin/Performance/PerformanceSelect'

import {
  IOnlineStatusProps,
  withOnlineStatus
} from '@client/views/OfficeHome/LoadingIndicator'
import { ISearchLocation } from '@opencrvs/components/lib/LocationSearch'
import { Event } from '@client/utils/gateway'
import { ILocation } from '@client/offline/reducer'
import { ICurrency } from '@client/utils/referenceApi'
import { RouteComponentProps } from 'react-router'
import { IUserDetails } from '@client/utils/userUtils'
import { REGISTRAR_ROLES } from '@client/utils/constants'

const DEFAULT_LIST_SIZE = 10

const InformationCaption = styled.div`
  ${({ theme }) => theme.fonts.reg12};
  padding-bottom: 5px;
`

const AuditDescTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > :first-child {
    padding-top: 5px;
  }
`
const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const RecentActionsHolder = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.md}px) {
    margin-top: 24px;
    padding-top: 24px;
  }
  border-top: 1px solid ${({ theme }) => theme.colors.grey200};
`

const SectionTitle = styled.div`
  ${({ theme }) => theme.fonts.h2};
  margin-bottom: 10px;
`

const StatusIcon = styled.div`
  margin-top: 4px;
`

const AlignedDateRangePicker = styled(DateRangePicker)`
  position: absolute;
  top: 20px;
`

const AdjustedStatusIcon = styled.div`
  margin-left: 3px;
`

const InformationTitle = styled.div`
  ${({ theme }) => theme.fonts.bold16};
  width: 320px;
`
export interface IUserData {
  id?: string
  primaryOffice?: ISearchLocation
  name?: string
  role?: string
  type?: string
  number?: string
  status?: string
  underInvestigation?: boolean
  username?: string
  practitionerId?: string
  locationId?: string
  startDate?: string
}

interface IBaseProp {
  theme: ITheme
  user?: IUserData
  isLoading?: boolean
}

interface IConnectProps {
  locations: { [key: string]: ILocation }
  offices: { [key: string]: ILocation }
  currency: ICurrency
}

type Props = WrappedComponentProps &
  IBaseProp &
  IOnlineStatusProps &
  RouteComponentProps & { userDetails: IUserDetails | null } & IConnectProps & {
    theme: ITheme
  }

export enum SORTED_COLUMN {
  ACTION = 'actionDescriptionString',
  EVENT = 'eventType',
  RECORD = 'trackingIdString',
  DATE = 'auditTime'
}

type State = {
  selectedLocation?: ISearchLocation
  timeStart: Date
  timeEnd: Date
  viewportWidth: number
  sortOrder: SORT_ORDER
  sortedColumn: SORTED_COLUMN
  currentPageNumber: number
  event: Event
  officeSelected?: boolean
  isAccessibleOffice?: boolean
}

class UserAuditHistoryComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    window.__localeId__ = props.intl.locale
    this.state = {
      timeStart: subMonths(new Date(Date.now()), 1),
      timeEnd: new Date(Date.now()),
      viewportWidth: 0,
      currentPageNumber: 1,
      sortOrder: SORT_ORDER.DESCENDING,
      sortedColumn: SORTED_COLUMN.DATE,
      event: Event.All
    }
    this.updateViewPort = this.updateViewPort.bind(this)
  }

  componentDidMount() {
    this.updateViewPort()
    window.addEventListener('resize', this.updateViewPort)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewPort)
  }

  setDateRangePickerValues(startDate: Date, endDate: Date) {
    this.setState({
      timeStart: startDate,
      timeEnd: endDate
    })
  }

  toggleSortOrder(columnName: SORTED_COLUMN) {
    this.setState({
      sortedColumn: columnName,
      sortOrder:
        this.state.sortOrder === SORT_ORDER.DESCENDING
          ? SORT_ORDER.ASCENDING
          : SORT_ORDER.DESCENDING
    })
  }

  setCurrentPage = (currentPage: number) => {
    this.setState({ currentPageNumber: currentPage })
  }

  updateViewPort() {
    this.setState({ viewportWidth: window.innerWidth })
  }

  getAuditColumns() {
    const { theme, intl } = this.props
    let columns: IColumn[] = []
    if (this.state.viewportWidth <= theme.grid.breakpoints.md) {
      columns = [
        {
          label: intl.formatMessage(messages.auditActionColumnTitle),
          width: 80,
          key: 'actionDescriptionWithAuditTime'
        },
        {
          label: intl.formatMessage(messages.auditTrackingIDColumnTitle),
          width: 20,
          key: 'trackingId',
          alignment: ColumnContentAlignment.RIGHT
        }
      ]
    } else {
      columns = [
        {
          label: intl.formatMessage(messages.auditActionColumnTitle),
          width: 48,
          isSortable: true,
          icon: <ArrowDownBlue />,
          key: 'actionDescription',
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.ACTION)
        },
        {
          label: intl.formatMessage(messages.auditEventTypeColumnTitle),
          width: 15,
          isSortable: true,
          icon: <ArrowDownBlue />,
          key: 'eventType',
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.EVENT)
        },
        {
          label: intl.formatMessage(messages.auditTrackingIDColumnTitle),
          width: 15,
          isSortable: true,
          icon: <ArrowDownBlue />,
          key: 'trackingId',
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.RECORD)
        },
        {
          label: intl.formatMessage(messages.auditDateColumnTitle),
          width: 22,
          key: 'auditTime',
          isSortable: true,
          isSorted: true,
          icon: <ArrowDownBlue />,
          alignment: ColumnContentAlignment.RIGHT,
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.DATE)
        }
      ]
    }
    return columns
  }

  getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <StatusProgress />
      case 'DECLARED':
        return (
          <AdjustedStatusIcon>
            <StatusOrange />
          </AdjustedStatusIcon>
        )
      case 'VALIDATED':
        return (
          <StatusIcon>
            <StatusGray />
          </StatusIcon>
        )
      case 'WAITING_VALIDATION':
        return (
          <StatusIcon>
            <StatusWaitingValidation />
          </StatusIcon>
        )
      case 'REGISTERED':
        return (
          <StatusIcon>
            <StatusGreen />
          </StatusIcon>
        )
      case 'REJECTED':
        return (
          <StatusIcon>
            <StatusRejected />
          </StatusIcon>
        )
      case 'CERTIFIED':
        return (
          <StatusIcon>
            <StatusCollected />
          </StatusIcon>
        )
      default:
        return (
          <StatusIcon>
            <StatusOrange />
          </StatusIcon>
        )
    }
  }

  getAuditData(data: GQLQuery, user?: IUserData) {
    if (
      !user ||
      !data ||
      !data.fetchTimeLoggedMetricsByPractitioner ||
      !data.fetchTimeLoggedMetricsByPractitioner.results
    ) {
      return []
    }
    const auditList = data.fetchTimeLoggedMetricsByPractitioner.results.map(
      (timeLoggedMetrics: GQLTimeLoggedMetrics | null) => {
        if (timeLoggedMetrics === null) {
          return {}
        }
        const actionDescriptor = getUserAuditDescription(
          timeLoggedMetrics.status
        )
        return {
          actionDescription: (
            <InformationTitle>
              {(actionDescriptor &&
                this.props.intl.formatMessage(actionDescriptor)) ||
                ''}
            </InformationTitle>
          ),
          actionDescriptionString: actionDescriptor
            ? this.props.intl.formatMessage(actionDescriptor)
            : '',
          actionDescriptionWithAuditTime: (
            <AuditDescTimeContainer>
              <InformationTitle>
                {(actionDescriptor &&
                  this.props.intl.formatMessage(actionDescriptor)) ||
                  ''}
              </InformationTitle>
              <InformationCaption>
                {format(
                  new Date(timeLoggedMetrics.time),
                  'MMMM dd, yyyy hh:mm a'
                )}
              </InformationCaption>
            </AuditDescTimeContainer>
          ),
          eventType: this.props.intl.formatMessage(
            constantsMessages[timeLoggedMetrics.eventType.toLowerCase()]
          ),
          trackingId: timeLoggedMetrics.trackingId && (
            <LinkButton>{timeLoggedMetrics.trackingId}</LinkButton>
          ),
          trackingIdString: timeLoggedMetrics.trackingId,
          auditTime: format(
            new Date(timeLoggedMetrics.time),
            'MMMM dd, yyyy hh:mm a'
          )
        }
      }
    )
    return (
      (auditList &&
        orderBy(
          auditList,
          [this.state.sortedColumn],
          [this.state.sortOrder]
        )) ||
      []
    )
  }

  getLoadingView() {
    return (
      <>
        <SectionTitle>
          <LoadingGrey width={5} />
        </SectionTitle>
        <LoadingGrey width={10} />
        {this.getLoadingAuditListView()}
      </>
    )
  }

  isOfficeSelected(selectedLocation?: ISearchLocation) {
    if (selectedLocation) {
      return Object.keys(this.props.offices).some(
        (id) => id === selectedLocation.id
      )
    }
    return false
  }

  isAccessibleOfficeSelected(selectedLocation?: ISearchLocation) {
    if (
      selectedLocation &&
      this.isOfficeSelected(selectedLocation) &&
      this.props.userDetails &&
      this.props.userDetails.role
    ) {
      if (this.props.userDetails?.role === 'NATIONAL_REGISTRAR') {
        return true
      } else if (
        REGISTRAR_ROLES.includes(this.props.userDetails?.role) &&
        this.props.userDetails.primaryOffice?.id === selectedLocation.id
      ) {
        return true
      }
    }
    return false
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (this.state.selectedLocation !== prevState.selectedLocation) {
      this.setState({
        officeSelected: this.isOfficeSelected(this.state.selectedLocation),
        isAccessibleOffice: this.isAccessibleOfficeSelected(
          this.state.selectedLocation
        )
      })
    }
  }

  getLoadingAuditListView(hasError?: boolean) {
    return (
      <>
        <Table
          id="loading-audit-list"
          isLoading={true}
          columns={this.getAuditColumns()}
          content={[]}
          noResultText={this.props.intl.formatMessage(messages.noAuditFound)}
          hideTableHeader={
            this.state.viewportWidth <= this.props.theme.grid.breakpoints.md
          }
        />
        {hasError && <GenericErrorToast />}
      </>
    )
  }

  render() {
    const { intl, user, theme, isLoading, isOnline } = this.props
    const { timeStart, timeEnd, currentPageNumber } = this.state
    const recordCount = DEFAULT_LIST_SIZE * this.state.currentPageNumber

    return (
      <RecentActionsHolder id="user-audit-list">
        {isLoading && this.getLoadingView()}
        {!isLoading && (
          <>
            <HistoryHeader>
              <SectionTitle>
                {intl.formatMessage(messages.auditSectionTitle)}
              </SectionTitle>
              <AlignedDateRangePicker
                startDate={timeStart}
                endDate={timeEnd}
                onDatesChange={({ startDate, endDate }) => {
                  this.setDateRangePickerValues(startDate, endDate)
                }}
              />
            </HistoryHeader>
            <>
              <Query
                query={FETCH_TIME_LOGGED_METRICS_FOR_PRACTITIONER}
                variables={{
                  timeStart: timeStart.toISOString(),
                  timeEnd: timeEnd.toISOString(),
                  practitionerId: user && user.practitionerId,
                  locationId: user && user.locationId,
                  count: recordCount,
                  skip: DEFAULT_LIST_SIZE * (currentPageNumber - 1)
                }}
                fetchPolicy={'no-cache'}
              >
                {({ data, loading, error }) => {
                  if (error) {
                    return this.getLoadingAuditListView(true)
                  } else {
                    const totalItems = Number(
                      (data &&
                        data.fetchTimeLoggedMetricsByPractitioner &&
                        data.fetchTimeLoggedMetricsByPractitioner.totalItems) ||
                        0
                    )

                    return (
                      <Table
                        columns={this.getAuditColumns()}
                        content={this.getAuditData(data, user)}
                        noResultText={intl.formatMessage(messages.noAuditFound)}
                        isLoading={loading}
                        hideTableHeader={
                          this.state.viewportWidth <= theme.grid.breakpoints.md
                        }
                        currentPage={this.state.currentPageNumber}
                        pageSize={recordCount}
                        totalItems={totalItems}
                        onPageChange={(currentPage: number) => {
                          this.setCurrentPage(currentPage)
                        }}
                      />
                    )
                  }
                }}
              </Query>
            </>
          </>
        )}
      </RecentActionsHolder>
    )
  }
}

export const UserAuditHistory = withTheme(
  injectIntl(withOnlineStatus(UserAuditHistoryComponent))
)
