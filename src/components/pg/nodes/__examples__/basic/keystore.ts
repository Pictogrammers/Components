export class KeyStore {
  map;

  constructor() {
    this.map = new Map();
  }

  // Generates a random 32-bit unsigned integer
  #generateKey() {
    return Math.floor(Math.random() * 0x100000000); // 0 to 2^32 - 1
  }

  // Adds a value, returns the key used
  add(value) {
    let key = this.#generateKey();
    while (this.map.has(key)) {
      key = this.#generateKey();
    }
    this.map.set(key, value);
    return key;
  }

  set(key, value) {
    this.map.set(key, value);
  }

  get(key) {
    return this.map.get(key);
  }

  delete(key) {
    return this.map.delete(key);
  }

  has(key) {
    return this.map.has(key);
  }
}
