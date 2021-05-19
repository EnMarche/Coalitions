import React, { FunctionComponent, MouseEvent } from 'react';
import {
  Container,
  MobileGreyP,
  Name,
  BottomButtonsContainer,
  HeaderContainer,
  Tag,
  InscriptionButtonWrapper,
} from './EventCard.style';
import { EventType } from 'redux/Events/types';
import { useIntl } from 'react-intl';
import { DefaultButton } from 'components/Button/Button';
import { isUpcomingEvent } from 'redux/Events/helpers/isUpcomingEvent';

interface EventCardProps {
  event: EventType;
}

const EventCard: FunctionComponent<EventCardProps> = ({ event }) => {
  const intl = useIntl();

  const showEventDetails = () => {
    // TODO
  };

  const onSubscribeClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // TODO
  };

  const numberOfSubscribers = event.participants_count;
  const tag = isUpcomingEvent(event)
    ? intl.formatMessage({ id: 'events.upcoming' })
    : intl.formatMessage({ id: 'events.passed' });
  const alreadySubscribed = event.uuid === 'c44a1a3b-a24e-5c78-9dac-4137699c0d00';

  return (
    <Container onClick={showEventDetails}>
      <div>
        <HeaderContainer>
          <MobileGreyP>
            {`${event.category.name.toUpperCase()} • ${intl.formatMessage({
              id: `events.mode.${event.mode}`,
            })}`}
          </MobileGreyP>
          <Tag>{tag}</Tag>
        </HeaderContainer>
        <Name>{event.name}</Name>
      </div>
      <div>
        {event.organizer !== undefined ? (
          <MobileGreyP>
            {intl.formatMessage(
              { id: 'events.organizer' },
              { organizer: `${event.organizer.first_name} ${event.organizer.last_name}` },
            )}
          </MobileGreyP>
        ) : null}
        {numberOfSubscribers !== undefined ? (
          <MobileGreyP>
            {numberOfSubscribers > 1
              ? intl.formatMessage({ id: 'events.subscribers' }, { numberOfSubscribers })
              : intl.formatMessage({ id: 'events.subscriber' }, { numberOfSubscribers })}
          </MobileGreyP>
        ) : null}
        <BottomButtonsContainer>
          <InscriptionButtonWrapper alreadySubscribed={alreadySubscribed}>
            <DefaultButton size="small" variant="contained" onClick={onSubscribeClick}>
              {alreadySubscribed
                ? intl.formatMessage({ id: 'events.subscribed' })
                : intl.formatMessage({ id: 'events.subscribe' })}
            </DefaultButton>
          </InscriptionButtonWrapper>
          <DefaultButton size="small" variant="outlined">
            {intl.formatMessage({ id: 'events.see' })}
          </DefaultButton>
        </BottomButtonsContainer>
      </div>
    </Container>
  );
};

export default EventCard;
