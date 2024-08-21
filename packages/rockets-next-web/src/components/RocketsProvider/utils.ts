import { RocketsAuthProps, RocketsDataProviderProps } from './types';

type RocketsConfig = {
  /**
   * Configuration for the data provider.
   */
  dataProvider: Partial<RocketsDataProviderProps>;
  /**
   * Configuration for authentication.
   */
  auth: Partial<RocketsAuthProps>;
};

/**
 * Creates a configuration object for Rockets.
 *
 * @param config - The configuration object containing dataProvider and auth configurations.
 * @returns The configuration object.
 *
 * @example
 * ```ts
 * const config = createConfig({
 *   dataProvider: { apiUrl: 'https://api.example.com' },
 *   auth: {
 *     useAuth: myAuthHook,
 *     onAuthSuccess: handleSuccess,
 *     onAuthError: handleError,
 *     onLogout: handleLogout,
 *     handleRefreshTokenError: handleTokenError,
 *   }
 * });
 * ```
 */
const createConfig = (config: RocketsConfig) => config;

export default createConfig;
