import { PropsWithChildren } from "react";
import { ClientProvider } from "@concepta/react-data-provider";
import { AuthProvider } from "@concepta/react-auth-provider";
import {
  RocketsAuthProps,
  RocketsDataProviderProps,
  RocketsLayoutProps,
} from "./types";
import { ThemeProvider } from "@concepta/react-material-ui/dist/styles";
import { ThemeProviderProps } from "@emotion/react";
import { themeLight } from "../../styles/theme";

export type RocketsProps = {
  /**
   * Authentication configuration for the Rockets component.
   */
  auth: Partial<RocketsAuthProps>;
  /**
   * Data provider configuration for the Rockets component.
   */
  dataProvider: Partial<RocketsDataProviderProps>;
  /**
   * Layout configuration for the Rockets component.
   */
  layout?: RocketsLayoutProps;

  theme?: ThemeProviderProps["theme"];
};

/**
 * The `Rockets` component serves as the main wrapper for the application,
 * providing authentication, data provider, and theme context to its children.
 *
 * @param children - The child components to be rendered within the Rockets component.
 * @param auth - The authentication configuration.
 * @param dataProvider - The data provider configuration.
 *
 * @example
 * ```tsx
 * <Rockets
 *   auth={{
 *     useAuth: myAuthHook,
 *     onAuthSuccess: handleSuccess,
 *     onAuthError: handleError,
 *     onLogout: handleLogout,
 *     handleRefreshTokenError: handleTokenError,
 *   }}
 *   dataProvider={{ apiUrl: 'https://api.example.com' }}
 *   layout={{ AppBar: MyAppBar, Layout: MyLayout, menuOptions: myMenuOptions }}
 * >
 *   <MyApp />
 * </Rockets>
 * ```
 */
const RocketsProvider = ({
  children,
  auth,
  dataProvider,
  theme,
}: PropsWithChildren<RocketsProps>) => {
  return (
    <ClientProvider
      baseUrl={dataProvider.apiUrl}
      onRefreshTokenError={auth.handleRefreshTokenError}
    >
      <ThemeProvider theme={themeLight}>
        <AuthProvider onSuccess={auth.onAuthSuccess} onError={auth.onAuthError}>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </ClientProvider>
  );
};

export default RocketsProvider;
