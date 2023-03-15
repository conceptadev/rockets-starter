import { FormTemplate, Image, SimpleForm } from '@concepta/react-material-ui';
import content from 'app/content/content';
import form from 'app/forms/RecoverPassword';
import { useEffect, useState } from 'react';
import SuccessRequest from './Steps/SuccessRequest/SuccessRequest';
import { Alert } from 'App';
import CustomAlert from 'app/components/CustomAlert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const RecoverPassword = () => {
  const { opened, setOpened, message } = Alert.useContainer();

  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setSuccess(false);
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
      {opened && (
        <CustomAlert
          close={() => setOpened(false)}
          icon={<CheckCircleIcon fontSize="inherit" />}
          message={message}
          status={opened}
        />
      )}
    </>
  );
};

export default RecoverPassword;
