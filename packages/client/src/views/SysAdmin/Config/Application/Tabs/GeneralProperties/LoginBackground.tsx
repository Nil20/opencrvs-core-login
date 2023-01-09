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

import { getOfflineData } from '@client/offline/selectors'
import { IStoreState } from '@client/store'
import * as React from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { HalfWidthInput } from '../../Components'

export enum TabId {
  COLOUR = 'Colour',
  IMAGE = 'Image'
}
enum BackgroundSize {
  FILL = 'FILL',
  TILE = 'TILE'
}
const Box = styled.span`
  width: 40px;
  height: 40px;
  margin-left: 5px;
  border: 2px solid ${({ theme }) => theme.colors.grey300};
  background-color: ${(p) => (p.color ? p.color : '#fff')};
`
const HexInput = styled(HalfWidthInput)`
  width: 200px;
`
export const LoginBackground = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const offlineLoginConfiguration = useSelector((store: IStoreState) =>
    getOfflineData(store)
  )
}
