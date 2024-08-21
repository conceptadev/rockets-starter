import { ReactNode } from 'react';

export type RocketsAuthProps = {
  /**
   * Callback function to handle authentication logic.
   */
  useAuth: () => void;
  /**
   * Callback function to be called on successful authentication.
   */
  onAuthSuccess: () => void;
  /**
   * Callback function to be called on authentication error.
   */
  onAuthError: (error: unknown) => void;
  /**
   * Callback function to be called on logout.
   */
  onLogout: () => void;
  /**
   * Function to handle token refresh errors.
   */
  handleRefreshTokenError: (error: unknown) => void;
};

export type RocketsDataProviderProps = {
  /**
   * The base URL for the API.
   */
  apiUrl: string;
};

export type RocketsLayoutProps = {
  /**
   * Component to render the AppBar.
   */
  AppBar: ReactNode;
  /**
   * Component to render the layout.
   */
  Layout: ReactNode;
  /**
   * Options for the menu.
   */
  menuOptions: unknown;
};
