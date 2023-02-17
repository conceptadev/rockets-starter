import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';

const form: FormType = {
  submitButtonLabel: 'Email me a recovery link',
  fields: {
    username: {
      type: 'string',
      title: 'Your Email Adress',
      required: true,
    },
  },
};

export default form;
