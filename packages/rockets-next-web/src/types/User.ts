export interface User {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  dateDeleted: string | null;
  version: number;
  email: number;
  username: string;
  active: boolean;
}
