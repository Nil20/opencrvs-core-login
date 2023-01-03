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

import { logger } from '@config/logger'
import InformantSMSNotification from '@config/models/informantSMSNotification'
import { badRequest } from '@hapi/boom'
import * as Hapi from '@hapi/hapi'
import * as Joi from 'joi'
import { Document } from 'mongoose'
import getInformantSMSNotification from '../getInformantSMSNotification/handler'

export interface IInformantSMSNotificationPayload extends Document {
  id: string
  name: string
  enabled: boolean
}

export default async function updateInformantSMSNotification(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) {
  const informantSMSNotificationPayload =
    request.payload as IInformantSMSNotificationPayload[]

  try {
    const existingInformantSMSNotification =
      await InformantSMSNotification.find().exec()
    if (!existingInformantSMSNotification) {
      throw badRequest(`No Informant SMS notifications found`)
    }

    const modifiedInformantSMSNotification =
      existingInformantSMSNotification.filter((informantSMSNotification) => {
        const hasModified = informantSMSNotificationPayload.find((inftNoti) => {
          String(inftNoti._id) === String(informantSMSNotification.id) &&
            (inftNoti.name !== informantSMSNotification.name ||
              inftNoti.enabled !== informantSMSNotification.enabled)
        })

        return hasModified
      })

    try {
      await Promise.all(
        modifiedInformantSMSNotification.map(
          async (informantSMSNotification) => {
            await InformantSMSNotification.updateOne(
              { _id: informantSMSNotification?.id },
              { ...informantSMSNotification, updatedAt: Date.now() }
            )
          }
        )
      )
    } catch (err) {
      return h.response(`Failed to update existing question. ${err}`).code(400)
    }

    const informantSMSNotification = await getInformantSMSNotification(
      request,
      h
    )
    return h.response(informantSMSNotification).code(201)
  } catch (err) {
    logger.error(err)
    return h.response('Could not update informantSMSNotification').code(400)
  }
}

export const requestSchema = Joi.array().items({
  id: Joi.string().required(),
  name: Joi.string().required(),
  enabled: Joi.boolean()
})
