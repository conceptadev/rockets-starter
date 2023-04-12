import { FC } from 'react';
import { FormValidation, RJSFSchema } from '@rjsf/utils';
import LiveForm from 'app/components/LiveForm';

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

  const schema: RJSFSchema = {
    properties: {
      email: {
        type: 'string',
        title: 'Email',
      },
      password: {
        type: 'string',
        title: 'Password',
      },
      checkbox: { type: 'boolean', title: 'Subscribe' },
      checkboxes: {
        type: 'string',
        title: 'Your kind of drinks',
        enum: ['Beer', 'Vodka', 'Champagne', 'Rum', 'Gin'],
      },
      character: {
        title: "Who's your favorite character",
        enum: ['Mario', 'Sonic', 'Lara Croft', 'Pac-man'],
      },
      series: {
        title: 'Favorite series',
        enum: [
          'strangerThings',
          'gameOfThrones',
          '13ReasonsWhy',
          'greysAnatomy',
          'moneyHeist',
        ],
      },
      address: { type: 'string', title: 'Address' },
      multiAddress: {
        type: 'array',
        title: 'Multi Address',
        items: [
          {
            type: 'string',
            title: 'Address',
          },
          {
            type: 'string',
            title: 'City',
          },
          {
            type: 'string',
            title: 'Type of address',
            enum: ['House', 'Apartment', 'Commercial building'],
          },
          {
            type: 'boolean',
            title: 'Is home address',
          },
        ],
      },
      radio: {
        title: 'Which is your favorite for gaming?',
        enum: ['ps5', 'xbox', 'pc', 'mobile'],
      },
      switch: {
        title: 'Is this thing on?',
      },
    },
    required: ['email', 'password'],
  };

  // const advancedProperties: Record<string, AdvancedProperty> = {
  //   password: {
  //     type: 'password',
  //   },
  //   switch: {
  //     type: 'switch',
  //   },
  //   checkbox: { type: 'checkbox' },
  //   checkboxes: {
  //     type: 'checkboxes',
  //   },
  //   character: {
  //     type: 'select',
  //   },
  //   series: {
  //     type: 'select',
  // options: [
  //   { value: 'strangerThings', label: 'Stranger Things' },
  //   { value: 'gameOfThrones', label: 'Game of Thrones' },
  //   { value: '13ReasonsWhy', label: '13 Reasons Why' },
  //   { value: 'greysAnatomy', label: "Grey's anatomy" },
  //   { value: 'moneyHeist', label: 'Money Heist' },
  // ],
  //   },
  //   address: { type: 'stringArray' },
  //   multiAddress: {
  //     type: 'array',
  //     advancedProperties: {
  //       name: {
  //         type: 'string',
  //       },
  //       city: {
  //         type: 'string',
  //       },
  //       addressType: {
  //         type: 'select',
  // options: ['House', 'Apartment', 'Commercial building'],
  //       },
  //       isPrimaryAddress: {
  //         type: 'checkbox',
  //       },
  //     },
  //   },
  //   radio: {
  //     type: 'radio',
  // options: [
  //   { value: 'ps5', label: 'PS5' },
  //   { value: 'xbox', label: 'Xbox' },
  //   { value: 'pc', label: 'PC' },
  //   { value: 'mobile', label: 'Mobile' },
  // ],
  //   },
  // };

  const initialData = {
    email: 'myemail@gomail.com',
    password: '213123',
    checkbox: true,
    checkboxes: ['Beer', 'Rum'],
    character: 'Sonic',
    series: 'strangerThings',
    address: ['ministro calogeras'],
    multiAddress: ['12', 'Joinville', 'Apartment', true],
    radio: 'ps5',
    switch: true,
  };

  return (
    <LiveForm
      // advancedProperties={advancedProperties}
      onSubmit={values => console.log('values', values)}
      customValidate={validate}
      onError={onError}
      formData={initialData}
    />
  );
};

export default Form;
