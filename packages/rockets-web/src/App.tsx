import { useContext } from 'react';
import { AuthProvider } from '@concepta/react-auth-provider';
import { ThemeProvider } from '@concepta/react-material-ui/dist/styles';
import {
  ThemeContext,
  ThemeContextType,
} from 'app/context/ThemeContextProvider';
import { PublicRoute, Router } from '@concepta/react-router';
import routes from './routes';
import { themeLight } from 'app/styles/theme';
import { createContainer } from 'unstated-next';
import { useAlert } from 'hooks/useAlert';

export const Alert = createContainer(useAlert);

const NotFound = () => {
  return <div>Not Found</div>;
};

const Unauthorized = () => {
  return <div>Unauthorized</div>;
};

function App() {
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;

  return (
    <ThemeProvider theme={!darkMode ? themeLight : themeLight}>
      <AuthProvider>
        <Alert.Provider>
          <Router
            isAuth={false}
            NotFoundComponent={NotFound}
            UnauthorizedComponent={Unauthorized}
          >
            {routes.map(route => (
              <PublicRoute
                path={route.route}
                Component={route.component}
                key={route.name}
                {...route.props}
              />
            ))}
          </Router>
        </Alert.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
