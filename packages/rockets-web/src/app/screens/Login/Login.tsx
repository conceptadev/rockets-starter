import React from 'react';
import CustomSignIn from 'app/components/CustomSignIn';
import { Alert } from 'App';
import CustomAlert from 'app/components/CustomAlert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Login = () => {
  const { opened, setOpened, message } = Alert.useContainer();
  return (
    <>
      <CustomSignIn handleSubmit={() => setOpened(true)} />
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

export default Login;
