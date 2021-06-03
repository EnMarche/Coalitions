import React, { FunctionComponent, MouseEvent } from 'react';
import {
  Container,
  Name,
  BottomButtonsContainer,
  SeeButton,
  CategoryName,
  ParticipantsCountContainer,
  ParticipantsCountIconWrapper,
  ParticipantsCountIcon,
  ParticipantsCountLabel,
  InformationContainer,
  Bold,
  CauseNameContainer,
  CauseNameLabel,
  CauseNameIcon,
} from './EventCard.style';
import { EventType } from 'redux/Events/types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import EventParticipateButton from '../EventParticipateButton';
import { formatEventDate } from 'redux/Events/helpers/formatEventDate';
import { formatEventAddress } from 'redux/Events/helpers/formatEventAddress';
import { PATHS } from 'routes';

interface EventCardProps {
  event: EventType;
}

const EventCard: FunctionComponent<EventCardProps> = ({ event }) => {
  const intl = useIntl();
  const history = useHistory();

  const showEventDetails = () => {
    history.push({ search: `?eventId=${event.uuid}` });
  };

  const goToCausePage = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (event === undefined || event.cause === undefined) {
      return;
    }

    history.push(PATHS.CAUSE.url(event.cause.slug));
  };

  const numberOfParticipants = event.numberOfParticipants;

  let categoryName = event.category.name.toUpperCase();
  if (event.coalition !== undefined) {
    categoryName = `${categoryName} • ${event.coalition.name}`;
  }

  const formattedDate = formatEventDate({
    timeZone: event.timeZone,
    date: event.beginAt,
    type: 'card',
  });

  return (
    <Container onClick={showEventDetails}>
      <div>
        <CategoryName>{categoryName}</CategoryName>
        <Name>{event.name}</Name>
        <InformationContainer>
          <Bold>{formattedDate}</Bold>
          {` • ${
            event.mode === 'online' && event.visioUrl !== undefined && event.visioUrl.length > 0
              ? intl.formatMessage({ id: 'events.mode.online' })
              : formatEventAddress(event)
          }`}
        </InformationContainer>
        {event.cause !== undefined ? (
          <CauseNameContainer onClick={goToCausePage}>
            <CauseNameIcon src="/images/point.svg" />
            <CauseNameLabel>{event.cause.name}</CauseNameLabel>
          </CauseNameContainer>
        ) : null}
        <ParticipantsCountContainer>
          <ParticipantsCountIconWrapper>
            <ParticipantsCountIcon src="/images/supports.svg" />
          </ParticipantsCountIconWrapper>
          <ParticipantsCountLabel>
            {numberOfParticipants > 1
              ? intl.formatMessage({ id: 'events.participants' }, { numberOfParticipants })
              : intl.formatMessage({ id: 'events.participant' }, { numberOfParticipants })}
          </ParticipantsCountLabel>
        </ParticipantsCountContainer>
      </div>
      <BottomButtonsContainer>
        <EventParticipateButton event={event} type="card" />
        <SeeButton size="small" variant="outlined" onClick={showEventDetails}>
          {intl.formatMessage({ id: 'events.see' })}
        </SeeButton>
      </BottomButtonsContainer>
    </Container>
  );
};

export default EventCard;
