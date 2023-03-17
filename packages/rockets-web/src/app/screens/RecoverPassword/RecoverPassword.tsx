// import { FormTemplate, Image, SimpleForm } from '@concepta/react-material-ui';
// import content from 'app/content/content';
// import form from 'app/forms/RecoverPassword';
import { useEffect, useState } from 'react';
import { Alert } from 'App';
import CustomAlert from 'app/components/CustomAlert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomForgotPassword from 'app/components/CustomForgotPassword';
import CustomSuccessRequest from 'app/components/CustomForgotPassword/Steps/CustomSuccessRequest';

const RecoverPassword = () => {
  const { opened, setOpened, message } = Alert.useContainer();

  const [success, setSuccess] = useState(false);
  useEffect(() => {
    setSuccess(true);
  }, []);
  return (
    <>
      {success ? <CustomSuccessRequest /> : <CustomForgotPassword />}
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
