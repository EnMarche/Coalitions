import React, { FunctionComponent } from 'react';
import {
  Container,
  MobileGreyP,
  Name,
  BottomButtonsContainer,
  HeaderContainer,
  SeeButton,
  CategoryName,
  ParticipantsCountContainer,
  ParticipantsCountWrapper,
  ParticipantsCountIcon,
  ParticipantsCountLabel,
} from './EventCard.style';
import { EventType } from 'redux/Events/types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import EventParticipateButton from '../EventParticipateButton';

interface EventCardProps {
  event: EventType;
}

const EventCard: FunctionComponent<EventCardProps> = ({ event }) => {
  const intl = useIntl();
  const history = useHistory();

  const showEventDetails = () => {
    history.push({ search: `?eventId=${event.uuid}` });
  };

  const numberOfParticipants = event.participants_count;

  return (
    <Container onClick={showEventDetails}>
      <div>
        <HeaderContainer>
          <CategoryName>
            {`${event.category.name.toUpperCase()} • ${intl.formatMessage({
              id: `events.mode.${event.mode}`,
            })}`}
          </CategoryName>
        </HeaderContainer>
        <Name>{event.name}</Name>
      </div>
      <div>
        <MobileGreyP>
          {intl.formatMessage(
            { id: 'events.organizer' },
            { organizer: `${event.organizer.first_name} ${event.organizer.last_name}` },
          )}
        </MobileGreyP>
        <ParticipantsCountContainer>
          <ParticipantsCountWrapper>
            <ParticipantsCountIcon src="/images/supports.svg" />
          </ParticipantsCountWrapper>
          <ParticipantsCountLabel>
            {numberOfParticipants > 1
              ? intl.formatMessage({ id: 'events.participants' }, { numberOfParticipants })
              : intl.formatMessage({ id: 'events.participant' }, { numberOfParticipants })}
          </ParticipantsCountLabel>
        </ParticipantsCountContainer>
        <BottomButtonsContainer>
          <EventParticipateButton event={event} type="card" />
          <SeeButton size="small" variant="outlined" onClick={showEventDetails}>
            {intl.formatMessage({ id: 'events.see' })}
          </SeeButton>
        </BottomButtonsContainer>
      </div>
    </Container>
  );
};

export default EventCard;
