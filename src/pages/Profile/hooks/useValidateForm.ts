import { useIntl } from 'react-intl';
import { isFieldEmpty } from 'services/formik/form';
import { PhoneCountry } from './useFetchPhoneCountries';

export const GENDERS: { labelKey: string; value: string; isPlaceholder?: boolean }[] = [
  { labelKey: 'profile.gender.placeholder', value: 'none', isPlaceholder: true },
  { labelKey: 'profile.gender.male', value: 'male' },
  { labelKey: 'profile.gender.female', value: 'female' },
];

export interface ProfileFormValues {
  firstName: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phoneCountry?: PhoneCountry;
  gender?: string;
  birthday?: string | null;
  coalitionSubscription?: boolean;
  causeSubscription?: boolean;
}

type ErrorForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  birthday?: string | null;
};

export const useValidateForm = () => {
  const intl = useIntl();

  const validateForm = ({ firstName }: ProfileFormValues) => {
    const errors = {} as ErrorForm;
    const requiredErrorMessage = intl.formatMessage({ id: 'form_errors.required' });

    if (isFieldEmpty(firstName)) {
      errors.firstName = requiredErrorMessage;
    }

    if (firstName !== undefined && firstName.length < 2) {
      errors.firstName = intl.formatMessage({ id: 'form_errors.too-short' }, { minLength: 2 });
    }

    /* if (isFieldEmpty(cityId)) {
      errors.cityId = requiredErrorMessage;
    } */

    return errors;
  };

  return { validateForm };
};
