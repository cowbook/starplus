
// stores/form.js (Pinia)
import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
  state: () => ({
    step1Data: {},
    step2Data: {},
  }),
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'form-temp-data',
        storage: localStorage, // 使用localStorage持久化
        paths: ['step1Data', 'step2Data'],
      },
    ],
  },
});