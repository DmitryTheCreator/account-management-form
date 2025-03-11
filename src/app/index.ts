import { createApp } from "vue";
import App from "./App.vue";
import { store } from "./providers";

export const app = createApp(App).use(store);
