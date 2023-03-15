import {
  Text,
  Image,
  Link,
  FormTemplate,
} from '@concepta/react-material-ui/dist';
import SimpleForm, {
  FormType,
} from '@concepta/react-material-ui/dist/components/SimpleForm';
import React from 'react';
import logo from '../../assets/images/logo.svg';

interface ContentDefault {
  title?: string;
  subtitle?: string;
  continueWith?: string;
  logo?: React.ReactNode;
}

interface DefaultFooter {
  fp: React.ReactNode;
  su?: React.ReactNode;
}

interface SignInProps {
  customForm?: object;
  handleSubmit?: () => void;
  isSignUp?: boolean;
  customPlugin?: React.ReactNode;
  defaultValues?: ContentDefault;
  defaultFooter?: DefaultFooter;
  form?: FormType;
  hidePlugin?: boolean;
  children?: React.ReactNode;
  content?: ContentDefault;
  footer?: DefaultFooter;
}

const defaultForm: FormType = {
  title: 'Simplest form ever',
  submitButtonLabel: 'Send',
  fields: {
    username: {
      type: 'string',
      title: 'Username',
      required: true,
    },
    password: {
      type: 'password',
      title: 'Password',
      required: true,
    },
  },
};

const CustomSignIn: React.FC<SignInProps> = ({
  handleSubmit,
  form = defaultForm,
  defaultValues = {
    title: `Welcome`,
    subtitle: `Sign in to continue`,
    continueWith: `Continue With`,
    logo: <Image src={logo} alt="Logo" />,
  },
  content,
  defaultFooter = {
    fp: (
      <Text mb={3} mt={3} fontSize={14} fontWeight={500} gutterBottom>
        <Link
          fontSize={14}
          fontWeight={400}
          gutterBottom
          sx={{ marginTop: 3, textDecoration: 'none' }}
          href={'/recover-password'}
        >
          Forgot your password?
        </Link>
      </Text>
    ),
    su: (
      <Text mb={3} mt={3} fontSize={14} fontWeight={500} gutterBottom>
        <Link href={'/change-password'}>No account? Sign up</Link>
      </Text>
    ),
  },
  footer,
  children,
}) => {
  return (
    <>
      <FormTemplate
        title={content?.title ? content.title : defaultValues.title}
        subtitle={
          content?.subtitle ? content?.subtitle : defaultValues.subtitle
        }
        icon={content?.logo ? content?.logo : defaultValues.logo}
        subtitleTextProps={{ fontSize: '22px' }}
      >
        <SimpleForm form={form} onSubmit={handleSubmit} />
        {footer?.fp ? footer.fp : defaultFooter.fp}
        {footer?.su ? footer.su : defaultFooter.su}
        {children}
      </FormTemplate>
    </>
  );
};

export default CustomSignIn;
