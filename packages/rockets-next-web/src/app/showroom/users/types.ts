export interface FormData {
  id?: string;
  email: string;
  username: string;
}

export type ActionType = "creation" | "edit" | "details" | "delete" | null;
