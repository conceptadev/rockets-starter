import { FC } from 'react';
import { SimpleForm } from '@concepta/react-material-ui';
import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';
import { FormValidation } from '@rjsf/utils';

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

  const form: FormType = {
    title: 'Simplest form ever',
    submitButtonLabel: 'Send',
    fields: {
      email: {
        type: 'string',
        title: 'Email',
        required: true,
      },
      password: {
        type: 'password',
        title: 'Password',
        required: true,
      },
      checkbox: { type: 'checkbox', title: 'Subscribe' },
      checkboxes: {
        type: 'checkboxes',
        title: 'Your kind of drinks',
        options: ['Beer', 'Vodka', 'Champagne', 'Rum', 'Gin'],
      },
      character: {
        title: "Who's your favorite character",
        type: 'select',
        options: ['Mario', 'Sonic', 'Lara Croft', 'Pac-man'],
      },
      series: {
        title: 'Favorite series',
        type: 'select',
        options: [
          { value: 'strangerThings', label: 'Stranger Things' },
          { value: 'gameOfThrones', label: 'Game of Thrones' },
          { value: '13ReasonsWhy', label: '13 Reasons Why' },
          { value: 'greysAnatomy', label: "Grey's anatomy" },
          { value: 'moneyHeist', label: 'Money Heist' },
        ],
      },
      address: { type: 'stringArray', title: 'Address' },
      multiAddress: {
        type: 'array',
        title: 'Address',
        fields: {
          name: {
            title: 'Adress',
            type: 'string',
          },
          city: {
            title: 'City',
            type: 'string',
          },
          addressType: {
            title: 'Type of address',
            type: 'select',
            options: ['House', 'Apartment', 'Commercial building'],
          },
          isPrimaryAddress: {
            title: 'Is home address',
            type: 'checkbox',
          },
        },
      },
      radio: {
        type: 'radio',
        title: 'Which is your favorite for gaming?',
        options: [
          { value: 'ps5', label: 'PS5' },
          { value: 'xbox', label: 'Xbox' },
          { value: 'pc', label: 'PC' },
          { value: 'mobile', label: 'Mobile' },
        ],
      },
      switch: {
        type: 'switch',
        title: 'Is this thing on?',
      },
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
        addressType: 'Apartment',
        city: 'Joinville',
        isPrimaryAddress: true,
        name: '12',
      },
    ],
    radio: 'ps5',
    switch: true,
  };

  return (
    <SimpleForm
      form={form}
      onSubmit={values => console.log('values', values)}
      validate={validate}
      onError={onError}
      initialData={initialData}
    />
  );
};

export default Form;
