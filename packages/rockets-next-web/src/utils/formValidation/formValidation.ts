import { FormValidation } from "@rjsf/utils";

export type ValidationRule<T> = {
  field: keyof T;
  test: (value: T[keyof T] | undefined | null, formData: T) => boolean;
  message: string;
};

export type ValidateFormErrors<T> = {
  [K in keyof T]?: boolean;
};

export const validateForm = <T>(
  formData: T,
  errors: FormValidation<T>,
  validationRules: ValidationRule<T>[]
): FormValidation<T> => {
  const errorsAdded: ValidateFormErrors<T> = {};

  for (const rule of validationRules) {
    const { field, test, message } = rule;
    const value = formData?.[field];

    if (test(value, formData)) {
      if (!errorsAdded?.[field]) {
        errors?.[field]?.addError(message);
        errorsAdded[field] = true;
      }
    }
  }

  return errors;
};

export default validateForm;
