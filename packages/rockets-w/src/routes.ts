import Login from "app/screens/Login";
import React from "react";
// import Main from 'app/screens/Main'
// import Theme from 'app/screens/Theme'
// import Table from 'app/screens/Table'
// import Jsonform from 'app/screens/Jsonform'
// import SimpleForm from 'app/screens/SimpleForm'
// import TeamMembers from 'app/screens/TeamMembers'
// import Profile from 'app/screens/Profile'

interface Routes {
  name: string;
  route: string;
  component: React.FC<any> | null;
  props: Record<string, any>;
}

const routes: Array<Routes> = [
  {
    name: "Login",
    route: "/login",
    component: Login,
    props: { type: "signIn" },
  },
  // {
  //   name: 'Sign up',
  //   route: '/sign-up',
  //   component: Login,
  //   props: { type: 'signUp' },
  // },
  // {
  //   name: 'Main',
  //   route: '/home',
  //   component: Main,
  // },
  // {
  //   name: 'Theme',
  //   route: '/theme',
  //   component: Theme,
  // },
  // {
  //   name: 'Table',
  //   route: '/table',
  //   component: Table,
  // },
  // {
  //   name: 'Jsonform',
  //   route: '/jsonform',
  //   component: Jsonform,
  // },
  // {
  //   name: 'Simple Forms',
  //   route: '/simple-forms',
  //   component: SimpleForm,
  // },
  // {
  //   name: 'Team Members',
  //   route: '/team-members',
  //   component: TeamMembers,
  // },
  // {
  //   name: 'Profile',
  //   route: '/profile',
  //   component: Profile,
  // },
];

export default routes;
