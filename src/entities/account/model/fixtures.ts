import type { IAccount } from "./types";

export const mockAccounts: IAccount[] = [
  {
    login: "harry_potter",
    type: "LDAP",
    password: null,
    label: [{ text: "Wizard" }],
  },
  {
    login: "voldemort",
    type: "Локальная",
    password: "avadakedavra",
    label: [{ text: "Wizard" }, { text: "Bald" }],
  },
];
