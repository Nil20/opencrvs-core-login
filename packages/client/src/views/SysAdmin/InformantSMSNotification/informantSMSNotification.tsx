import * as React from 'react'
import styled from 'styled-components'
import {
  Event,
  GetInformantSmsNotificationsQuery,
  SmsNotification,
  SmsNotificationInput,
  ToggleInformantSmsNotificationMutation,
  ToggleInformantSmsNotificationMutationVariables
} from '@client/utils/gateway'
import { useIntl } from 'react-intl'
import {
  LoadingIndicator,
  useOnlineStatus
} from '@client/views/OfficeHome/LoadingIndicator'
import { useMutation, useQuery } from '@apollo/client'
import { GET_INFORMANT_SMS_NOTIFICATION } from './queries'
import { NOTIFICATION_STATUS } from '../Config/Application/utils'
import { buttonMessages, constantsMessages } from '@client/i18n/messages'
import { find, lowerFirst } from 'lodash'
import { TOGGLE_INFORMANT_SMS_NOTIFICATION_MUTATION } from './mutation'
import {
  Frame,
  FormTabs,
  ListViewItemSimplified,
  ListViewSimplified,
  Toast
} from '@client/../../components/lib'
import { Content, ContentSize } from '@opencrvs/components/lib/Content'
import { Label, Value } from '../Config/Application/Components'
import { messages } from '@client/i18n/messages/views/config'
import { Toggle } from '@client/../../components/lib/Toggle'
import { Header } from '@client/components/Header/Header'
import { Navigation } from '@client/components/interface/Navigation'
import { GenericErrorToast } from '@client/components/GenericErrorToast'
import { Button } from '@opencrvs/components/lib/Button'

const ToggleWrapper = styled.div`
  margin-left: 24px;
`
const Action = styled.div`
  margin-top: 32px;
`
type SmsNotificationProps = {
  items: SmsNotification[]
}

enum INotificationName {
  birthInProgressSMS = 'birthInProgressSMS',
  birthDeclarationSMS = 'birthDeclarationSMS',
  birthRegistrationSMS = 'birthRegistrationSMS',
  birthRejectionSMS = 'birthRejectionSMS',
  deathInProgressSMS = 'deathInProgressSMS',
  deathDeclarationSMS = 'deathDeclarationSMS',
  deathRegistrationSMS = 'deathRegistrationSMS',
  deathRejectionSMS = 'deathRejectionSMS'
}

type IState = { [key in INotificationName]: boolean }

const InformantNotification = () => {
  const intl = useIntl()
  const isOnline = useOnlineStatus()
  const { loading, error, data, refetch } =
    useQuery<GetInformantSmsNotificationsQuery>(
      GET_INFORMANT_SMS_NOTIFICATION,
      {
        fetchPolicy: 'no-cache'
      }
    )
  const informantNotificationsData = React.useMemo(() => {
    return data?.informantSMSNotifications ?? []
  }, [data])

  const [informantSMSNotificationsState, setInformantSMSNotificationsState] =
    React.useState<IState>({
      birthInProgressSMS: true,
      birthDeclarationSMS: true,
      birthRegistrationSMS: true,
      birthRejectionSMS: true,
      deathInProgressSMS: true,
      deathDeclarationSMS: true,
      deathRegistrationSMS: true,
      deathRejectionSMS: true
    })

  React.useEffect(() => {
    const updateState = () => {
      if (data && data.informantSMSNotifications) {
        setInformantSMSNotificationsState((state) => {
          const modifiedState: IState = { ...state }
          informantNotificationsData.forEach((notification) => {
            modifiedState[notification.name as INotificationName] =
              notification.enabled
          })
          return {
            ...state,
            ...modifiedState
          }
        })
      }
    }
    updateState()
  }, [data, setInformantSMSNotificationsState, informantNotificationsData])

  const [activeTabId, setActiveTabId] = React.useState(Event.Birth)
  const [notificationStatus, setNotificationStatus] =
    React.useState<NOTIFICATION_STATUS>(NOTIFICATION_STATUS.IDLE)

  const notificationState = Object.entries(informantSMSNotificationsState).map(
    ([name, enabled]) => ({
      name,
      enabled
    })
  )

  const tabSections = [
    {
      id: Event.Birth,
      title: intl.formatMessage(constantsMessages.births)
    },
    {
      id: Event.Death,
      title: intl.formatMessage(constantsMessages.deaths)
    }
  ]

  const toggleOnChange = (notificationName: INotificationName) => {
    setInformantSMSNotificationsState({
      ...informantSMSNotificationsState,
      [notificationName]: !informantSMSNotificationsState[notificationName]
    })
  }

  const isNotificationChanges = (notificationData: SmsNotification[]) => {
    return !notificationData.every((notification) => {
      const diff = find(notificationState, {
        name: notification.name,
        enabled: notification.enabled
      })
      return Boolean(diff)
    })
  }

  const [informantSMSNotificationsResult] = useMutation<
    ToggleInformantSmsNotificationMutation,
    ToggleInformantSmsNotificationMutationVariables
  >(TOGGLE_INFORMANT_SMS_NOTIFICATION_MUTATION, {
    onError() {
      setNotificationStatus(NOTIFICATION_STATUS.ERROR)
    },
    async onCompleted() {
      console.log('here')

      await refetch()
      setNotificationStatus(NOTIFICATION_STATUS.SUCCESS)
    }
  })

  const informantNotificationMutationHandler = async (
    notificationData: SmsNotification[]
  ) => {
    const updatedInformantNotifications = notificationData.map(
      (notification) => {
        return {
          id: notification.id as string,
          name: notification.name,
          enabled: Boolean(
            notificationState.find(
              (notifState) => notifState.name === notification.name
            )?.enabled
          )
        }
      }
    )

    await informantSMSNotificationsResult({
      variables: {
        smsNotifications:
          updatedInformantNotifications as SmsNotificationInput[]
      }
    })
  }

  const TabContent = (props: SmsNotificationProps) => {
    const intl = useIntl()
    const items: SmsNotification[] = props.items
    return (
      <>
        <ListViewSimplified key={`listViewSimplified`}>
          {items.map((item: SmsNotification) => {
            return (
              <ListViewItemSimplified
                label={
                  <Label id={`${item.name}_label`}>
                    {intl.formatMessage(
                      messages[lowerFirst(item.name.slice(5))]
                    )}
                  </Label>
                }
                value={<Value id={`${item.name}_value`}>{item.message}</Value>}
                actions={
                  <ToggleWrapper>
                    <Toggle
                      id={`${item.name}`}
                      defaultChecked={Boolean(
                        informantSMSNotificationsState[
                          item.name as INotificationName
                        ]
                      )}
                      onChange={() => {
                        toggleOnChange(item.name as INotificationName)
                      }}
                    />
                  </ToggleWrapper>
                }
              />
            )
          })}
        </ListViewSimplified>
      </>
    )
  }

  return (
    <>
      <Frame
        header={<Header mobileSearchBar={true} enableMenuSelection={false} />}
        navigation={<Navigation />}
        skipToContentText={intl.formatMessage(
          constantsMessages.skipToMainContent
        )}
      >
        <Content
          title={intl.formatMessage(messages.informantNotifications)}
          titleColor={'copy'}
          subtitle={intl.formatMessage(messages.informantNotificationSubtitle)}
          tabBarContent={
            <FormTabs
              sections={tabSections}
              activeTabId={activeTabId}
              onTabClick={(id: React.SetStateAction<Event>) =>
                setActiveTabId(id)
              }
            />
          }
        >
          {error && <GenericErrorToast />}
          {loading && <LoadingIndicator loading />}
          {!error && !loading && (
            <>
              <TabContent
                items={informantNotificationsData.filter(({ name }) =>
                  name.includes(activeTabId)
                )}
              />
              <Action>
                <Button
                  id="save"
                  type="primary"
                  onClick={async () => {
                    setNotificationStatus(NOTIFICATION_STATUS.IN_PROGRESS)
                    await informantNotificationMutationHandler(
                      informantNotificationsData
                    )
                  }}
                  disabled={
                    !isOnline ||
                    !isNotificationChanges(informantNotificationsData) ||
                    notificationStatus === NOTIFICATION_STATUS.IN_PROGRESS
                  }
                  loading={
                    notificationStatus === NOTIFICATION_STATUS.IN_PROGRESS
                  }
                >
                  {notificationStatus === NOTIFICATION_STATUS.IN_PROGRESS
                    ? intl.formatMessage(buttonMessages.saving)
                    : intl.formatMessage(buttonMessages.save)}
                </Button>
              </Action>
            </>
          )}

          {(notificationStatus === NOTIFICATION_STATUS.SUCCESS ||
            notificationStatus === NOTIFICATION_STATUS.ERROR) && (
            <Toast
              id={`informant_notification`}
              type={
                notificationStatus === NOTIFICATION_STATUS.SUCCESS
                  ? 'success'
                  : 'error'
              }
              onClose={() => {
                setNotificationStatus(NOTIFICATION_STATUS.IDLE)
              }}
            >
              {notificationStatus === NOTIFICATION_STATUS.ERROR
                ? intl.formatMessage(messages.applicationConfigChangeError)
                : intl.formatMessage(
                    messages.informantNotificationUpdatingMessage
                  )}
            </Toast>
          )}
        </Content>
      </Frame>
    </>
  )
}

export default InformantNotification
