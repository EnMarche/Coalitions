/* eslint-disable max-lines */

import { authenticatedApiClient, coalitionApiClient } from 'services/networking/client';
import { useDispatch } from 'react-redux';
import {
  markCausesAsSupported,
  resetCauses,
  updateCauses,
  updateMyCauses,
  updateOneCause,
} from '../slice';
import { useTypedAsyncFn } from 'redux/useTypedAsyncFn';
import { useCallback, useState, useEffect } from 'react';
import { Cause } from '../types';
import { useFetchFollowedCauses } from './useFetchFollowedCauses';
import HandleErrorService, { APIErrorsType } from 'services/HandleErrorService';
import { useSelector } from 'react-redux';
import { isUserLogged } from 'redux/Login';
import request from 'superagent';
import { useIntl } from 'react-intl';

type RawQuickActions = {
  id: string;
  title: string;
  url: string;
};

export enum SortOptions {
  moreSupported = '[followersCount]=desc',
  lessSupported = '[followersCount]=asc',
  lastCreated = '[createdAt]=desc',
  firstCreated = '[createdAt]=asc',
}

export type Filters = {
  coalitionIds: string[];
  searchText: string;
  sort: SortOptions;
  onlyMine?: boolean;
};

export const PAGE_SIZE = 12;

const buildFilteredByUrl = (filters: Filters) => {
  let urlWithFilters = '';
  if (filters.coalitionIds.length > 0) {
    urlWithFilters = filters.coalitionIds.reduce((url, coalitionId) => {
      return url + `&coalition.uuid[]=${coalitionId}`;
    }, urlWithFilters);
  }

  if (filters.searchText.length > 0) {
    urlWithFilters = `${urlWithFilters}&name=${filters.searchText}`;
  }

  urlWithFilters = `${urlWithFilters}&order${filters.sort}`;

  return urlWithFilters;
};

const useFetchCausesErrorHandler = () => {
  const { formatMessage } = useIntl();

  return useCallback(
    (useFilters: boolean, error?: APIErrorsType) => {
      if (error instanceof Response || error === undefined || error.message === undefined) {
        return null;
      }
      if (useFilters) {
        return formatMessage({ id: 'errors.filtered-causes-error' });
      }
      return null;
    },
    [formatMessage],
  );
};

export const useFetchCauses = (pageSize = PAGE_SIZE, onlyMine = false) => {
  // If onlyMine is true, we call another endPoint to have only supported causes for the authenticated user
  let pendingRequest: request.SuperAgentRequest | undefined;
  let useFilters = false;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const isUserLoggedIn = Boolean(useSelector(isUserLogged));
  const errorHandler = useFetchCausesErrorHandler();

  const [{ loading: loadingFetch, error }, doFetchCauses] = useTypedAsyncFn(
    async ({ page, filters }: { page: number; filters: string }) => {
      if (pendingRequest !== undefined) {
        pendingRequest.abort();
      }
      useFilters = filters.length > 0;

      const _func = (endPoint: string) =>
        onlyMine
          ? authenticatedApiClient.getRequestWithoutTokenCheck(endPoint)
          : coalitionApiClient.getRequestWithoutTokenCheck(endPoint);

      const endpoint = `${
        onlyMine ? 'v3/' : ''
      }causes?page_size=${pageSize}&page=${page}${filters}${onlyMine ? '&onlyMine' : ''}`;

      pendingRequest = _func(endpoint);
      const response = await pendingRequest;
      pendingRequest = undefined;
      return response.body;
    },
    [],
  );

  useEffect(() => {
    if (error !== undefined) {
      HandleErrorService.showErrorSnackbar(error, e => errorHandler(useFilters, e));
    }
  }, [error, errorHandler, useFilters]);

  const { loading: loadingFollowed, doFetchFollowedCauses } = useFetchFollowedCauses();

  const fetch = useCallback(
    async (page: number, filters: Filters) => {
      const causes = await doFetchCauses({
        page,
        filters: buildFilteredByUrl(filters),
      });

      if (causes instanceof Error) {
        return;
      }

      const supportedCauses = await doFetchFollowedCauses({
        uuids: causes.items.map((cause: Cause) => cause.uuid),
        isUserLoggedIn,
      });
      if (!onlyMine) {
        dispatch(
          updateCauses({ causes: causes.items, numberOfCauses: causes.metadata.total_items }),
        );
        dispatch(markCausesAsSupported(supportedCauses));
      } else dispatch(updateMyCauses({ causes: causes.items }));
      setHasMore(causes.metadata.last_page >= page + 1);
      setPage(page + 1);
    },
    [dispatch, doFetchCauses, doFetchFollowedCauses, isUserLoggedIn, onlyMine],
  );

  const fetchFirstPage = useCallback(
    async (filters: Filters) => {
      if (!onlyMine) dispatch(resetCauses());
      await fetch(1, filters);
    },
    [dispatch, fetch, onlyMine],
  );

  const fetchNextPage = useCallback(
    async (filters: Filters) => {
      if (!hasMore) return;

      await fetch(page, filters);
    },
    [hasMore, fetch, page],
  );

  return {
    hasMore,
    loading: loadingFetch || loadingFollowed,
    fetchFirstPage,
    fetchNextPage,
  };
};

export const useFetchOneCause = (idOrSlug: string | null) => {
  const dispatch = useDispatch();
  const isUserLoggedIn = Boolean(useSelector(isUserLogged));
  const [isFetchingQuickActions, setIsFetchingQuickActions] = useState(false);

  const [{ loading, error }, doFetchCause] = useTypedAsyncFn(async () => {
    if (idOrSlug === null) {
      return;
    }
    return await coalitionApiClient.get(`causes/${idOrSlug}`);
  }, []);

  useEffect(() => {
    if (error !== undefined) {
      HandleErrorService.showErrorSnackbar(error);
    }
  }, [error]);

  const { loading: loadingFollowed, doFetchFollowedCauses } = useFetchFollowedCauses();

  const fetchCause = useCallback(
    async (withQuickActions = false) => {
      let cause: Cause | undefined = await doFetchCause();

      if (cause === undefined || cause instanceof Error) {
        return;
      }

      const supportedCauses = await doFetchFollowedCauses({
        uuids: [cause.uuid],
        isUserLoggedIn,
      });

      if (withQuickActions) {
        const doFetchQuickActions = async (causeId: string) => {
          setIsFetchingQuickActions(true);
          try {
            const rawQuickActions: RawQuickActions[] = await coalitionApiClient.get(
              `causes/${causeId}/quick_actions`,
            );

            return rawQuickActions.map(({ id, title, url }) => ({
              id,
              label: title,
              link: url,
            }));
          } catch (e) {
            HandleErrorService.showErrorSnackbar(e);
          } finally {
            setIsFetchingQuickActions(false);
          }
        };

        const quickActions = await doFetchQuickActions(cause.uuid);

        cause = {
          ...cause,
          quickActions,
        };
      }

      await dispatch(updateOneCause(cause));
      await dispatch(markCausesAsSupported(supportedCauses));
    },
    [dispatch, doFetchCause, doFetchFollowedCauses, isUserLoggedIn],
  );

  return { loading: loading || loadingFollowed || isFetchingQuickActions, fetchCause };
};

/* eslint-enable max-lines */
