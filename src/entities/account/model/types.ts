type AuthType = "Локальная" | "LDAP";
type Label = {
  text: string;
};

export interface IAccount {
  login: string;
  type: AuthType;
  password?: string | null;
  label?: Label[];
}
