
// stores/form.js (Pinia)
import { defineStore } from 'pinia';

const FORM_COOKIE_KEY = 'form-temp-data';
const FORM_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function readCookie(name) {
  if (typeof document === 'undefined') {
    return '';
  }

  const cookieItem = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  if (!cookieItem) {
    return '';
  }

  return decodeURIComponent(cookieItem.slice(name.length + 1));
}

function writeCookie(name, value, maxAgeSeconds) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
}

function clearCookie(name) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function parseFormData(raw) {
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse saved form cookie:', error);
    return {};
  }
}

export const useFormStore = defineStore('form', {
  state: () => ({
    formData: {}
  }),
  actions: {
    hydrateFromCookie() {
      this.formData = parseFormData(readCookie(FORM_COOKIE_KEY));
    },
    persistToCookie() {
      writeCookie(FORM_COOKIE_KEY, JSON.stringify(this.formData || {}), FORM_COOKIE_MAX_AGE_SECONDS);
    },
    clearFormData() {
      this.formData = {};
      clearCookie(FORM_COOKIE_KEY);
    }
  },
});