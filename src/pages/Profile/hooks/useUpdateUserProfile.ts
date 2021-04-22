import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { updateSnackbar } from 'redux/Snackbar';
import { Severity } from 'redux/Snackbar/types';
import { optimisticallyUpdateCurrentUser } from 'redux/User';
import { useTypedAsyncFn } from 'redux/useTypedAsyncFn';
import HandleErrorService, { APIErrorsType } from 'services/HandleErrorService';
import { authenticatedApiClient } from 'services/networking/client';
import { GENDERS, ProfileFormValues } from './useValidateForm';

const useUpdateUserProfileErrorHandler = () => {
  const { formatMessage } = useIntl();

  return useCallback(
    (error?: APIErrorsType) => {
      if (error instanceof Response || error === undefined || error.message === undefined) {
        return null;
      }
      if (error.message.includes('email_address: Cette adresse e-mail existe')) {
        return formatMessage({ id: 'errors.mail-of-existing-account' });
      }
      return null;
    },
    [formatMessage],
  );
};

type UpdateUserProfilePayload = {
  first_name?: string;
  last_name?: string;
  phone?: { number?: string; country?: string };
  gender?: string;
  birthdate?: string;
};

export const useUpdateUserProfile = (userId?: string) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const errorHandler = useUpdateUserProfileErrorHandler();

  const [{ loading, error }, doUpdateUserProfile] = useTypedAsyncFn(
    async (payload: UpdateUserProfilePayload) => {
      await authenticatedApiClient.put(`v3/profile/${userId}`, { ...payload });
    },
    [],
  );

  useEffect(() => {
    if (error !== undefined) {
      HandleErrorService.showErrorSnackbar(error, errorHandler);
    }
  }, [error, errorHandler]);

  const updateUserProfile = useCallback(
    async (values: ProfileFormValues) => {
      const response = await doUpdateUserProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender === GENDERS[0].value ? undefined : values.gender,
        birthdate: values.birthday,
        phone:
          values.phoneNumber !== null
            ? {
                number: values.phoneNumber,
                country: values.phoneCountry?.region,
              }
            : undefined,
      });

      if (response instanceof Error) return;

      dispatch(optimisticallyUpdateCurrentUser(values));
      dispatch(
        updateSnackbar({
          message: formatMessage({ id: 'profile.update_success' }),
          severity: Severity.success,
        }),
      );
    },
    [dispatch, doUpdateUserProfile, formatMessage],
  );

  return { loading, error, updateUserProfile };
};
