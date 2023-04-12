import logo from '../assets/images/logo.svg';

export const content = {
  signIn: {
    title: 'Welcome Back',
    signIn: 'Sign in to continue',
    forgotPassword: 'Forgot your password?',
    noAccount: 'No account? Sign up',
    alreadyAccount: 'Already have an account? Sign in',
    continueWith: 'Or continue with',
    logo: logo,
  },
  completeProfile: {
    title: 'Complete Profile',
    subTitle: 'We want to get to know you',
    inputLabelOne: 'First Name',
    inputLabelTwo: 'Last Name',
    buttonText: 'Continue',
  },
  recoverPassword: {
    title: 'Recover Password',
    subtitle: 'Don’t worry, happens to the best of us',
    emailRecovery: 'Email me a recovery link',
    steps: {
      successRequest: {
        title: 'Recover Password',
        subtitle: 'Don’t worry, happens to the best of us',
        confirmationText: 'An email has been sent.',
        linkText: 'Please Click the link to reset your password',
      },
      changePassword: {
        title: 'Change Password',
        buttonText: 'Change Password',
      },
    },
  },
};

export default content;
