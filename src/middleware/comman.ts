import { checkAccessKey } from "./access-key";
import { authenticate } from "./auth";
const middlewares = [checkAccessKey];

export const withoutAuth = () => {
  return [...middlewares];
};

export const withAuth = () => {
  return [...middlewares, authenticate];
};
