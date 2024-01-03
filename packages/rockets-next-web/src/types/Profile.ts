export interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
