import React, { FunctionComponent, ChangeEvent, useState } from 'react';
import { Connect, ConnectLink } from './LoginModal.style';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormValues } from './components/CreateAccountForm/lib/useValidateForm';
import { oauthUrl } from 'services/networking/auth';
import CreateAccountForm from './components/CreateAccountForm';
import HandleErrorService from 'services/HandleErrorService';
import { Modal } from 'components/Modal/Modal';
import { Title } from 'components/Modal/Modal.style';
import SuccessModalContent from 'components/SuccessModalContent';

interface LoginModalProps<OtherFormValues> {
  isOpened: boolean;
  onClose: () => void;
  onConnect: () => void;
  doAfterAccountCreation?: () => Promise<void>;
  doingAfterAccountCreation?: boolean;
  title: string;
  showSuccessScreenOnValidate?: boolean;
  AdditionalFields?: FunctionComponent<{
    onChange: (e: ChangeEvent) => void;
    values: OtherFormValues & FormValues;
  }>;
}

const LoginModal = <OtherFormValues,>({
  isOpened,
  onClose,
  onConnect,
  title,
  AdditionalFields,
  showSuccessScreenOnValidate,
  doAfterAccountCreation: doAfterAccountCreationProp,
  doingAfterAccountCreation,
}: LoginModalProps<OtherFormValues>) => {
  const intl = useIntl();
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);

  const doAfterAccountCreation = async () => {
    if (doAfterAccountCreationProp !== undefined) {
      try {
        await doAfterAccountCreationProp();
      } catch (e) {
        HandleErrorService.showErrorSnackbar(e);
      }
    }
    if (showSuccessScreenOnValidate === true) {
      setShowSuccessScreen(true);
    } else {
      onClose();
    }
  };

  const onConnectClick = () => {
    onConnect();
    window.location.href = oauthUrl;
  };

  const renderContent = () => {
    if (showSuccessScreen) {
      return (
        <SuccessModalContent
          imageUrl="/images/createCause.jpg"
          titleKey="login_modal.success_screen.title"
          contentKey="login_modal.success_screen.text"
        />
      );
    }

    return (
      <>
        <Title>{title}</Title>
        <Connect>
          <div>{intl.formatMessage({ id: 'login_modal.signed-up' })}</div>
          <ConnectLink onClick={onConnectClick}>
            <FormattedMessage id="login_modal.connect" />
          </ConnectLink>
        </Connect>
        <CreateAccountForm
          doAfterAccountCreation={doAfterAccountCreation}
          doingAfterAccountCreation={doingAfterAccountCreation}
        />
      </>
    );
  };

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      {renderContent()}
    </Modal>
  );
};

export default LoginModal;
