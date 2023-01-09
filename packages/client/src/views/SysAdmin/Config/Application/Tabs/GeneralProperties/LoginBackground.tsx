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

import { IAttachmentValue } from '@client/forms'
import { messages } from '@client/i18n/messages/views/config'
import { getOfflineData } from '@client/offline/selectors'
import { IStoreState } from '@client/store'
import { EMPTY_STRING } from '@client/utils/constants'
import * as React from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { HalfWidthInput } from '../../Components'
import {
  isValidHexColorCode,
  isValidHexColorCodeEntry,
  NOTIFICATION_STATUS
} from '../../utils'

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

  const [loginBackgroundFilename, setBackgroundFilename] =
    React.useState(EMPTY_STRING)
  const [hexValue, setHexValue] = React.useState(EMPTY_STRING)
  const [isRequestVal, setRequestValid] = React.useState(false)
  const selectOptions = () => {
    const array = [
      { label: BackgroundSize.FILL, value: BackgroundSize.FILL },
      { label: BackgroundSize.TILE, value: BackgroundSize.TILE }
    ]
  }
  const [seletedOption, onOptionChange] = React.useState({
    label: BackgroundSize.FILL,
    value: BackgroundSize.FILL
  })
  const [backgroundType, setBackgroundType] = React.useState(
    BackgroundSize.FILL
  )
  const [showColour, setShowColour] = React.useState(false)
  const [errorOccured, setErrorOccured] = React.useState(false)
  const [errorMessages, setErrorMessages] = React.useState(EMPTY_STRING)
  const [backgroundImage, setBackgroundImage] = React.useState(EMPTY_STRING)
  const [isFileUploading, setIsFileUploading] = React.useState(false)
  const [backgroundFile, setBackgroundFile] = React.useState<{
    name: string
    type: string
    data: string
  }>({
    name: EMPTY_STRING,
    type: EMPTY_STRING,
    data: EMPTY_STRING
  })
  const [notificationState, setNotificationState] =
    React.useState<NOTIFICATION_STATUS>(NOTIFICATION_STATUS.IDLE)
  const [activeTabId, setActiveTabId] = React.useState(TabId.COLOUR)
  const tabSection = [
    {
      id: TabId.COLOUR,
      title: intl.formatMessage(messages.colourTabText)
    },
    {
      id: TabId.IMAGE,
      title: intl.formatMessage(messages.imageTabTitle)
    }
  ]
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toUpperCase()

    if (isValidHexColorCodeEntry(value)) {
      setHexValue(value)
    }
    if (isValidHexColorCode(value)) {
      setShowColour(true)
      setRequestValid(true)
    } else {
      setShowColour(false)
      setRequestValid(false)
    }
  }

  const handleBackgroundImage = (data: string) => {
    setBackgroundImage(data)
    setRequestValid(true)
  }

  const clearInputs = () => {
    setHexValue(EMPTY_STRING)
    setBackgroundImage(EMPTY_STRING)
    setRequestValid(false)
    handleBackgroundImageFile({
      name: EMPTY_STRING,
      type: EMPTY_STRING,
      data: EMPTY_STRING
    })
  }

  const handleBackgroundImageFile = (data: IAttachmentValue) => {
    setBackgroundFile(data)
  }
}
