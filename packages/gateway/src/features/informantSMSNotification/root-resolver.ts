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

import { GQLResolver } from '@gateway/graphql/schema'
import { hasScope } from '@gateway/features/user/utils'
import { URL } from 'url'
import { APPLICATION_CONFIG_URL, COUNTRY_CONFIG_URL } from '@gateway/constants'
import fetch from 'node-fetch'
import {
  IInformantSMSNotification,
  INotificationMessages,
  NOTIFICATION_WITH_MAPPING_WITH_RESOURCE
} from '@gateway/features/informantSMSNotification/type-resolver'

export const resolvers: GQLResolver = {
  Query: {
    async informantSMSNotifications(_, {}, authHeader) {
      if (!hasScope(authHeader, 'natlsysadmin')) {
        return await Promise.reject(
          new Error(
            'Toggle informantSMSNotification is only allowed for natlsysadmin'
          )
        )
      }

      const informantSMSNotificationURL = new URL(
        '/informantSMSNotification',
        APPLICATION_CONFIG_URL
      ).toString()

      const informantSMSNotifications = await fetch(
        informantSMSNotificationURL,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            ...authHeader
          }
        }
      )

      if (informantSMSNotifications.status !== 200) {
        return await Promise.reject(
          new Error(
            `Something went wrong on config service. Couldn't get informantSMSNotification`
          )
        )
      }

      const informantSMSNotificationResponse =
        (await informantSMSNotifications.json()) as IInformantSMSNotification[]

      const notificationContentURL = new URL(
        '/content/notification',
        COUNTRY_CONFIG_URL
      ).toString()

      const contentNotification = await fetch(notificationContentURL, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          ...authHeader
        }
      })

      const notificationContentResponse =
        (await contentNotification.json()) as INotificationMessages

      const notificationEnglishMessages =
        notificationContentResponse.languages.find(
          (item) => item.lang === 'en'
        )?.messages

      return informantSMSNotificationResponse.map((informantSMSNoti) => {
        const mappedName =
          NOTIFICATION_WITH_MAPPING_WITH_RESOURCE[informantSMSNoti.name]
        const message = notificationEnglishMessages
          ? notificationEnglishMessages[mappedName]
          : ''
        return {
          ...informantSMSNoti,
          name: informantSMSNoti.name,
          message
        }
      })
    }
  },

  Mutation: {
    async toggleInformantSMSNotification(_, { smsNotifications }, authHeader) {
      if (!hasScope(authHeader, 'natlsysadmin')) {
        return await Promise.reject(
          new Error(
            `Toggle informantSMSNotification is only allowed for natlsysadmin`
          )
        )
      }
      const informantSMSNotificationURL = new URL(
        '/informantSMSNotification',
        APPLICATION_CONFIG_URL
      ).toString()

      const res = await fetch(informantSMSNotificationURL, {
        method: 'PUT',
        body: JSON.stringify(smsNotifications),
        headers: {
          'Content-type': 'application/json',
          ...authHeader
        }
      })

      if (res.status !== 201) {
        return await Promise.reject(
          new Error(
            `Something went wrong on config service. Couldn't update informantSMSNotification`
          )
        )
      }

      const informantSMSNotificationResponse =
        (await res.json()) as IInformantSMSNotification[]

      const notificationContentURL = new URL(
        '/content/notification',
        COUNTRY_CONFIG_URL
      ).toString()

      const notificationContent = await fetch(notificationContentURL, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          ...authHeader
        }
      })

      const notificationContentResponse =
        (await notificationContent.json()) as INotificationMessages

      const notificationEnglishMessages =
        notificationContentResponse.languages.find(
          (item) => item.lang === 'en'
        )?.messages

      return informantSMSNotificationResponse.map((informantNoti) => {
        const mappedName =
          NOTIFICATION_WITH_MAPPING_WITH_RESOURCE[informantNoti.name]
        const message = notificationEnglishMessages
          ? notificationEnglishMessages[mappedName]
          : ''
        return {
          ...informantNoti,
          name: informantNoti.name,
          message
        }
      })
    }
  }
}
