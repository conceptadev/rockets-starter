import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';
import CustomSignIn from 'app/components/CustomSignIn';
import { Text } from '@concepta/react-material-ui/dist';

const Example = () => {
  const exampleDefaultValue = {
    title: '',
    subtitle: 's',
    continueWith: 'Example text',
    logo: '',
  };

  const myForm: FormType = {
    title: 'Example Form',
    submitButtonLabel: 'Example Send Button',
    fields: {
      username: {
        type: 'string',
        title: 'Example Username',
        required: true,
      },
      password: {
        type: 'password',
        title: 'Example Password',
        required: true,
      },
    },
  };

  const myFooter = {
    fp: null,
    su: <Text>new test</Text>,
  };

  return (
    <>
      <CustomSignIn
        content={exampleDefaultValue}
        footer={myFooter}
        form={myForm}
      />
    </>
  );
};

export default Example;
