/* eslint-disable max-lines */

import React, { FunctionComponent, useEffect } from 'react';
import {
  Container,
  Title,
  Description,
  Form,
  ModeButtonsContainer,
  ModeButton,
  DateFieldsWrapper,
  CategoryItem,
  BottomButtonsWrapper,
} from './EventForm.style';
import { useIntl } from 'react-intl';
import InputField from 'components/InputField';
import Formik from 'components/Formik';
import { useValidateForm } from './lib/useValidateForm';
import { CreateEventType, EventType, UpdatedEventType } from 'redux/Events/types';
import { InputFieldWrapper } from 'components/InputField/InputField.style';
import { getIsValidateButtonDisabled } from './lib/getIsValidateButtonDisabled';
import { getInitialValues } from './lib/getInitialValues';
import { useFetchEventCategories } from 'redux/Events/hooks/useFetchEventCategories';
import Loader from 'components/Loader';
import { DeleteEventButton } from './components';
import { FullWidthButton } from 'components/Button/Button';

interface EventFormProps {
  causeId: string;
  initialEvent?: EventType;
  onSubmit: (event: CreateEventType | UpdatedEventType) => void;
  isSubmitting: boolean;
}

const EventForm: FunctionComponent<EventFormProps> = ({
  initialEvent,
  onSubmit,
  isSubmitting,
  causeId,
}) => {
  const intl = useIntl();
  const { loading, eventCategories, fetchEventCategories } = useFetchEventCategories();
  const { validateForm } = useValidateForm();

  useEffect(() => {
    fetchEventCategories();
  }, [fetchEventCategories]);

  if (eventCategories.length === 0 && loading) {
    return <Loader fullScreen />;
  }

  const initialValues = getInitialValues({ initialEvent, causeId });

  return (
    <Container>
      <Title>
        {initialEvent !== undefined
          ? intl.formatMessage({ id: 'event_form.update.title' })
          : intl.formatMessage({ id: 'event_form.create.title' })}
      </Title>
      {initialEvent === undefined ? (
        <Description>{intl.formatMessage({ id: 'event_form.create.tips' })}</Description>
      ) : null}
      <Formik<CreateEventType | UpdatedEventType>
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {// eslint-disable-next-line complexity
        ({ values, errors, handleChange, handleBlur, handleSubmit, touched, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <input type="text" hidden value={initialValues.causeId} name="causeId" />
            <input type="text" hidden value={initialValues.timeZone} name="timeZone" />
            {(initialValues as UpdatedEventType).uuid !== undefined ? (
              <input
                type="text"
                hidden
                value={(initialValues as UpdatedEventType).uuid}
                name="uuid"
              />
            ) : null}
            <InputFieldWrapper>
              <InputField
                required
                placeholder={intl.formatMessage({ id: 'event_form.title' })}
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                error={touched.name === true && errors.name !== undefined}
                helperText={touched.name === true ? errors.name : undefined}
              />
            </InputFieldWrapper>
            <input type="text" hidden value={values.mode} name="mode" required />
            <ModeButtonsContainer mode={values.mode}>
              <ModeButton
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => {
                  setFieldValue('mode', 'meeting');
                  setFieldValue('visioUrl', '');
                }}
              >
                {intl.formatMessage({ id: 'event_form.mode.meeting' })}
              </ModeButton>
              <ModeButton
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => {
                  setFieldValue('mode', 'online');
                  setFieldValue('address', '');
                }}
              >
                {intl.formatMessage({ id: 'event_form.mode.online' })}
              </ModeButton>
            </ModeButtonsContainer>
            <InputFieldWrapper>
              <InputField
                required
                placeholder={intl.formatMessage({ id: 'event_form.address' })}
                type="text"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                error={
                  values.mode === 'meeting' &&
                  touched.address === true &&
                  errors.address !== undefined
                }
                helperText={
                  values.mode === 'meeting' && touched.address === true ? errors.address : undefined
                }
              />
            </InputFieldWrapper>
            <InputFieldWrapper>
              <InputField
                required={values.mode === 'online'}
                placeholder={intl.formatMessage({ id: 'event_form.link' })}
                type="text"
                name="visioUrl"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.visioUrl}
                error={
                  values.mode === 'online' &&
                  touched.visioUrl === true &&
                  errors.visioUrl !== undefined
                }
                helperText={
                  values.mode === 'online' && touched.visioUrl === true
                    ? errors.visioUrl
                    : undefined
                }
              />
            </InputFieldWrapper>
            <DateFieldsWrapper>
              <InputFieldWrapper>
                <InputField
                  required
                  placeholder={intl.formatMessage({ id: 'event_form.begin_at' })}
                  type="datetime-local"
                  name="beginAt"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.beginAt}
                  error={touched.beginAt === true && errors.beginAt !== undefined}
                  helperText={touched.beginAt === true ? errors.beginAt : undefined}
                  InputLabelProps={{ shrink: true }}
                />
              </InputFieldWrapper>
              <InputFieldWrapper>
                <InputField
                  required
                  placeholder={intl.formatMessage({ id: 'event_form.finish_at' })}
                  type="datetime-local"
                  name="finishAt"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.finishAt}
                  error={touched.finishAt === true && errors.finishAt !== undefined}
                  helperText={touched.finishAt === true ? errors.finishAt : undefined}
                  InputLabelProps={{ shrink: true }}
                />
              </InputFieldWrapper>
            </DateFieldsWrapper>
            <InputFieldWrapper>
              <InputField
                select
                required
                placeholder={intl.formatMessage({ id: 'event_form.category' })}
                type="text"
                name="categoryId"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.categoryId}
                error={touched.categoryId === true && errors.categoryId !== undefined}
                helperText={touched.categoryId === true ? errors.categoryId : undefined}
              >
                {eventCategories.map(category => (
                  <CategoryItem key={category.uuid} value={category.uuid}>
                    {category.name}
                  </CategoryItem>
                ))}
              </InputField>
            </InputFieldWrapper>
            <InputFieldWrapper>
              <InputField
                required
                placeholder={intl.formatMessage({ id: 'event_form.description' })}
                type="text"
                name="description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                error={touched.description === true && errors.description !== undefined}
                helperText={touched.description === true ? errors.description : undefined}
                multiline
                rows={10}
              />
            </InputFieldWrapper>
            <BottomButtonsWrapper>
              {initialEvent !== undefined ? <DeleteEventButton /> : null}
              <FullWidthButton
                isLoading={isSubmitting}
                disabled={
                  Boolean(isSubmitting) ||
                  getIsValidateButtonDisabled({
                    errors,
                    initialValues,
                    touched,
                    isUpdating: initialEvent !== undefined,
                    values,
                  })
                }
                type="submit"
                size="small"
                variant="contained"
                color="primary"
              >
                {initialEvent !== undefined
                  ? intl.formatMessage({ id: 'event_form.update.validate' })
                  : intl.formatMessage({ id: 'event_form.create.validate' })}
              </FullWidthButton>
            </BottomButtonsWrapper>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EventForm;

/* eslint-enable max-lines */
