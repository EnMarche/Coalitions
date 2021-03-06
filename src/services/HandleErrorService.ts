import throttle from 'lodash/throttle';
import * as Sentry from '@sentry/browser';
import { store } from 'redux/store';
import { updateSnackbar } from 'redux/Snackbar';
import { Severity } from 'redux/Snackbar/types';

export type APIErrorsType = Response | Error;
type DefaultHandlerType = (error?: APIErrorsType) => string | null;

const ERROR_MESSAGES = {
  default: "Une erreur s'est produite. Merci de réessayer plus tard.",
  noNetwork: 'Votre connexion réseau est insuffisante.',
  unableToJoinServer: 'Le serveur ne répond pas. Merci de réessayer plus tard.',
  error500: "Une erreur serveur s'est produite. Merci de réessayer plus tard.",
};

export default class HandleErrorService {
  static isNoNetworkError(error: Error): boolean {
    return error.message.includes('the network is offline');
  }

  static isNoBackConnectionError(error: Response): boolean {
    return !error.status;
  }

  static sendDefault(error?: APIErrorsType, defaultHandler?: DefaultHandlerType) {
    const defaultMessage = ERROR_MESSAGES.default;
    if (!defaultHandler) {
      return defaultMessage;
    }
    const errorMessage = defaultHandler(error);
    if (errorMessage !== null) {
      return errorMessage;
    }
    Sentry.captureException(error);
    return defaultMessage;
  }

  static getErrorMessage(error?: APIErrorsType, defaultHandler?: DefaultHandlerType) {
    if (!error) {
      return HandleErrorService.sendDefault(error, defaultHandler);
    }

    if (error instanceof Error && HandleErrorService.isNoNetworkError(error)) {
      return ERROR_MESSAGES.noNetwork;
    } else if (error instanceof Response && HandleErrorService.isNoBackConnectionError(error)) {
      return ERROR_MESSAGES.unableToJoinServer;
    } else if (error instanceof Response && error.status >= 500) {
      Sentry.captureException(error);
      return ERROR_MESSAGES.error500;
    }

    return HandleErrorService.sendDefault(error, defaultHandler);
  }

  static showErrorSnackbarThrottled(error?: APIErrorsType, defaultHandler?: DefaultHandlerType) {
    store.dispatch(
      updateSnackbar({
        message: HandleErrorService.getErrorMessage(error, defaultHandler),
        severity: Severity.error,
      }),
    );
  }

  static showErrorSnackbar = throttle(HandleErrorService.showErrorSnackbarThrottled, 2000);
}

export const doesErrorIncludes = (error: Error, message: string) => {
  return Boolean(
    error.message.includes(message) ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      Boolean(error.response?.body?.detail?.includes(message)),
  );
};
