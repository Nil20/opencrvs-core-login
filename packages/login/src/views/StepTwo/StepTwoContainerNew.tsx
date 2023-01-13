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
import { stepTwoFields } from './stepTwoFields'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Field, Form } from 'react-final-form'
import {
  Box,
  InputField,
  Text,
  TextInput,
  Toast
} from '@login/../../components/lib'
import { messages } from '@login/i18n/messages/views/stepTwoForm'
import { CountryLogo } from '@login/../../components/lib/icons'
import {
  ActionWrapper,
  FieldWrapper,
  FormWrapper,
  LogoContainer,
  StyledButton,
  Title
} from '../StepOne/StepOneForm'
import {
  getResentSMS,
  getStepOneDetails,
  getSubmissionError,
  getSubmitting,
  selectCountryBackground,
  usePersistentCountryLogo
} from '@login/login/selectors'
import { IVerifyCodeNumbers } from '@login/login/actions'
import * as actions from '@login/login/actions'
import { useDispatch, useSelector } from 'react-redux'
import { PrimaryButton } from '@login/../../components/lib/buttons'
import { ceil, concat } from 'lodash'

const verificationCode = stepTwoFields.code

const StyledH2 = styled.h2`
  ${({ theme }) => theme.fonts.h2};
  font-weight: 400;
  text-align: center;
  color: ${({ theme }) => theme.colors.grey600};
`

const Container = styled.div<{ background: string }>`
  ${({ background }) => `background-color: ${background}`};
  position: relative;
  height: 100vh;
  padding: 0px;
  margin: 0px auto;
  width: 500px;
`

const VerificationCodeInput = () => {
  const intl = useIntl()

  return (
    <Field name={verificationCode.name} field={verificationCode}>
      {({ meta, input, ...otherProps }) => (
        <InputField
          {...verificationCode}
          {...otherProps}
          touched={Boolean(meta.touched)}
          label={intl.formatMessage(messages.verficationCodeLabel)}
          ignoreMediaQuery
          hideAsterisk
        >
          <TextInput
            {...verificationCode}
            {...input}
            touched={Boolean(meta.touched)}
            ignoreMediaQuery
            error={Boolean(meta.error)}
          />
        </InputField>
      )}
    </Field>
  )
}

const FORM_NAME = 'step-two'

export function StepTwoContainerNew() {
  const intl = useIntl()
  const logo = usePersistentCountryLogo()
  const dispatch = useDispatch()
  const resendSMS = useSelector(getResentSMS)
  const stepOneDetails = useSelector(getStepOneDetails)
  const submitting = useSelector(getSubmitting)
  const submissionError = useSelector(getSubmissionError)

  const maskPercentage = 0.6
  const numberLength = stepOneDetails.mobile.length
  const unmaskedNumberLength =
    numberLength - ceil(maskPercentage * numberLength)
  const startForm = ceil(unmaskedNumberLength / 2)
  const endBefore = unmaskedNumberLength - startForm
  const hiddenNumber = stepOneDetails.mobile.replace(
    stepOneDetails.mobile.slice(
      startForm,
      stepOneDetails.mobile.length - endBefore
    ),
    '*'.repeat(stepOneDetails.mobile.length - startForm - endBefore)
  )
  const backgroundDetails = useSelector(selectCountryBackground)?.toString()
  const hash = '#'
  const concatHash = concat(hash + backgroundDetails).toString()

  return (
    <Container id="step-two-form" background={concatHash}>
      <Box id="box">
        <Title>
          <LogoContainer>
            <CountryLogo src={logo} />
          </LogoContainer>
          {resendSMS ? (
            <>
              <StyledH2>
                {intl.formatMessage(messages.stepTwoResendTitle)}
              </StyledH2>

              <p>
                {intl.formatMessage(messages.resentSMS, {
                  number: hiddenNumber
                })}
              </p>
            </>
          ) : (
            <>
              <React.Fragment>
                <StyledH2>{intl.formatMessage(messages.stepTwoTitle)}</StyledH2>
                <Text variant="reg16" element="p">
                  {intl.formatMessage(messages.stepTwoInstruction, {
                    number: hiddenNumber
                  })}
                </Text>
              </React.Fragment>
            </>
          )}
          {submissionError && (
            <Toast type="error">
              {intl.formatMessage(messages.codeSubmissionError)}
            </Toast>
          )}
        </Title>

        <Form
          onSubmit={(values: IVerifyCodeNumbers) =>
            dispatch(actions.verifyCode(values))
          }
        >
          {({ handleSubmit }) => (
            <FormWrapper onSubmit={handleSubmit} id={FORM_NAME}>
              <FieldWrapper>
                <Field
                  name={verificationCode.name}
                  component={VerificationCodeInput}
                />
              </FieldWrapper>

              <ActionWrapper>
                <PrimaryButton
                  id="verify-button"
                  disabled={submitting}
                  type="submit"
                >
                  {intl.formatMessage(messages.verify)}
                </PrimaryButton>
                <br />
                <StyledButton
                  id="resend-sms-button"
                  type="button"
                  onClick={() => dispatch(actions.resendSMS())}
                >
                  {intl.formatMessage(messages.resend)}
                </StyledButton>
              </ActionWrapper>
            </FormWrapper>
          )}
        </Form>
      </Box>
    </Container>
  )
}
