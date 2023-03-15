import React from 'react';
import { FormTemplate, Image, Text } from '@concepta/react-material-ui';
import logo from '../../../../assets/images/logo.svg';

interface ContentDefault {
  title: string;
  subtitle: string;
  confirmationText: string;
  linkText: string;
  logo: React.ReactNode;
}

interface SuccessRequestProps {
  defaultValues?: ContentDefault;
}

const SuccessRequest: React.FC<SuccessRequestProps> = ({
  defaultValues = {
    title: 'Recover Password',
    subtitle: 'Don’t worry, happens to the best of us',
    confirmationText: 'An email has been sent.',
    linkText: 'Please Click the link to reset your password',
    logo: <Image src={logo} alt="Logo" />,
  },
}) => {
  return (
    <>
      <FormTemplate
        title={defaultValues.title}
        subtitle={defaultValues.subtitle}
        icon={defaultValues.logo}
      >
        <Text fontWeight={500} fontSize="14px">
          {defaultValues.confirmationText}
        </Text>
        <Text fontSize="14px">{defaultValues.linkText}</Text>
      </FormTemplate>
    </>
  );
};

export default SuccessRequest;
