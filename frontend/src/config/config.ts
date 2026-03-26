export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
export const COOKIE_REF = process.env.NEXT_PUBLIC_COOKIE_REF;
export const AT_SECRECT = process.env.NEXT_PUBLIC_AT_SECRECT;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
export const COOKIE_AUTH = process.env.NEXT_PUBLIC_COOKIE_AUTH;
export const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME;


export const baseURL =
  ENVIRONMENT === "dev"
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;
