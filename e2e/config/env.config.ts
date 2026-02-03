export type TestEnv = 'local' | 'production';
export const ENV = (process.env['TEST_ENV']  as TestEnv) ?? 'local';

const FRONT_BASE_PATHNAME = '/ng-club-manager/#/';

interface BaseUrl {
  baseURL: {
      front: string;
    }
} 
export const ENV_CONFIG: Record<TestEnv, BaseUrl> = {
  local: {
    baseURL: {
      front: `http://localhost:4200${FRONT_BASE_PATHNAME}`,
    },
  },
  production: {
    baseURL: {
      front: `https://idembele70.github.io${FRONT_BASE_PATHNAME}`,
    },
  },
} as const;