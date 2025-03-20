import { ref } from "vue";
import { useAccountStore } from "@/entities/account";
import type { IAccount } from "@/entities/account";
import type { AccountFieldErrors } from "..";

export function useAccountManagement() {
  const accountStore = useAccountStore();
  const fieldErrors = ref<Record<number, AccountFieldErrors>>({});

  // Вспомогательная функция для сохранения состояния в localStorage
  function persistAccounts() {
    localStorage.setItem("accounts", JSON.stringify(accountStore.accounts));
  }

  function validateAccount(account: IAccount): AccountFieldErrors | null {
    const errors: AccountFieldErrors = {};

    if (!account.login || account.login.trim() === "") {
      errors.login = "Логин не может быть пустым";
    }
    if (account.type === "Локальная") {
      if (!account.password || account.password.trim() === "") {
        errors.password = "Пароль не может быть пустым";
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  function addAccount(account: IAccount): boolean {
    let hasErrors = false;

    accountStore.accounts.forEach((item) => {
      const errorsForItem = validateAccount(item);
      if (errorsForItem) {
        fieldErrors.value[item.id] = errorsForItem;
        hasErrors = true;
      } else {
        delete fieldErrors.value[item.id];
      }
    });

    if (hasErrors) {
      alert(
        "Нельзя добавить новый аккаунт, пока в существующих аккаунтах имеются ошибки валидации",
      );
      return false;
    }

    accountStore.addAccount(account);
    persistAccounts();
    return true;
  }

  function updateAccount(
    update: Partial<IAccount> & Pick<IAccount, "login">,
  ): boolean {
    const existingAccount = accountStore.accounts.find(
      (account) => account.login === update.login,
    );
    if (!existingAccount) {
      return false;
    }

    const newAccount: IAccount = { ...existingAccount, ...update };
    const errorsForAccount = validateAccount(newAccount);
    if (errorsForAccount) {
      fieldErrors.value[newAccount.id] = errorsForAccount;
      return false;
    } else {
      delete fieldErrors.value[newAccount.id];
    }
    accountStore.updateAccount(newAccount);
    persistAccounts();
    return true;
  }

  function deleteAccount(login: IAccount["login"]): boolean {
    const existingAccount = accountStore.accounts.find(
      (account) => account.login === login,
    );
    if (!existingAccount) {
      return false;
    }
    delete fieldErrors.value[existingAccount.id];
    accountStore.deleteAccount(login);
    persistAccounts();
    return true;
  }

  return {
    fieldErrors,
    addAccount,
    updateAccount,
    deleteAccount,
  };
}
