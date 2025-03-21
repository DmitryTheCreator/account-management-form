<template>
  <form class="account-form">
    <div class="header">
      <h1>Учетные записи</h1>
      <BaseButton
        aria-label="Добавить аккаунт"
        title="Добавить аккаунт"
        class="add-button"
        @click="onAddAccount"
      >
        <UserPlus :size="18" />
      </BaseButton>
    </div>

    <div class="hint">
      <CircleHelp class="icon" /> Для указания нескольких меток для одной пары
      логин/пароль используйте разделитель <b>;</b>
    </div>

    <div class="account-list">
      <div class="account-list__header" v-for="header in headers" :key="header">
        {{ header.split("*")[0]
        }}<span v-if="header.includes('*')" class="error">*</span>
      </div>

      <div
        class="account-list__row"
        v-for="(account, index) in accountStore.accounts"
        :key="account.id"
      >
        <BaseInput
          v-model="labelStrings[index]"
          placeholder="Метки"
          maxlength="50"
          @blur="
            updateAccount({ login: account.login, label: labelStrings[index] })
          "
        />
        <BaseSelect
          v-model="account.type"
          :options="typeOptions"
          @change="updateAccount(account)"
        />

        <div
          :class="['auth-fields', { 'full-width': account.type === 'LDAP' }]"
        >
          <div>
            <BaseInput
              v-model="account.login"
              placeholder="Логин"
              maxlength="100"
              class="wide-input"
              @blur="updateAccount(account)"
            />
            <div class="error caption" v-if="fieldErrors[account.id]?.login">
              {{ fieldErrors[account.id].login }}
            </div>
          </div>

          <div v-if="account.type !== 'LDAP'">
            <PasswordInput
              v-model="account.password"
              placeholder="Пароль"
              @blur="updateAccount(account)"
            />
            <div class="error caption" v-if="fieldErrors[account.id]?.password">
              {{ fieldErrors[account.id].password }}
            </div>
          </div>
        </div>

        <BaseButton
          variant="danger"
          aria-label="Удалить аккаунт"
          title="Удалить аккаунт"
          @click="deleteAccount(account.login)"
        >
          <Trash2 :size="18" />
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { BaseInput, PasswordInput } from "@/shared/ui/input";
import { BaseSelect } from "@/shared/ui/select";
import { BaseButton } from "@/shared/ui/button";

import { CircleHelp, UserPlus, Trash2 } from "lucide-vue-next";
import { AuthType, useAccountStore } from "@/entities/account";
import { onMounted, ref, watch } from "vue";
import { useAccountManagement } from "../model";

// const store = useAccountStore();
const accountStore = useAccountStore();
const { fieldErrors, addAccount, updateAccount, deleteAccount } =
  useAccountManagement();

const labelStrings = ref<string[]>([]);

const headers = ["Метки", "Тип записи", "Логин*", "Пароль*", ""];
const typeOptions: AuthType[] = ["Локальная", "LDAP"];

function onAddAccount() {
  addAccount({
    id: Date.now(),
    login: "",
    type: typeOptions[0],
    password: "",
    label: [],
  });
}

onMounted(() => {
  const storedAccounts = localStorage.getItem("accounts");
  if (storedAccounts) {
    accountStore.accounts = JSON.parse(storedAccounts);
  } else {
    localStorage.setItem("accounts", JSON.stringify(accountStore.accounts));
  }
});

watch(
  () => accountStore.accounts,
  (newAccounts) => {
    labelStrings.value = newAccounts.map((account) => {
      return account.label && Array.isArray(account.label)
        ? account.label.map((lbl) => lbl.text).join("; ")
        : "";
    });
  },
  { immediate: true },
);
</script>

<style lang="scss">
@use "styles";
</style>
