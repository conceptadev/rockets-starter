import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';

const form: FormType = {
  submitButtonLabel: 'Change Password',
  fields: {
    newPassword: {
      type: 'password',
      title: 'New Password',
      required: true,
    },
    password: {
      type: 'password',
      title: 'Re-enter your new password',
      required: true,
    },
  },
};

export default form;
