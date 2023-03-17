import React from 'react';
import { FormTemplate, Image, SimpleForm } from '@concepta/react-material-ui';
import logo from '../../../../assets/images/logo.svg';
import { FormType } from '@concepta/react-material-ui/dist/components/SimpleForm';

interface ContentDefault {
  title: string;
  buttonText: string;
  logo: React.ReactNode;
}

const defaultForm: FormType = {
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

interface CustomChangePassword {
  defaultValues?: ContentDefault;
  form?: FormType;
  content?: ContentDefault;
}

const CustomChangePassword: React.FC<CustomChangePassword> = ({
  form = defaultForm,
  defaultValues = {
    title: 'Change Password',
    buttonText: 'Change Password',
    logo: <Image src={logo} alt="Logo" />,
  },
  content,
}) => {
  return (
    <FormTemplate
      title={content?.title ? content.title : defaultValues.title}
      icon={content?.logo ? content.logo : defaultValues.logo}
    >
      <SimpleForm form={form} />
    </FormTemplate>
  );
};

export default CustomChangePassword;
