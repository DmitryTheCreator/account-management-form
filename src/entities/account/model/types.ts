export type AuthType = "Локальная" | "LDAP";
type Label = {
  text: string;
};

export interface IAccount {
  id: number;
  login: string;
  type: AuthType;
  password?: string | null;
  label?: Label[] | string;
}
