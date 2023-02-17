import { FormTemplate, Image, SimpleForm } from '@concepta/react-material-ui';
import content from 'app/content/content';
import form from 'app/forms/RecoverPassword';
import { useEffect, useState } from 'react';
import SuccessRequest from './Steps/SuccessRequest/SuccessRequest';

const RecoverPassword = () => {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setSuccess(true);
  }, []);
  return (
    <>
      {success ? (
        <SuccessRequest />
      ) : (
        <FormTemplate
          icon={<Image src={content.signIn.logo} alt="Logo" />}
          title={content.recoverPassword.title}
          subtitle={content.recoverPassword.subtitle}
        >
          <SimpleForm form={form} />
        </FormTemplate>
      )}
    </>
  );
};

export default RecoverPassword;
