import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { getInCreationCause } from 'redux/Cause/selectors';
import { userLoggedIn } from 'redux/Login';
import { useTypedAsyncFn } from 'redux/useTypedAsyncFn';
import { PATHS } from 'routes';
import HandleErrorService from 'services/HandleErrorService';
import { PasswordForm } from './Password';

export const useValidatePasswordForm = () => {
  const intl = useIntl();

  const validateForm = ({ password, passwordConfirmation }: PasswordForm) => {
    const errors = {} as PasswordForm;
    const requiredErrorMessage = intl.formatMessage({ id: 'form_errors.required' });

    if (password === undefined || password.length === 0) {
      errors.password = requiredErrorMessage;
    }

    if (password !== undefined && password.length < 8) {
      errors.password = intl.formatMessage({ id: 'form_errors.not-long-enough-password' });
    }

    if (passwordConfirmation === undefined || passwordConfirmation.length === 0) {
      errors.passwordConfirmation = requiredErrorMessage;
    }

    if (password !== passwordConfirmation) {
      errors.passwordConfirmation = intl.formatMessage({ id: 'form_errors.unmatched-password' });
    }

    return errors;
  };

  return { validateForm };
};

type ConfirmPasswordPayload = {
  password: string;
  passwordConfirmation: string;
  identifier: string;
  token: string;
};

export const useConfirmPassword = () => {
  const causeToPublish = useSelector(getInCreationCause);
  const { push } = useHistory();
  const dispatch = useDispatch();
  //const [, login] = useLogin();

  const [{ loading, error }, doConfirmPassword] = useTypedAsyncFn(
    async (payload: ConfirmPasswordPayload) => {
      //await authenticatedApiClient.post('v3/confirm-password', { payload });
      console.log('payload', payload);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { code: 'authorizationCode' };
    },
    [],
  );

  const confirmPasswordAndLogin = useCallback(
    async (password: string, passwordConfirmation: string, identifier: string, token: string) => {
      const response = await doConfirmPassword({
        password,
        passwordConfirmation,
        identifier,
        token,
      });
      if (response instanceof Error) return;

      //await login(response.code)
      dispatch(userLoggedIn({ accessToken: 'accessToken', refreshToken: 'refreshToken' }));
      if (causeToPublish !== undefined) {
        push(PATHS.CAUSE_PREVIEW.url());
      } else {
        push(PATHS.HOME.url());
      }
    },
    [causeToPublish, dispatch, doConfirmPassword, push],
  );

  if (error !== undefined) {
    HandleErrorService.showErrorSnackbar(error);
  }
  return { loading, error, confirmPasswordAndLogin };
};
