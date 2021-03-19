import React, { useState, ChangeEvent, FunctionComponent } from 'react';
import {
  Container,
  HeaderContainer,
  CauseName,
  CoalitionName,
  CauseImage,
  HeaderSubContainer,
  TabsWrapper,
  StyledTab,
  AuthorAndSupportsWrapper,
  MobileSupportButtonWrapper,
  DesktopSupportButton,
  Supported,
} from './CauseDetails.style';
import { FormattedMessage, useIntl } from 'react-intl';
import { colorPalette } from 'stylesheet';
import { Tabs } from '@material-ui/core';
import AboutThisCause from './components/AboutThisCause';
import AuthorAndSupports from 'components/AuthorAndSupports';
import FixedBottomButton from 'components/FixedBottomButton';
import { CreateCauseCTA } from 'pages/CauseList/CreateCauseCTA/CreateCauseCTA';
import { InCreationCause, Cause } from 'redux/Cause/types';

interface CauseDetailsProps {
  cause: Cause | InCreationCause;
  onSupport?: () => void;
  isSupporting?: boolean;
}

const TAB_INDICATOR_PROPS = {
  style: {
    backgroundColor: colorPalette.mintGreen2,
  },
};

const CauseDetails: FunctionComponent<CauseDetailsProps> = ({ cause, onSupport, isSupporting }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const isPreview = Boolean(!onSupport);
  const isSupported = Boolean(cause.supported);
  const intl = useIntl();

  const onTabIndexChange = (_: ChangeEvent<{}>, value: number) => {
    setTabIndex(value);
  };

  const renderTabPanel = () => {
    switch (tabIndex) {
      case 0:
        return <AboutThisCause cause={cause} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Container>
        <HeaderContainer>
          <CauseImage backgroundImage={cause.image_url} />
          {Boolean(cause.supported) ? (
            <Supported>
              <FormattedMessage id="cause.supported" />
            </Supported>
          ) : null}
          <HeaderSubContainer>
            <div>
              <CoalitionName>{cause.coalition.name}</CoalitionName>
              <CauseName>{cause.name}</CauseName>
              <AuthorAndSupportsWrapper>
                <AuthorAndSupports cause={cause} showAuthor />
              </AuthorAndSupportsWrapper>
            </div>
            {!isPreview && !isSupported ? (
              <DesktopSupportButton
                size="small"
                variant="contained"
                color="primary"
                onClick={onSupport}
                isLoading={isSupporting}
              >
                {intl.formatMessage({ id: 'cause.support-button' })}
              </DesktopSupportButton>
            ) : null}
          </HeaderSubContainer>
        </HeaderContainer>
        <TabsWrapper>
          <Tabs
            value={tabIndex}
            onChange={onTabIndexChange}
            TabIndicatorProps={TAB_INDICATOR_PROPS}
          >
            <StyledTab label={<FormattedMessage id="cause.about.title" />} />
            <StyledTab label={<FormattedMessage id="cause.events.title" />} />
            <StyledTab label={<FormattedMessage id="cause.discussions.title" />} />
          </Tabs>
          {renderTabPanel()}
        </TabsWrapper>
        {!isPreview ? <CreateCauseCTA displayLinkToCauseList /> : null}
      </Container>
      {!isPreview && !isSupported ? (
        <MobileSupportButtonWrapper>
          <FixedBottomButton onClick={onSupport} isLoading={isSupporting}>
            {intl.formatMessage({ id: 'cause.support-button' })}
          </FixedBottomButton>
        </MobileSupportButtonWrapper>
      ) : null}
    </>
  );
};

export default CauseDetails;
