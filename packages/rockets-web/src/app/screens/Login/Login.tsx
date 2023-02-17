import React, { FC, useState } from 'react';

// Concepta Components
import { useAuth } from '@concepta/react-auth-provider';
import { useNavigate } from '@concepta/react-router';
import {
  FormTemplate,
  Image,
  Link,
  SimpleForm,
  Text,
} from '@concepta/react-material-ui/dist';

// Content
import form from 'app/forms/Login';
import content from 'app/content/content';

// External Components
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IChangeEvent } from '@rjsf/core';

// Project Components
import Plugins from './../../components/Plugins';
import Github from './../../components/Github';
import CustomAlert from '../../components/CustomAlert';

interface FormData {
  username: string;
  password: string;
}

interface LoginProps {
  title: string;
}

const Login: FC<LoginProps> = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const isSignUp = false;

  const { doLogin, user } = useAuth();

  React.useEffect(() => {
    setError(false);
    if (user) {
      console.log('user Logged', user);
      navigate('/complete-profile');
    }
  }, [user]);

  const handleSubmit = async (values: IChangeEvent<FormData>) => {
    const { username, password } = values?.formData;
    doLogin({ username, password });
  };

  return (
    <>
      <FormTemplate
        title={content.signIn.title}
        subtitle={content.signIn.signIn}
        icon={<Image src={content.signIn.logo} alt="Logo" />}
        subtitleTextProps={{ fontSize: '22px' }}
      >
        <SimpleForm form={form} onSubmit={handleSubmit} />
        <Text mb={3} mt={3} fontSize={14} fontWeight={500} gutterBottom>
          <Link
            fontSize={14}
            fontWeight={400}
            gutterBottom
            sx={{ marginTop: 3, textDecoration: 'none' }}
            href={isSignUp ? '/login' : '/sign-up'}
          >
            {content.signIn.forgotPassword}
          </Link>
        </Text>
        <Plugins text={content.signIn.continueWith}>
          <Github />
        </Plugins>
        <Text mb={3} mt={3} fontSize={14} fontWeight={500} gutterBottom>
          <Link href={isSignUp ? '/login' : '/sign-up'}>
            {isSignUp
              ? content.signIn.alreadyAccount
              : content.signIn.noAccount}
          </Link>
        </Text>
      </FormTemplate>
      <CustomAlert
        icon={<CheckCircleIcon fontSize="inherit" />}
        message="Request error message"
        status={error}
      />
    </>
  );
};

export default Login;
