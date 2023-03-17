import React from 'react';
import { FormTemplate, Image, SimpleForm } from '@concepta/react-material-ui';
import logo from '../../assets/images/logo.svg';
import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';

interface ContentDefault {
  title: string;
  subtitle: string;
  continueWith: string;
  emailRecovery: string;
  logo: React.ReactNode;
}

const defaultForm: FormType = {
  submitButtonLabel: 'Email me a recovery link',
  fields: {
    username: {
      type: 'string',
      title: 'Your Email Adress',
      required: true,
    },
  },
};

interface CustomForgotPasswordProps {
  customForm?: object;
  handleSubmit?: () => void;
  form?: FormType;
  defaultValues?: ContentDefault;
  success?: boolean;
  successComponent?: React.ReactNode;
  content?: ContentDefault;
}

const CustomForgotPassword: React.FC<CustomForgotPasswordProps> = ({
  handleSubmit,
  form = defaultForm,
  defaultValues = {
    title: 'Recover Password',
    subtitle: `Don’t worry, happens to the best of us`,
    emailRecovery: 'Email me a recovery link',
    logo: <Image src={logo} alt="Logo" />,
  },
  success,
  successComponent,
  content,
}) => {
  return (
    <>
      {success ? (
        successComponent
      ) : (
        <FormTemplate
          title={content?.title ? content.title : defaultValues.title}
          subtitle={
            content?.subtitle ? content?.subtitle : defaultValues.subtitle
          }
          icon={content?.logo ? content?.logo : defaultValues.logo}
        >
          <SimpleForm form={form} onSubmit={handleSubmit} />
        </FormTemplate>
      )}
    </>
  );
};

export default CustomForgotPassword;
