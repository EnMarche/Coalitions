import React, { FunctionComponent, useState, MouseEvent, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { EventType } from 'redux/Events/types';
import { Container, Icon, Label } from './EventParticipateButton.style';
import {
  getEventParticipateButtonConfig,
  EventParticipateButtonType,
} from './lib/getEventParticipateButtonConfig';
import { FullWidthButton, SmallButton } from 'components/Button/Button';
import { isUpcomingEvent } from 'redux/Events/helpers/isUpcomingEvent';
import {
  useEventParticipate,
  useRemoveEventParticipation,
} from 'redux/Events/hooks/useEventParticipate';
import { useDispatch } from 'react-redux';
import useSelector from 'redux/useSelector';
import { isUserLogged } from 'redux/Login';
import { openEventParticipateModal } from 'redux/Events';

interface EventParticipateButtonProps {
  type: EventParticipateButtonType;
  event: EventType;
}

const EventParticipateButton: FunctionComponent<EventParticipateButtonProps> = ({
  type,
  event,
}) => {
  const [isHover, setIsHover] = useState(false);
  const intl = useIntl();
  const dispatch = useDispatch();
  const isUserLoggedIn = Boolean(useSelector(isUserLogged));
  const isUpcoming = isUpcomingEvent(event);
  const {
    loading: isRemovingParticipation,
    removeEventParticipation,
  } = useRemoveEventParticipation(event.uuid);
  const { loading: isParticipateToEventLoading, participateToEvent } = useEventParticipate(
    event.uuid,
  );

  const getSetIsHover = (hover: boolean) => () => {
    setIsHover(hover);
  };

  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isUpcoming) {
        return;
      }

      if (isUserLoggedIn) {
        if (event.participate === true) {
          removeEventParticipation();
        } else {
          participateToEvent();
        }
      } else {
        dispatch(openEventParticipateModal(event));
      }
    },
    [isUserLoggedIn, dispatch, event, isUpcoming, participateToEvent, removeEventParticipation],
  );

  const SubContainer = type === 'card' ? SmallButton : FullWidthButton;
  const { labelKey, customStyle, iconSrc } = getEventParticipateButtonConfig({
    event,
    type,
    isHover,
  });

  return (
    <Container
      width={type === 'modal' ? '100%' : 'unset'}
      customStyle={customStyle}
      onMouseEnter={getSetIsHover(true)}
      onMouseLeave={getSetIsHover(false)}
    >
      <SubContainer
        onClick={onClick}
        isLoading={isRemovingParticipation || isParticipateToEventLoading}
        disabled={isRemovingParticipation || isParticipateToEventLoading || !isUpcoming}
      >
        {iconSrc !== undefined ? <Icon src={iconSrc} /> : null}
        {labelKey !== undefined ? (
          <Label withMarginLeft={iconSrc !== undefined}>
            {intl.formatMessage({ id: labelKey })}
          </Label>
        ) : null}
      </SubContainer>
    </Container>
  );
};

export default EventParticipateButton;