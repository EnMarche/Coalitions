import React, { FunctionComponent, useEffect } from 'react';
import { EmptyMobileDiv, EventCardWrapper } from './EventCardsSlider.style';
import { useIntl } from 'react-intl';
import { getIsMobile } from 'services/mobile/mobile';
import Slider from 'components/Slider';
import { useFetchEvents, GroupSource } from 'redux/Events/hooks/useFetchEvents';
import {
  DESKTOP_MARGIN_BETWEEN_CARDS,
  DESKTOP_WIDTH,
  HEIGHT,
} from 'components/EventCard/EventCard.style';
import EventCard from 'components/EventCard';
import { useSelector } from 'react-redux';
import { getEvents } from 'redux/Events/selectors';

interface EventCardsSliderProps {
  TitleComponent?: FunctionComponent;
  filters?: {
    groupSource?: GroupSource;
    inFuture?: boolean;
    coalitionId?: string;
    causeId?: string;
  };
}

const EventCardsSlider: FunctionComponent<EventCardsSliderProps> = ({
  TitleComponent,
  filters,
}) => {
  const intl = useIntl();
  const isMobile = getIsMobile();
  const { fetchEvents, isFetchingEvents } = useFetchEvents(filters);
  const events = useSelector(getEvents);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <Slider
      slidesCount={events.length}
      isLoadingSlides={isFetchingEvents}
      TitleComponent={TitleComponent}
      title={intl.formatMessage({ id: 'events.title' })}
      desktopSlideWidth={DESKTOP_WIDTH}
      desktopCellSpacing={DESKTOP_MARGIN_BETWEEN_CARDS}
      slidesHeight={{ mobile: HEIGHT, desktop: HEIGHT }}
    >
      {events.map(event => (
        <EventCardWrapper key={event.uuid}>
          <EventCard event={event} />
        </EventCardWrapper>
      ))}
      {isMobile ? <EmptyMobileDiv /> : null}
    </Slider>
  );
};

export default EventCardsSlider;
