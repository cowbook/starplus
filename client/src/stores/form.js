
// stores/form.js (Pinia)
import { defineStore } from 'pinia';
const LEGACY_KEY_MAP = {
  blockName: '物业',
  name: '姓名',
  mobile: '手机号',
  unit: '单元',
  company: '公司',
  subdate: '调查日期',
  area: '区域'
};

function normalizeLegacyFormData(source) {
  const normalized = { ...(source || {}) };

  for (const [legacyKey, cnKey] of Object.entries(LEGACY_KEY_MAP)) {
    if (!Object.prototype.hasOwnProperty.call(normalized, legacyKey)) {
      continue;
    }

    const legacyValue = normalized[legacyKey];
    const hasCnValue = Object.prototype.hasOwnProperty.call(normalized, cnKey) && normalized[cnKey] !== '';

    if (!hasCnValue) {
      normalized[cnKey] = legacyValue;
    }

    delete normalized[legacyKey];
  }

  return normalized;
}

export const useFormStore = defineStore('form', {
  state: () => ({
    formData: normalizeLegacyFormData({})
  }),
  actions: {
    normalizeLegacyKeys() {
      this.formData = normalizeLegacyFormData(this.formData);
    }
  },
  persist: {
    key: 'form-temp-data',
    storage: localStorage,
    pick: ['formData'],
    afterHydrate: ({ store }) => {
      store.normalizeLegacyKeys();
    }
  },
});