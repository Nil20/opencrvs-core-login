/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */

import * as JWT from 'hapi-auth-jwt2'
import * as Pino from 'hapi-pino'
import * as Sentry from 'hapi-sentry'
import { SENTRY_DSN } from '@gateway/constants'
import { logger } from '@gateway/logger'
import * as HapiSwagger from 'hapi-swagger'
import { ServerRegisterPluginObject } from '@hapi/hapi'
import * as H2o2 from '@hapi/h2o2'

export const getPlugins = () => {
  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'Gateway API Documentation',
      version: '1.3.0'
    },
    definitionPrefix: 'useLabel',
    basePath: '/v1/',
    schemes: ['http', 'https'],
    swaggerUI: false,
    documentationPage: false
  }

  const plugins = [
    JWT,
    {
      plugin: Pino,
      options: {
        prettyPrint: true,
        logPayload: false,
        instance: logger
      }
    },
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    },
    H2o2
  ] as Array<ServerRegisterPluginObject<any>>

  if (SENTRY_DSN) {
    plugins.push({
      plugin: Sentry,
      options: {
        client: {
          dsn: SENTRY_DSN,
          environment: process.env.DOMAIN
        },
        catchLogErrors: true
      }
    })
  }
  return plugins
}
