import { ref } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { mockAccounts } from "./fixtures";
import type { IAccount } from "./types";

interface IAccountStore {
  accounts: Ref<IAccount[]>;
  addAccount: (account: IAccount) => void;
  updateAccount: (update: Partial<IAccount> & Pick<IAccount, "login">) => void;
  deleteAccount: (login: IAccount["login"]) => void;
}

function normalizeLabels(label: IAccount["label"] | string) {
  if (typeof label === "string") {
    return label
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((text) => ({ text }));
  }

  return label;
}

function normalizeAccount(account: IAccount) {
  if (account.label && typeof account.label === "string") {
    account.label = normalizeLabels(account.label);
  }
  return account;
}

export const useAccountStore = defineStore("account", (): IAccountStore => {
  const accounts = ref<IAccount[]>([...mockAccounts.map(normalizeAccount)]);

  function addAccount(account: IAccount) {
    account = normalizeAccount(account);
    const accountIndex = accounts.value.findIndex(
      (existedAccount) => existedAccount.login === account.login,
    );

    if (accountIndex > -1) {
      accounts.value[accountIndex] = account;
    } else {
      accounts.value.push(account);
    }
  }

  function updateAccount(update: Partial<IAccount> & Pick<IAccount, "login">) {
    const accountIndex = accounts.value.findIndex(
      (existedAccount) => existedAccount.login === update.login,
    );

    if (accountIndex > -1) {
      if (update.label) {
        update.label = typeof update.label === "string" ? normalizeLabels(update.label) : update.label;
      }

      accounts.value[accountIndex] = {
        ...accounts.value[accountIndex],
        ...update,
      };
    }
  }

  function deleteAccount(login: IAccount["login"]) {
    const accountIndex = accounts.value.findIndex(
      (existedAccount) => existedAccount.login === login,
    );

    if (accountIndex > -1) {
      accounts.value.splice(accountIndex, 1);
    }
  }

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
});
