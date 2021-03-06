import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { updateSnackbar } from 'redux/Snackbar';
import { Severity } from 'redux/Snackbar/types';
import { useTypedAsyncFn } from 'redux/useTypedAsyncFn';
import { PATHS } from 'routes';
import HandleErrorService, { APIErrorsType, doesErrorIncludes } from 'services/HandleErrorService';
import { authenticatedApiClient } from 'services/networking/client';
import { Cause } from '../types';

const useUpdateCauseErrorHandler = () => {
  const { formatMessage } = useIntl();

  return useCallback(
    (error?: APIErrorsType) => {
      if (error instanceof Response || error === undefined || error.message === undefined) {
        return null;
      }
      if (doesErrorIncludes(error, 'Access Denied')) {
        return formatMessage({ id: 'errors.cannot-edit-this-cause' });
      }
      return null;
    },
    [formatMessage],
  );
};

export const useUpdateCause = (slug: string) => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const errorHandler = useUpdateCauseErrorHandler();

  const [{ loading, error }, doUpdateCause] = useTypedAsyncFn(
    async ({ shouldUpdateImage, ...cause }: Cause & { shouldUpdateImage: boolean }) => {
      await authenticatedApiClient.put(`v3/causes/${cause.uuid}`, {
        description: cause.description,
      });

      if (!shouldUpdateImage) {
        return;
      }

      return await authenticatedApiClient.post(`v3/causes/${cause.uuid}/image`, {
        content: cause?.image_url,
      });
    },
    [],
  );

  useEffect(() => {
    if (error !== undefined) {
      HandleErrorService.showErrorSnackbar(error, errorHandler);
    }
  }, [error, errorHandler]);

  const updateCause = useCallback(
    async ({ cause, shouldUpdateImage }: { cause: Cause; shouldUpdateImage: boolean }) => {
      const response = await doUpdateCause({ ...cause, shouldUpdateImage });

      if (response instanceof Error) return;

      push(PATHS.CAUSE.url(slug));
      dispatch(
        updateSnackbar({
          message: formatMessage({ id: 'update_cause.success' }),
          severity: Severity.success,
        }),
      );
    },
    [dispatch, doUpdateCause, formatMessage, push, slug],
  );

  return { loading, error, updateCause };
};
