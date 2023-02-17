import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';

const apiContent = {
  title: 'Complete Profile',
  subTitle: 'We want to get to know you',
  inputLabelOne: 'First Name',
  inputLabelTwo: 'Last Name',
  buttonText: 'Continue',
};

const form: FormType = {
  submitButtonLabel: 'Continue',
  fields: {
    username: {
      type: 'string',
      title: apiContent.inputLabelOne,
      required: true,
    },
    password: {
      type: 'string',
      title: apiContent.inputLabelTwo,
    },
  },
};

export default form;
