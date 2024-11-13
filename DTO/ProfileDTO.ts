export type ProfileDTO = {
  email: string;
  firstName: string;
  lastName: string;
};

export type UpdateProfileDTO = Omit<ProfileDTO, "email">;

export type ChangePasswordDTO = {
  oldPassword: string;
  newPassword: string;
};
