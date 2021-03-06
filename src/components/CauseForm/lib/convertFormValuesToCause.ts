import { FormValues } from './useValidateForm';
import { Coalition } from 'redux/Coalition/types';
import { Cause, InCreationCause } from 'redux/Cause/types';

export const convertFormValuesToCause = (formValues: FormValues): Cause | InCreationCause => ({
  uuid: formValues.uuid as string,
  name: formValues.title as string,
  image_url: formValues.image as string,
  description: formValues.description !== undefined ? formValues.description : '',
  followers_count: 1,
  supported: true,
  coalition: (formValues.coalitions as Coalition[])[0],
  second_coalition: (formValues.coalitions as Coalition[])[1],
});
