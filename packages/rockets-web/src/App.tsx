import { useContext } from "react";
import { AuthProvider } from "@concepta/react-auth-provider";
import { ThemeProvider } from "@concepta/react-material-ui/dist/styles";
import {
  ThemeContext,
  ThemeContextType,
} from "app/context/ThemeContextProvider";
import { PublicRoute, Router } from "@concepta/react-router";
import routes from "./routes";
import { themeLight, themeDark } from "app/styles/theme";

const NotFound = () => {
  return <div>Not Found</div>;
};

const Unauthorized = () => {
  return <div>Unauthorized</div>;
};

function App() {
  const { darkMode } = useContext(ThemeContext) as ThemeContextType;

  return (
    <ThemeProvider theme={darkMode ? themeDark : themeLight}>
      <AuthProvider>
        <Router
          isAuth={false}
          NotFoundComponent={NotFound}
          UnauthorizedComponent={Unauthorized}
        >
          {routes.map((route) => (
            <PublicRoute
              path={route.route}
              Component={route.component}
              key={route.name}
              {...route.props}
            />
          ))}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
