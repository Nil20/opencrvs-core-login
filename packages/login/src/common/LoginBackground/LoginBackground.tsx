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

import { getTheme, Spinner } from '@login/../../components/lib'
import {
  selectCountryBackground,
  selectCountryLogo
} from '@login/login/selectors'
import React from 'react'
import { useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'
import { IPage } from '../Page'

const StyledPage = styled.div<IPage>`
  background: ${({ theme }) => theme.colors.backgroundPrimary};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ submitting }) =>
    submitting && `justify-content: center; align-items: center;`}
  * {
    box-sizing: border-box;
    -webkit-font-smoothing: subpixel-antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  *:before,
  *:after {
    box-sizing: border-box;
  }
`

export function usePersistentCountryBackground() {
  const [offlineBackground, setOfflineBackground] = React.useState(
    localStorage.getItem('country-background') ?? ''
  )
  const background = useSelector(selectCountryBackground)
  if (background && background !== offlineBackground) {
    setOfflineBackground(background)
    localStorage.setItem('country-background', background)
  }
  return offlineBackground
}

export function usePersistentCountryLogo() {
  const [offlineLogo, setOfflineLogo] = React.useState(
    localStorage.getItem('country-logo') ?? ''
  )
  const logo = useSelector(selectCountryLogo)
  if (logo && logo !== offlineLogo) {
    setOfflineLogo(logo)
    localStorage.setItem('country-logo', logo)
  }
  return offlineLogo
}

export class LoginBackground extends React.Component<
  IPage,
  RouteComponentProps<{}>
> {
  render() {
    const { children, submitting } = this.props
    return (
      <div>
        <StyledPage {...this.props}>
          {submitting ? (
            <Spinner
              id="login-submitting-spinner"
              baseColor={getTheme().colors.white}
            />
          ) : (
            children
          )}
        </StyledPage>
      </div>
    )
  }
}
