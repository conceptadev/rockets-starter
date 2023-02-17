import { FormTemplate, Image, Text } from '@concepta/react-material-ui';
import content from 'app/content/content';

const SuccessRequest = () => {
  return (
    <>
      <FormTemplate
        title={content.recoverPassword.steps.successRequest.title}
        subtitle={content.recoverPassword.steps.successRequest.subtitle}
        icon={<Image src={content.signIn.logo} alt="Logo" />}
      >
        <Text fontWeight={500} fontSize="14px">
          {content.recoverPassword.steps.successRequest.confirmationText}
        </Text>
        <Text fontSize="14px">
          {content.recoverPassword.steps.successRequest.linkText}
        </Text>
      </FormTemplate>
    </>
  );
};

export default SuccessRequest;
