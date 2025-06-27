// ProductForm
export const FORM_MODE = {
  ADD: "add",
  EDIT: "edit",
  VIEW: "view",
};
export type FormModeType = (typeof FORM_MODE)[keyof typeof FORM_MODE];

// Users
export const USER_STATUS = {
  ACTIVE: "active",
  BLOCKED: "block",
  DELETED: "deleted",
};
export type UserStatusType = (typeof USER_STATUS)[keyof typeof USER_STATUS];
