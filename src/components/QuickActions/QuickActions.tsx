import InputField from 'components/InputField';
import { InputFieldWrapper } from 'components/InputField/InputField.style';
import React, { FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  QuickActionsTitle,
  QuickActionsDescription,
  ValidateButton,
  QuickActionContainer,
  QuickActionDeleteButton,
  QuickActionHeadLineContainer,
} from './QuickActions.style';
import Formik from 'components/Formik';
import { FieldArray, getIn } from 'formik';
import { QuickActionsForms, useValidateQuickActionsForm } from './useValidateQuickActionsForm';
import { AddButton } from './components/AddButton/AddButton';
import { usePublishQuickActions } from './usePublishQuickActions';
import { useSelector } from 'react-redux';
import { getCauseQuickActions } from 'redux/Cause/selectors';
import { Cause } from 'redux/Cause/types';

type QuickActionsProps = {
  cause: Cause;
};

export const QuickActions: FunctionComponent<QuickActionsProps> = ({ cause }) => {
  const { formatMessage } = useIntl();
  const { validateForm } = useValidateQuickActionsForm();
  const { loading, publishQuickActions } = usePublishQuickActions(cause);
  const quickActions = useSelector(getCauseQuickActions(cause.uuid));

  const onSubmit = async (values: QuickActionsForms) => {
    await publishQuickActions(values.quickActions);
  };

  const initialValues =
    quickActions !== undefined && quickActions.length > 0
      ? { quickActions }
      : { quickActions: [{ label: '', link: '' }] };

  return (
    <>
      <QuickActionsTitle>
        <FormattedMessage id="quick_actions.title" />
      </QuickActionsTitle>
      <QuickActionsDescription>
        <FormattedMessage id="quick_actions.description" />
      </QuickActionsDescription>
      <Formik<QuickActionsForms>
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validateForm}
        enableReinitialize
        isInitialValid={Object.keys(validateForm(initialValues)).length === 0}
      >
        {// eslint-disable-next-line complexity
        ({ values, handleChange, handleBlur, handleSubmit, touched, errors, setFieldTouched }) => (
          <form onSubmit={handleSubmit}>
            <FieldArray
              name="quickActions"
              render={arrayHelpers => {
                const deleteAction = (index: number) => () => {
                  setFieldTouched('quickActions');
                  arrayHelpers.remove(index);
                };
                return (
                  <>
                    {values.quickActions.map((quickAction, index) => {
                      const labelFieldName = `quickActions[${index}].label`;
                      const labelFieldTouched = getIn(touched, labelFieldName);
                      const labelFieldError = getIn(errors, labelFieldName);

                      const linkFieldName = `quickActions[${index}].link`;
                      const linkFieldTouched = getIn(touched, linkFieldName);
                      const linkFieldError = getIn(errors, linkFieldName);
                      return (
                        <QuickActionContainer
                          key={quickAction.id !== undefined ? quickAction.id : index}
                        >
                          <QuickActionHeadLineContainer>
                            <h3>
                              <FormattedMessage
                                id="quick_actions.action-title"
                                values={{ number: index + 1 }}
                              />
                            </h3>
                            <QuickActionDeleteButton onClick={deleteAction(index)}>
                              <FormattedMessage id="quick_actions.action-delete" />
                            </QuickActionDeleteButton>
                          </QuickActionHeadLineContainer>
                          <InputFieldWrapper>
                            <InputField
                              required
                              placeholder={formatMessage({ id: 'quick_actions.label' })}
                              type="text"
                              name={labelFieldName}
                              error={labelFieldTouched === true && labelFieldError !== undefined}
                              helperText={labelFieldTouched === true ? labelFieldError : null}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={quickAction.label}
                              inputProps={{ maxLength: 100 }}
                            />
                          </InputFieldWrapper>
                          <InputFieldWrapper>
                            <InputField
                              required
                              placeholder={formatMessage({ id: 'quick_actions.link' })}
                              type="text"
                              name={linkFieldName}
                              error={linkFieldTouched === true && linkFieldError !== undefined}
                              helperText={linkFieldTouched === true ? linkFieldError : null}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={quickAction.link}
                              inputProps={{ maxLength: 255 }}
                            />
                          </InputFieldWrapper>
                        </QuickActionContainer>
                      );
                    })}
                    <AddButton disabled={Object.keys(errors).length > 0} push={arrayHelpers.push} />
                  </>
                );
              }}
            />
            <ValidateButton
              disabled={
                loading || touched.quickActions === undefined || Object.keys(errors).length > 0
              }
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              isLoading={loading}
            >
              <FormattedMessage id="quick_actions.validate" />
            </ValidateButton>
          </form>
        )}
      </Formik>
    </>
  );
};
