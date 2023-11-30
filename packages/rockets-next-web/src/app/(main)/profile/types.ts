export interface UserData {
  id: string;
  username: string;
  email: string;
}

export interface PasswordChangeFormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
