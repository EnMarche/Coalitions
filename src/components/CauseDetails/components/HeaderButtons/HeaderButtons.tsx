import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  DesktopContainer,
  GrowButton,
  GrowButtonContent,
  Chevron,
} from './HeaderButtons.style';
import { useIntl } from 'react-intl';
import { InCreationCause, Cause } from 'redux/Cause/types';
import { PATHS } from 'routes';
import { Container as StickyMobileButtonsContainer } from 'components/FixedBottomButton/FixedBottomButton.style';
import { usePublishCause } from 'redux/Cause/hooks/usePublishCause';
import { useCauseOwner } from 'redux/Cause/hooks/useCauseOwner';
import { useFeatureToggling } from 'services/useFeatureToggling';
import { useHistory } from 'react-router';
import { Modal } from 'components/Modal/Modal';

interface HeaderProps {
  cause: Cause | InCreationCause;
  onSupport?: () => void;
  onShare?: () => void;
  isSupporting?: boolean;
  isMobile?: boolean;
}

const HeaderButtons: FunctionComponent<HeaderProps> = ({
  cause,
  onSupport,
  onShare,
  isSupporting,
  isMobile,
}) => {
  const history = useHistory();
  const isPreview = Boolean(!onSupport);
  const isSupported = Boolean(cause.supported);
  const intl = useIntl();
  const { loading, publishCause } = usePublishCause();
  const isCauseOwner = useCauseOwner(cause);
  const { isCauseUpdateEnable } = useFeatureToggling();
  const [isGrowModalOpened, setIsGrowModalOpened] = useState(false);

  const updateCause = () => {
    history.push({
      pathname: PATHS.UPDATE_CAUSE.url(),
      search: `?causeId=${(cause as Cause).uuid}`,
    });
  };

  const updatePreview = () => {
    history.push(PATHS.CREATE_CAUSE.url());
  };

  const toggleGrowTheCauseModal = () => {
    setIsGrowModalOpened(!isGrowModalOpened);
  };

  const renderContent = () => {
    if (isPreview) {
      return (
        <>
          <Button size="small" variant="outlined" color="primary" onClick={updatePreview}>
            {intl.formatMessage({ id: 'cause_preview.update' })}
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={publishCause}
            isLoading={loading}
          >
            {intl.formatMessage({ id: 'cause_preview.publish' })}
          </Button>
        </>
      );
    }

    if (!isSupported) {
      return (
        <>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={onSupport}
            isLoading={isSupporting}
          >
            {intl.formatMessage({ id: 'cause.support-button' })}
          </Button>
          {isMobile || (
            <Button size="small" variant="outlined" color="primary" onClick={onShare}>
              {intl.formatMessage({ id: 'cause.share-button' })}
            </Button>
          )}
        </>
      );
    }

    if (isMobile) {
      return (
        <>
          <GrowButton size="small" color="primary" onClick={toggleGrowTheCauseModal}>
            <GrowButtonContent>
              <Chevron src="/images/blueDownChevron.svg" isUp={!isGrowModalOpened} />
              {intl.formatMessage({ id: 'cause.grow-the-cause' })}
            </GrowButtonContent>
          </GrowButton>
          <Modal
            isOpened={isGrowModalOpened}
            onClose={toggleGrowTheCauseModal}
            shouldDisplayCloseIcon
          >
            <div />
          </Modal>
        </>
      );
    }

    return (
      <>
        {!isCauseOwner || !isCauseUpdateEnable || (
          <Button size="small" variant="contained" color="primary" onClick={updateCause}>
            {intl.formatMessage({ id: 'cause.update' })}
          </Button>
        )}
        <Button size="small" variant="outlined" color="primary" onClick={onShare}>
          {intl.formatMessage({ id: 'cause.share-button' })}
        </Button>
      </>
    );
  };

  const Container = isMobile === true ? StickyMobileButtonsContainer : DesktopContainer;
  return <Container>{renderContent()}</Container>;
};

export default HeaderButtons;
