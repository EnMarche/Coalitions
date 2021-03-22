import React, { FunctionComponent, useEffect } from 'react';
import {
  Container,
  CoalitionContainer,
  CoalitionImage,
  CoalitionName,
  SelectedCoalitionContainer,
  SelectedCoalitionIndex,
  NumberOfSelectedCauses,
  NormalWeight,
} from './CoalitionCards.style';
import { useFetchCoalitions } from 'redux/Coalition/hooks';
import { getCoalitions } from 'redux/Coalition/selectors';
import { useSelector } from 'react-redux';
import { Coalition } from 'redux/Coalition/types';
import { useIntl } from 'react-intl';

interface CoalitionCardsProps {
  onCoalitionClick: (coalition: Coalition) => void;
  selectedCoalitionUuids: string[];
}

const CoalitionCards: FunctionComponent<CoalitionCardsProps> = ({
  onCoalitionClick,
  selectedCoalitionUuids,
}) => {
  const coalitions = useSelector(getCoalitions);
  const { fetchCoalitions } = useFetchCoalitions();
  const intl = useIntl();

  useEffect(() => {
    if (coalitions.length === 0) {
      fetchCoalitions();
    }
  }, [fetchCoalitions, coalitions]);

  const renderCoalitionCard = (coalition: Coalition) => {
    const onClick = () => onCoalitionClick(coalition);
    return (
      <CoalitionContainer key={coalition.uuid} onClick={onClick}>
        <CoalitionImage backgroundImage={coalition.image_url}>
          {selectedCoalitionUuids.includes(coalition.uuid) ? (
            <SelectedCoalitionContainer>
              <SelectedCoalitionIndex>
                {selectedCoalitionUuids.indexOf(coalition.uuid) + 1}
              </SelectedCoalitionIndex>
            </SelectedCoalitionContainer>
          ) : null}
        </CoalitionImage>
        <CoalitionName>{coalition.name}</CoalitionName>
      </CoalitionContainer>
    );
  };

  if (coalitions.length === 0) {
    return null;
  }

  const numberOfSelectedCoalitions = selectedCoalitionUuids.length;
  return (
    <Container>
      <NumberOfSelectedCauses>
        {numberOfSelectedCoalitions <= 1
          ? intl.formatMessage(
              { id: 'create_cause.coalitions.zero-or-one-selected-coalition' },
              { numberOfSelectedCoalitions },
            )
          : intl.formatMessage(
              {
                id: `create_cause.coalitions.more-than-one-selected-coalitions`,
              },
              { numberOfSelectedCoalitions },
            )}
        <NormalWeight>{` ${intl.formatMessage({
          id: `create_cause.coalitions.max-number-of-selected-coalitions`,
        })}`}</NormalWeight>
      </NumberOfSelectedCauses>
      {coalitions.map(renderCoalitionCard)}
    </Container>
  );
};

export default CoalitionCards;
