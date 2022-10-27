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
import { ComponentMeta } from '@storybook/react'
import { Accordion } from './Accordion'
import React, { useState } from 'react'

export default {
  title: 'Data/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: `
\`<Accordion>\` 
`
      }
    }
  }
} as ComponentMeta<typeof Accordion>

export const text = () => (
  <Accordion
    title="Select name"
    details="Something small enough to escape casual notice."
  />
)
