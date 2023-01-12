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

import * as React from 'react'
import { stepOneFields } from './stepOneFields'
import { useIntl } from 'react-intl'
import { Field, Form } from 'react-final-form'
import { InputField } from '@login/../../components/lib/InputField'
import { TextInput } from '@login/../../components/lib/TextInput'
import { messages } from '@login/i18n/messages/views/stepOneForm'
import { PasswordInput } from '@login/../../components/lib/PasswordInput'
import styled from 'styled-components'
import { IAuthenticationData } from '@login/utils/authApi'
import { CountryLogo } from '@login/../../components/lib/icons'
import { Box, Toast } from '@login/../../components'
import {
  ActionWrapper,
  FieldWrapper,
  FormWrapper,
  LogoContainer,
  StyledButton,
  StyledButtonWrapper
} from './StepOneForm'
import {
  getErrorCode,
  getSubmissionError,
  getSubmitting,
  usePersistentCountryLogo
} from '@login/login/selectors'
import { useDispatch, useSelector } from 'react-redux'
import * as actions from '@login/login/actions'
import { Button } from '@login/../../components/lib/Button'
import { goToForgottenItemForm } from '@login/login/actions'
import {
  ERROR_CODE_FIELD_MISSING,
  ERROR_CODE_FORBIDDEN_CREDENTIALS,
  ERROR_CODE_INVALID_CREDENTIALS,
  ERROR_CODE_PHONE_NUMBER_VALIDATE
} from '@login/utils/authUtils'

const usernameField = stepOneFields.username
const passwordField = stepOneFields.password

const StyledH2 = styled.h2`
  ${({ theme }) => theme.fonts.h2};
  font-weight: 400;
  text-align: center;
  color: ${({ theme }) => theme.colors.grey600};
`

const Container = styled.div`
  position: relative;
  height: auto;
  padding: 0px;
  margin: 0px auto;
  width: 500px;
`

const UsernameInput = () => {
  const intl = useIntl()

  return (
    <Field name={usernameField.name}>
      {({ meta, input, ...otherProps }) => (
        <InputField
          {...usernameField}
          {...otherProps}
          touched={Boolean(meta.touched)}
          label={intl.formatMessage(usernameField.label)}
          optionalLabel={intl.formatMessage(messages.optionalLabel)}
          ignoreMediaQuery
          hideAsterisk
        >
          <TextInput
            {...usernameField}
            {...input}
            touched={Boolean(meta.touched)}
            error={Boolean(meta.error)}
            type="text"
            ignoreMediaQuery
          />
        </InputField>
      )}
    </Field>
  )
}

const Password = () => {
  const intl = useIntl()

  return (
    <Field name={passwordField.name}>
      {({ meta, input, ...otherProps }) => (
        <>
          <InputField
            {...passwordField}
            {...otherProps}
            touched={Boolean(meta.touched)}
            label={intl.formatMessage(passwordField.label)}
            optionalLabel={intl.formatMessage(messages.optionalLabel)}
            ignoreMediaQuery
            hideAsterisk
          >
            <PasswordInput
              {...passwordField}
              {...input}
              touched={Boolean(meta.touched)}
              error={Boolean(meta.error)}
              ignoreMediaQuery
            />
          </InputField>
        </>
      )}
    </Field>
  )
}

const FORM_NAME = 'step-one'

export function StepOneContainerNew() {
  const submitting = useSelector(getSubmitting)
  const errorCode = useSelector(getErrorCode)
  const intl = useIntl()
  const logo = usePersistentCountryLogo()
  const dispatch = useDispatch()
  const submissionError = useSelector(getSubmissionError)
  const isOffline: boolean = navigator.onLine ? false : true

  return (
    <Container id="login-step-one-box">
      <Box id="box">
        <LogoContainer>
          <CountryLogo src={logo} />
        </LogoContainer>
        <Form
          onSubmit={(values: IAuthenticationData) =>
            dispatch(actions.authenticate(values))
          }
        >
          {({ handleSubmit }) => (
            <FormWrapper id={FORM_NAME} onSubmit={handleSubmit}>
              <StyledH2>
                {intl.formatMessage(messages.stepOneLoginText)}
              </StyledH2>

              <FieldWrapper>
                <Field name={usernameField.name} component={UsernameInput} />
              </FieldWrapper>

              <FieldWrapper>
                <Field name={passwordField.name} component={Password} />
              </FieldWrapper>

              <ActionWrapper>
                <Button
                  id="login-mobile-submit"
                  type="primary"
                  loading={submitting}
                >
                  {intl.formatMessage(messages.submit)}
                </Button>

                <StyledButtonWrapper>
                  <StyledButton
                    id="forgot-password-button"
                    type="button"
                    onClick={() => dispatch(goToForgottenItemForm())}
                  >
                    {intl.formatMessage(messages.forgotPassword)}
                  </StyledButton>
                </StyledButtonWrapper>
              </ActionWrapper>
            </FormWrapper>
          )}
        </Form>
      </Box>

      {submissionError && errorCode ? (
        <Toast type="error">
          {errorCode === ERROR_CODE_FIELD_MISSING &&
            intl.formatMessage(messages.fieldMissing)}
          {errorCode === ERROR_CODE_INVALID_CREDENTIALS &&
            intl.formatMessage(messages.submissionError)}
          {errorCode === ERROR_CODE_FORBIDDEN_CREDENTIALS &&
            intl.formatMessage(messages.forbiddenCredentialError)}
          {errorCode === ERROR_CODE_PHONE_NUMBER_VALIDATE &&
            intl.formatMessage(messages.phoneNumberFormat)}
        </Toast>
      ) : (
        isOffline && (
          <Toast type="error">
            {intl.formatMessage(messages.networkError)}
          </Toast>
        )
      )}
    </Container>
  )
}
