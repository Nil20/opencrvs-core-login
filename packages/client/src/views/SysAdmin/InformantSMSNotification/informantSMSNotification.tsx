import * as React from 'react'
import styled from 'styled-components'
import {
  Event,
  GetInformantSmsNotificationsQuery,
  SmsNotification
} from '@client/utils/gateway'
import { useIntl } from 'react-intl'
import { useOnlineStatus } from '@client/views/OfficeHome/LoadingIndicator'
import { useQuery } from '@apollo/client'
import { GET_INFORMANT_SMS_NOTIFICATION } from './queries'
import { NOTIFICATION_STATUS } from '../Config/Application/utils'

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
  const IsOnline = useOnlineStatus()
  const { loading, error, data, refetch } =
    useQuery<GetInformantSmsNotificationsQuery>(
      GET_INFORMANT_SMS_NOTIFICATION,
      {
        fetchPolicy: 'no-cache'
      }
    )
  const informantSMSNotificationsData = React.useMemo(() => {
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
          informantSMSNotificationsData.forEach((notification) => {
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
  }, [data, setInformantSMSNotificationsState, informantSMSNotificationsData])

  const [activeId, setActiveId] = React.useState(Event.Birth)
  const [notificationStatus, setNotificationStatus] =
    React.useState<NOTIFICATION_STATUS>(NOTIFICATION_STATUS.IDLE)

  const notificationState = Object.entries(informantSMSNotificationsState).map(
    ([name, enabled]) => ({
      name,
      enabled
    })
  )
}
