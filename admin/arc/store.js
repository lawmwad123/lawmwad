// ARC Framework — Centralized State Store
// Dot-path get/set with pub/sub and sessionStorage persistence

class Store {
  constructor() {
    this._state = {};
    this._listeners = new Map();
  }

  get(path) {
    if (!path) return this._state;
    return path.split('.').reduce((obj, key) => obj?.[key], this._state);
  }

  set(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    let obj = this._state;

    for (const key of keys) {
      if (obj[key] == null || typeof obj[key] !== 'object') {
        obj[key] = {};
      }
      obj = obj[key];
    }

    obj[last] = value;
    this._notify(path);
  }

  subscribe(path, fn) {
    if (!this._listeners.has(path)) {
      this._listeners.set(path, new Set());
    }
    this._listeners.get(path).add(fn);

    return () => {
      this._listeners.get(path)?.delete(fn);
    };
  }

  _notify(changedPath) {
    for (const [path, listeners] of this._listeners) {
      if (changedPath.startsWith(path) || path.startsWith(changedPath)) {
        const value = this.get(path);
        for (const fn of listeners) {
          fn(value);
        }
      }
    }
  }

  persist(keys) {
    for (const key of keys) {
      const val = this.get(key);
      if (val !== undefined) {
        try {
          sessionStorage.setItem(`arc_${key}`, JSON.stringify(val));
        } catch (_) { /* storage full or unavailable */ }
      }
    }
  }

  hydrate(keys) {
    for (const key of keys) {
      try {
        const raw = sessionStorage.getItem(`arc_${key}`);
        if (raw != null) {
          this.set(key, JSON.parse(raw));
        }
      } catch (_) { /* parse error */ }
    }
  }

  clear() {
    this._state = {};
    sessionStorage.clear();
  }
}

export const store = new Store();
