export interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface PasswordChangeFormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
