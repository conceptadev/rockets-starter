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

interface CustomSuccessRequest {
  defaultValues?: ContentDefault;
  content?: ContentDefault;
}

const CustomSuccessRequest: React.FC<CustomSuccessRequest> = ({
  defaultValues = {
    title: 'Recover Password',
    subtitle: 'Don’t worry, happens to the best of us',
    confirmationText: 'An email has been sent.',
    linkText: 'Please Click the link to reset your password',
    logo: <Image src={logo} alt="Logo" />,
  },
  content,
}) => {
  return (
    <>
      <FormTemplate
        title={content?.title ? content.title : defaultValues.title}
        subtitle={
          content?.subtitle ? content?.subtitle : defaultValues.subtitle
        }
        icon={content?.logo ? content?.logo : defaultValues.logo}
      >
        <Text fontWeight={500} fontSize="14px">
          {content?.confirmationText
            ? content.confirmationText
            : defaultValues.confirmationText}
        </Text>
        <Text fontSize="14px">
          {content?.linkText ? content.linkText : defaultValues.linkText}
        </Text>
      </FormTemplate>
    </>
  );
};

export default CustomSuccessRequest;
