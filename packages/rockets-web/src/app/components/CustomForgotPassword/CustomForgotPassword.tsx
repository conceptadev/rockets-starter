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
  defaultValues: ContentDefault;
  success?: boolean;
  successComponent?: React.ReactNode;
}

const CustomForgotPassword: React.FC<CustomForgotPasswordProps> = ({
  handleSubmit,
  form = defaultForm,
  defaultValues = {
    title: 'Don’t worry, happens to the best of us',
    subtitle: `Sign in to continue`,
    emailRecovery: 'Email me a recovery link',
    logo: <Image src={logo} alt="Logo" />,
  },
  success,
  successComponent,
}) => {
  return (
    <>
      {success ? (
        successComponent
      ) : (
        <FormTemplate
          icon={defaultValues.logo}
          title={defaultValues.title}
          subtitle={defaultValues.subtitle}
        >
          <SimpleForm form={form} onSubmit={handleSubmit} />
        </FormTemplate>
      )}
    </>
  );
};

export default CustomForgotPassword;
