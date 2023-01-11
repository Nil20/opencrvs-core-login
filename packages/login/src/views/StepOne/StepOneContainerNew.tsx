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
import { FormApi, SubmissionErrors } from 'final-form'

const usernameField = stepOneFields.username
const passwordField = stepOneFields.password

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
      )}
    </Field>
  )
}

export function StepOneContainerNew() {
  return (
    <Container id="login-step-one-box">
      <Form
        onSubmit={function (
          values: Record<string, any>,
          form: FormApi<Record<string, any>, Partial<Record<string, any>>>,
          callback?: ((errors?: SubmissionErrors) => void) | undefined
        ): void | SubmissionErrors | Promise<SubmissionErrors> {
          throw new Error('Function not implemented.')
        }}
      >
        <UsernameInput />
      </Form>

      <Form
        onSubmit={function (
          values: Record<string, any>,
          form: FormApi<Record<string, any>, Partial<Record<string, any>>>,
          callback?: ((errors?: SubmissionErrors) => void) | undefined
        ): void | SubmissionErrors | Promise<SubmissionErrors> {
          throw new Error('Function not implemented.')
        }}
      >
        <Password />
      </Form>
    </Container>
  )
}
