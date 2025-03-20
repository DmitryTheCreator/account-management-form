import type { IAccount } from "./types";

export const mockAccounts: IAccount[] = [
  {
    id: 1,
    login: "harry_potter",
    type: "LDAP",
    password: null,
    label: [{ text: "Wizard" }],
  },
  {
    id: 2,
    login: "voldemort",
    type: "Локальная",
    password: "avadakedavra",
    label: [{ text: "Wizard" }, { text: "Bald" }],
  },
];
