import { QuickActions } from 'components/QuickActions/QuickActions';
import { TabsWrapper } from 'components/TabsWrapper/TabsWrapper';
import UpdateCause from 'components/UpdateCause';
import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import { CauseAdminContainer } from './CauseAdmin.style';

interface CausePageNavParams {
  causeId: string;
}

const CauseAdmin: FunctionComponent = () => {
  const { causeId } = useParams<CausePageNavParams>();

  const renderTabPanel = (tabIndex: number) => {
    if (causeId === null) {
      return <></>;
    }
    switch (tabIndex) {
      case 0:
        return <UpdateCause causeId={causeId} />;
      case 1:
        return <QuickActions causeId={causeId} />;
      default:
        return <></>;
    }
  };

  return (
    <CauseAdminContainer>
      <TabsWrapper
        renderTabPanel={renderTabPanel}
        tabsLabel={[
          <FormattedMessage id="admin_cause.update-cause" key="admin_cause.update-cause" />,
          <FormattedMessage id="admin_cause.quick-action" key="admin_cause.quick-action" />,
        ]}
      />
    </CauseAdminContainer>
  );
};

export default CauseAdmin;
