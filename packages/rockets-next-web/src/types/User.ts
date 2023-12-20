export interface User {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  dateDeleted: string | null;
  version: number;
  email: string;
  username: string;
  active: boolean;
}

export type ActionType = "creation" | "edit" | "details" | "delete" | null;
