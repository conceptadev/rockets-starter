import { FC } from 'react';
import { FormValidation } from '@rjsf/utils';
import LiveForm from 'app/components/LiveForm';
import { AdvancedProperty } from 'app/components/LiveForm/LiveFormTypes';

type FormData = {
  email: string;
  password: string;
  checkbox: boolean;
  checkboxes: string[];
  character: string;
  series: string;
  address: string[];
  multiAddress: {
    name: string;
    city: string;
    addressType: string;
    isPrimaryAddress: boolean;
  }[];
  radio: string;
  switch: boolean;
};

const Form: FC = () => {
  const validate = (formData: FormData, errors: FormValidation) => {
    if (!formData.switch) {
      errors?.switch?.addError('Must accept to proceed');
    }

    return errors;
  };

  const onError = (error: unknown) => {
    console.error(error);
  };

  const advancedProperties: Record<string, AdvancedProperty> = {
    password: {
      type: 'password',
    },
    switch: {
      type: 'switch',
    },
    checkbox: { type: 'checkbox' },
    checkboxes: {
      type: 'checkboxes',
    },
    character: {
      type: 'select',
    },
    series: {
      type: 'select',
      options: [
        { value: 'strangerThings', label: 'Stranger Things' },
        { value: 'gameOfThrones', label: 'Game of Thrones' },
        { value: '13ReasonsWhy', label: '13 Reasons Why' },
        { value: 'greysAnatomy', label: "Grey's anatomy" },
        { value: 'moneyHeist', label: 'Money Heist' },
      ],
    },
    address: { type: 'stringArray' },
    multiAddress: {
      type: 'array',
      advancedProperties: {
        street: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        addressType: {
          type: 'select',
          options: ['House', 'Apartment', 'Commercial building'],
        },
        isPrimaryAddress: {
          type: 'checkbox',
        },
      },
    },
    radio: {
      type: 'radio',
      options: [
        { value: 'ps5', label: 'PS5' },
        { value: 'xbox', label: 'Xbox' },
        { value: 'pc', label: 'PC' },
        { value: 'mobile', label: 'Mobile' },
      ],
    },
  };

  const initialData = {
    email: 'myemail@gomail.com',
    password: '213123',
    checkbox: true,
    checkboxes: ['Beer', 'Rum'],
    character: 'Sonic',
    series: 'strangerThings',
    address: ['ministro calogeras'],
    multiAddress: [
      {
        street: '12',
        city: 'Joinville',
        addressType: 'Apartment',
        isPrimaryAddress: true,
      },
    ],
    radio: 'ps5',
    switch: true,
  };

  return (
    <LiveForm
      advancedProperties={advancedProperties}
      lfFormKey="testing"
      onSubmit={values => console.log('values', values)}
      customValidate={validate}
      onError={onError}
      formData={initialData}
    />
  );
};

export default Form;
