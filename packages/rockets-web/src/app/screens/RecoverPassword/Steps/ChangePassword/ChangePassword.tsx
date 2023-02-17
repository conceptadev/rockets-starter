import { FormTemplate, Image, SimpleForm } from '@concepta/react-material-ui';
import content from 'app/content/content';
import form from 'app/forms/ChangePassword';

const ChangePassword = () => {
  return (
    <>
      <FormTemplate
        icon={<Image src={content.signIn.logo} alt="Logo" />}
        title={content.recoverPassword.steps.changePassword.title}
      >
        <SimpleForm form={form} />
      </FormTemplate>
    </>
  );
};

export default ChangePassword;
