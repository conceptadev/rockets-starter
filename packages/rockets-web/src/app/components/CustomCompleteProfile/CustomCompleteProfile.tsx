import { FormTemplate, Image, SimpleForm } from '@concepta/react-material-ui';
import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';
import React from 'react';
import logo from '../../assets/images/logo.svg';

interface ContentDefault {
  title: string;
  subtitle: string;
  logo: React.ReactNode;
}

interface CustomCompleteProfileProps {
  form?: FormType;
  defaultValues: ContentDefault;
  content: ContentDefault;
}

const defaultForm: FormType = {
  submitButtonLabel: 'Continue',
  fields: {
    username: {
      type: 'string',
      title: 'First Name',
      required: true,
    },
    password: {
      type: 'string',
      title: 'Last Name',
    },
  },
};

const CustomCompleteProfile: React.FC<CustomCompleteProfileProps> = ({
  form = defaultForm,
  defaultValues = {
    title: 'Don’t worry, happens to the best of us',
    subtitle: `Sign in to continue`,
    logo: <Image src={logo} alt="Logo" />,
  },
  content,
}) => {
  return (
    <FormTemplate
      title={content?.title ? content.title : defaultValues.title}
      subtitle={content?.subtitle ? content?.subtitle : defaultValues.subtitle}
      icon={content?.logo ? content?.logo : defaultValues.logo}
    >
      <SimpleForm form={form} />
    </FormTemplate>
  );
};

export default CustomCompleteProfile;
