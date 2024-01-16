export const signInModuleProps = {
  signInRequestPath: "/auth/login",
  forgotPasswordPath: "/forgot-password",
  signUpPath: "/sign-up",
  queryMethod: "",
  queryUri: "",
};

export const signUpModuleProps = {
  signInPath: "/sign-in",
  queryMethod: "post",
  queryUri: "/user",
};

export const forgotPasswordModuleProps = {
  signInPath: "/sign-in",
  queryMethod: "post",
  queryUri: "/auth/recovery/password",
};

export const resetPasswordModuleProps = {
  signInPath: "/sign-in",
  queryMethod: "patch",
  queryUri: "/auth/recovery/password",
};
