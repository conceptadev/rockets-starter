import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';

const form: FormType = {
  submitButtonLabel: 'Sign in',
  fields: {
    username: {
      type: 'string',
      title: 'Email address',
      required: true,
    },
    password: {
      type: 'password',
      title: 'Password',
      required: true,
    },
  },
};

export default form;
