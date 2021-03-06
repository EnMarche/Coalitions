import React, { useState } from 'react';
import { useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';
import { useValidatePasswordForm, useConfirmPassword } from './services';
import { useParams } from 'react-router';
import { Severity } from 'redux/Snackbar/types';
import {
  PasswordContainer,
  PasswordFormWrapper,
  ConfirmPasswordButton,
  Title,
} from './Password.style';
import { PasswordField } from './PasswordField/PasswordField';
import { StyledAlert, StyledSnackbar } from 'components/Snackbar/Snackbar.style';
import { DefaultButton } from 'components/Button/Button';
import { forgottenPasswordUrl } from 'services/networking/auth';

export type PasswordForm = {
  password: string;
  passwordConfirmation: string;
};

type PasswordQueryParams = {
  identifier: string;
  token: string;
};

export const Password: React.FunctionComponent = () => {
  const { formatMessage } = useIntl();
  const { validateForm } = useValidatePasswordForm();
  const [showPassword, setShowPassword] = useState(false);
  const { identifier, token } = useParams<PasswordQueryParams>();
  const { openCustomSnackbar, loading, confirmPasswordAndLogin } = useConfirmPassword();
  const formik = useFormik<PasswordForm>({
    initialValues: { password: '', passwordConfirmation: '' },
    validate: validateForm,
    onSubmit: (values: PasswordForm) => {
      confirmPasswordAndLogin(values.password, values.passwordConfirmation, identifier, token);
    },
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <PasswordContainer>
        <PasswordFormWrapper>
          <Title>
            <FormattedMessage id="password_modal.title" />
          </Title>
          <form onSubmit={formik.handleSubmit}>
            <PasswordField
              name="password"
              touched={formik.touched.password}
              errors={formik.errors.password}
              placeholder={formatMessage({ id: 'password_modal.password' })}
              value={formik.values.password}
              showPassword={showPassword}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              togglePassword={togglePassword}
            />
            <PasswordField
              name="passwordConfirmation"
              touched={formik.touched.passwordConfirmation}
              errors={formik.errors.passwordConfirmation}
              placeholder={formatMessage({ id: 'password_modal.password-confirm' })}
              value={formik.values.passwordConfirmation}
              showPassword={showPassword}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              togglePassword={togglePassword}
            />
            <ConfirmPasswordButton
              disabled={
                Object.keys(formik.errors).length > 0 ||
                formik.touched.password !== true ||
                formik.touched.passwordConfirmation !== true
              }
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              isLoading={loading}
            >
              {formatMessage({ id: 'password_modal.submit' })}
            </ConfirmPasswordButton>
          </form>
        </PasswordFormWrapper>
      </PasswordContainer>
      <StyledSnackbar open={openCustomSnackbar} autoHideDuration={6000}>
        <StyledAlert
          severity={Severity.error}
          action={
            <DefaultButton
              color="inherit"
              size="small"
              onClick={() => (window.location.href = forgottenPasswordUrl)}
            >
              <FormattedMessage id="password_modal.reset-password" />
            </DefaultButton>
          }
        >
          <FormattedMessage id="password_modal.expired-link" />
        </StyledAlert>
      </StyledSnackbar>
    </>
  );
};

export default Password;
