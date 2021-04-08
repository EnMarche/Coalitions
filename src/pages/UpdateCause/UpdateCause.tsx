import React, { FunctionComponent, useEffect } from 'react';
import { LoaderContainer } from './UpdateCause.style';
import useSelector from 'redux/useSelector';
import { isUserLogged } from 'redux/Login';
import { useLocation } from 'react-router';
import Loader from 'components/Loader';
import CauseForm from 'components/CauseForm';
import { useFetchOneCause } from 'redux/Cause/hooks/useFetchCauses';
import { getCause } from 'redux/Cause/selectors';

const CreateCause: FunctionComponent = () => {
  const isUserLoggedIn = Boolean(useSelector(isUserLogged));
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const toUpdateCauseId = params.get('causeId');
  const toUpdateCause = useSelector(getCause(toUpdateCauseId));
  const { loading, fetchCause } = useFetchOneCause(toUpdateCauseId);

  useEffect(() => {
    if (toUpdateCauseId !== null) {
      fetchCause(isUserLoggedIn);
    }
  }, [fetchCause, isUserLoggedIn, toUpdateCauseId]);

  const onSubmit = () => {
    // TODO
  };

  if (loading && toUpdateCause === undefined) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  return <CauseForm onSubmit={onSubmit} initialCause={toUpdateCause} />;
};

export default CreateCause;
