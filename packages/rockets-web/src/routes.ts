import Login from 'app/screens/Login';
import React from 'react';
import Main from 'app/screens/Main';
import Theme from 'app/screens/Theme';
import Table from 'app/screens/Table';
import Jsonform from 'app/screens/Jsonform';
import SimpleForm from 'app/screens/SimpleForm';
import TeamMembers from 'app/screens/TeamMembers';
import Profile from 'app/screens/Profile';
import CompleteProfile from 'app/screens/CompleteProfile';
import RecoverPassword from 'app/screens/RecoverPassword';
import ChangePassword from 'app/screens/RecoverPassword/Steps/ChangePassword';
import Example from 'app/screens/Example';

interface Routes {
  name: string;
  route: string;
  component: React.FC<any> | null;
  props?: Record<string, any>;
}

const routes: Array<Routes> = [
  {
    name: 'Login',
    route: '/login',
    component: Login,
    props: { type: 'signIn' },
  },
  {
    name: 'Example',
    route: '/example',
    component: Example,
  },
  {
    name: 'Complete Profile',
    route: '/complete-profile',
    component: CompleteProfile,
  },
  {
    name: 'Recover Password',
    route: '/recover-password',
    component: RecoverPassword,
  },
  {
    name: 'Change Password',
    route: '/change-password',
    component: ChangePassword,
  },
  // {
  //   name: 'Sign up',
  //   route: '/sign-up',
  //   component: Login,
  //   props: { type: 'signUp' },
  // },
  {
    name: 'Main',
    route: '/home',
    component: Main,
  },
  {
    name: 'Theme',
    route: '/theme',
    component: Theme,
  },
  {
    name: 'Table',
    route: '/table',
    component: Table,
  },
  {
    name: 'Jsonform',
    route: '/jsonform',
    component: Jsonform,
  },
  {
    name: 'Simple Forms',
    route: '/simple-forms',
    component: SimpleForm,
  },
  {
    name: 'Team Members',
    route: '/team-members',
    component: TeamMembers,
  },
  {
    name: 'Profile',
    route: '/profile',
    component: Profile,
  },
];

export default routes;
