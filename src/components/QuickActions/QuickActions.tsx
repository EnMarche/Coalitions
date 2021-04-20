import InputField from 'components/InputField';
import { InputFieldWrapper } from 'components/InputField/InputField.style';
import React, { FunctionComponent, useEffect } from 'react';
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
import {
  hasFormErrors,
  QuickActionError,
  QuickActionsForms,
  useValidateQuickActionsForm,
} from './useValidateQuickActionsForm';
import { AddButton } from './components/AddButton/AddButton';
import { usePublishQuickActions } from './usePublishQuickActions';
import { useFetchQuickActions } from 'redux/Cause/hooks/useFetchQuickActions';
import { useSelector } from 'react-redux';
import { getCauseQuickActions } from 'redux/Cause/selectors';
import Loader from 'components/Loader';

type QuickActionsProps = {
  causeId: string;
};

export const QuickActions: FunctionComponent<QuickActionsProps> = ({ causeId }) => {
  const { formatMessage } = useIntl();
  const { validateForm } = useValidateQuickActionsForm();
  const { loading, publishQuickActions } = usePublishQuickActions(causeId);
  const { fetchQuickActions } = useFetchQuickActions(causeId);
  const quickActions = useSelector(getCauseQuickActions(causeId));

  useEffect(() => {
    fetchQuickActions();
  }, [fetchQuickActions]);

  const onSubmit = async (values: QuickActionsForms) => {
    await publishQuickActions(values.quickActions);
  };
  return (
    <>
      <QuickActionsTitle>
        <FormattedMessage id="quick_actions.title" />
      </QuickActionsTitle>
      <QuickActionsDescription>
        <FormattedMessage id="quick_actions.description" />
      </QuickActionsDescription>
      {quickActions === undefined ? (
        <Loader />
      ) : (
        <Formik<QuickActionsForms>
          initialValues={
            quickActions.length > 0 ? { quickActions } : { quickActions: [{ label: '', link: '' }] }
          }
          onSubmit={onSubmit}
          validate={validateForm}
          validateOnMount={true}
        >
          {// eslint-disable-next-line complexity
          ({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
            <form onSubmit={handleSubmit}>
              <FieldArray
                name="quickActions"
                render={arrayHelpers => (
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
                            <QuickActionDeleteButton onClick={() => arrayHelpers.remove(index)}>
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
                            />
                          </InputFieldWrapper>
                        </QuickActionContainer>
                      );
                    })}
                    <AddButton
                      disabled={
                        errors.quickActions === undefined
                          ? false
                          : hasFormErrors(errors.quickActions as QuickActionError[])
                      }
                      push={arrayHelpers.push}
                    />
                  </>
                )}
              />
              <ValidateButton
                disabled={
                  errors.quickActions === undefined
                    ? false
                    : hasFormErrors(errors.quickActions as QuickActionError[])
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
      )}
    </>
  );
};