import { uuid } from './uuid';

const ADD = 'pgtoastadd';
const REMOVE = 'pgtoastremove';

export function observeToasts({ add, remove }) {
  document.body.addEventListener(ADD, (e: any) => {
    add(e.detail);
  });
  document.body.addEventListener(REMOVE, (e: any) => {
    remove(e.detail.key);
  });
}

export function addToast(config): string {
  config.key = config.key || uuid();
  const event = new CustomEvent(ADD, {
    detail: config
  });
  document.body.dispatchEvent(event);
  setTimeout(() => {
    removeToast(config.key);
  }, config.seconds * 1000);
  return config.key;
}

export function removeToast(key: string) {
  const event = new CustomEvent(REMOVE, {
    detail: { key }
  });
  document.body.dispatchEvent(event);
}

export function addInfoToast(message: string, seconds = 3): string {
  const type = 'info';
  return addToast({ type, message, seconds });
}

export function addWarningToast(message, seconds = 3) {
  const type = 'warning';
  return addToast({ type, message, seconds });
}

export function addErrorToast(message, seconds = 3) {
  const type = 'error';
  return addToast({ type, message, seconds });
}