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
import { adaptEvent } from '../helpers/adapter';
import { RawEventType, RawUpdateEventType } from '../types';

const useUpdateEventErrorHandler = () => {
  const { formatMessage } = useIntl();

  return useCallback(
    (error?: APIErrorsType) => {
      if (error instanceof Response || error === undefined || error.message === undefined) {
        return null;
      }
      if (doesErrorIncludes(error, 'Access Denied')) {
        return formatMessage({ id: 'errors.cannot-edit-this-event' });
      }
      return null;
    },
    [formatMessage],
  );
};

export const useUpdateEvent = () => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const errorHandler = useUpdateEventErrorHandler();

  const [{ loading, error }, doUpdateEvent] = useTypedAsyncFn(async (event: RawUpdateEventType) => {
    return await authenticatedApiClient.put(`v3/events/${event.uuid}`, event);
  }, []);

  useEffect(() => {
    if (error !== undefined) {
      HandleErrorService.showErrorSnackbar(error, errorHandler);
    }
  }, [error, errorHandler]);

  const updateEvent = useCallback(
    async (event: RawUpdateEventType) => {
      const response: RawEventType = await doUpdateEvent(event);

      if (response instanceof Error) return;

      if (response.uuid !== undefined) {
        const event = adaptEvent(response);

        if (event.cause !== undefined) {
          push({ pathname: PATHS.CAUSE.url(event.cause.slug), search: `?eventId=${event.uuid}` });
        } else if (event.coalition !== undefined) {
          push({
            pathname: PATHS.COALITION.url(event.coalition.uuid),
            search: `?eventId=${event.uuid}`,
          });
        }

        dispatch(
          updateSnackbar({
            message: formatMessage({ id: 'event_form.update.success' }),
            severity: Severity.success,
          }),
        );
      }
    },
    [dispatch, doUpdateEvent, formatMessage, push],
  );

  return { loading, error, updateEvent };
};
