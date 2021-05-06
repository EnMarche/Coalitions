import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { getInCreationCause } from 'redux/Cause/selectors';
import { setAfterAuthRedirect, userLoggedIn } from 'redux/Login';
import { useAfterAuthAction } from 'redux/Login/hooks/useAfterAuthAction';
import { useTypedAsyncFn } from 'redux/useTypedAsyncFn';
import { PATHS } from 'routes';
import HandleErrorService, { APIErrorsType, doesErrorIncludes } from 'services/HandleErrorService';
import { oauthClientId, oauthUrl } from 'services/networking/auth';
import { coalitionApiClient } from 'services/networking/client';
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

const useConfirmPasswordErrorHandler = () => {
  return useCallback((error?: APIErrorsType) => {
    if (error instanceof Response || error === undefined || error.message === undefined) {
      return null;
    }
    return null;
  }, []);
};

type ConfirmPasswordPayload = {
  password: string;
  passwordConfirmation: string;
  identifier: string;
  token: string;
};

export const useConfirmPassword = () => {
  const causeToPublish = useSelector(getInCreationCause);
  const dispatch = useDispatch();
  const errorHandler = useConfirmPasswordErrorHandler();
  const [openCustomSnackbar, setOpenCustomSnackbar] = useState(false);
  const { performAfterAuthAction } = useAfterAuthAction();

  const [{ loading, error }, doConfirmPassword] = useTypedAsyncFn(
    async (payload: ConfirmPasswordPayload) => {
      return await coalitionApiClient.post(
        `profile/mot-de-passe/${payload.identifier}/${payload.token}?client_id=${oauthClientId}&scope=read:profile+write:profile`,
        {
          password: payload.password,
        },
      );
    },
    [],
  );

  useEffect(() => {
    if (error !== undefined) {
      if (doesErrorIncludes(error, '404') || doesErrorIncludes(error, 'Pas de Token')) {
        setOpenCustomSnackbar(true);
        return;
      }
      HandleErrorService.showErrorSnackbar(error, errorHandler);
    }
  }, [error, errorHandler]);

  const confirmPasswordAndLogin = useCallback(
    async (password: string, passwordConfirmation: string, identifier: string, token: string) => {
      const response:
        | string
        | { access_token: string; refresh_token: string } = await doConfirmPassword({
        password,
        passwordConfirmation,
        identifier,
        token,
      });
      if (response instanceof Error) return;

      if (typeof response !== 'string' && response.access_token !== undefined) {
        dispatch(
          userLoggedIn({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
          }),
        );
        performAfterAuthAction();
      } else {
        if (causeToPublish !== undefined) {
          dispatch(setAfterAuthRedirect(PATHS.CAUSE_PREVIEW.url()));
        }
        window.location.href = oauthUrl;
      }
    },
    [causeToPublish, dispatch, doConfirmPassword, performAfterAuthAction],
  );

  return { openCustomSnackbar, loading, error, confirmPasswordAndLogin };
};
