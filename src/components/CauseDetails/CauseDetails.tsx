import React, { FunctionComponent, createElement } from 'react';
import {
  Container,
  SubContainer,
  HeaderContainer,
  CauseImage,
  DesktopHeaderWrapper,
  MobileHeaderWrapper,
  DesktopQuickActionsWrapper,
  AboutThisCauseWrapper,
  FirstQuickActionWrapper,
  EventCardsSliderWrapper,
} from './CauseDetails.style';
import { InCreationCause, Cause } from 'redux/Cause/types';
import CreateCauseCTA from 'components/CreateCauseCTA';
import AboutThisCause from './components/AboutThisCause';
import Header from './components/Header';
import HeaderButtons from './components/HeaderButtons';
import { useCauseOwner } from 'redux/Cause/hooks/useCauseOwner';
import QuickActions from './components/QuickActions';
import { QuickAction } from './components/QuickActions/QuickActions';
import FollowTag from 'components/FollowTag/FollowTag';
import { getCauseQuickActions } from 'redux/Cause/selectors';
import { useSelector } from 'react-redux';
import EventCardsSlider from 'components/EventCardsSlider';
import { useFeatureToggling } from 'services/useFeatureToggling';

interface CauseDetailsProps {
  cause: Cause | InCreationCause;
  onSupport?: () => void;
  isSupporting?: boolean;
}

// eslint-disable-next-line complexity
const CauseDetails: FunctionComponent<CauseDetailsProps> = ({ cause, onSupport, isSupporting }) => {
  const isPreview = Boolean(!onSupport);
  const isSupported = Boolean(cause.supported);
  const isCauseOwner = useCauseOwner(cause);
  const quickActions = useSelector(getCauseQuickActions((cause as Cause).uuid));
  const { areEventsEnable } = useFeatureToggling();

  const renderHeader = () => (
    <Header cause={cause} onSupport={onSupport} isSupporting={isSupporting} />
  );

  const showQuickActions = !isPreview && (isCauseOwner || isSupported);
  return (
    <>
      <DesktopHeaderWrapper>{renderHeader()}</DesktopHeaderWrapper>
      <Container>
        <SubContainer center={!showQuickActions}>
          <HeaderContainer>
            <CauseImage backgroundImage={cause.image_url} />
            {isSupported ? <FollowTag labelKey="cause.supported" /> : null}
            <MobileHeaderWrapper>{renderHeader()}</MobileHeaderWrapper>
          </HeaderContainer>
          {showQuickActions && quickActions !== undefined && quickActions.length > 0 ? (
            <FirstQuickActionWrapper>
              <QuickAction quickAction={quickActions[0]} />
            </FirstQuickActionWrapper>
          ) : null}
          <AboutThisCauseWrapper>
            <AboutThisCause cause={cause} />
          </AboutThisCauseWrapper>
        </SubContainer>
        {showQuickActions && quickActions !== undefined ? (
          <DesktopQuickActionsWrapper>
            <QuickActions quickActions={quickActions} />
          </DesktopQuickActionsWrapper>
        ) : null}
      </Container>
      {!isPreview ? (
        <>
          {areEventsEnable ? (
            <EventCardsSliderWrapper>
              <EventCardsSlider
                filters={{ causeId: (cause as Cause).uuid }}
                TitleComponent={({ children }) => createElement('h2', null, children)}
              />
            </EventCardsSliderWrapper>
          ) : null}
          <CreateCauseCTA displayLinkToCauseList />
        </>
      ) : null}
      <HeaderButtons
        cause={cause}
        onSupport={onSupport}
        isSupporting={isSupporting}
        isMobile
        quickActions={quickActions}
        showQuickActions={showQuickActions}
      />
    </>
  );
};

export default CauseDetails;
