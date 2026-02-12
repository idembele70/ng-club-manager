import { ENV, ENV_CONFIG } from "@config/env.config";

export const FRONT_URLS_REGEX = {
  REGISTER: new RegExp(ENV_CONFIG[ENV].baseURL.front + 'register$'),
  LOGIN: new RegExp(ENV_CONFIG[ENV].baseURL.front + 'login$'),
  DASHBOARD: new RegExp(ENV_CONFIG[ENV].baseURL.front + 'dashboard$'),
  MARKET: new RegExp(ENV_CONFIG[ENV].baseURL.front + 'market$'),
}

export const buildAppFrontUrl = (path: string) => ENV_CONFIG[ENV].baseURL.front + path