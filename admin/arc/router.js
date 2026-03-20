// ARC Framework — Hash-based SPA Router
// Supports :param extraction, beforeEach guards, and lazy loading

class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.currentComponent = null;
    this.outlet = null;
    this._guards = [];

    window.addEventListener('hashchange', () => this._onHashChange());
  }

  setOutlet(el) {
    this.outlet = typeof el === 'string' ? document.querySelector(el) : el;
  }

  // Register a route: path, component class, options
  add(path, componentClass, options = {}) {
    this.routes.push({ path, componentClass, ...options });
    return this;
  }

  // Register a guard function: fn(to, from) => true | '/redirect'
  beforeEach(fn) {
    this._guards.push(fn);
    return this;
  }

  // Navigate to a path
  navigate(path) {
    window.location.hash = `#${path}`;
  }

  // Start the router (process current hash)
  start() {
    this._onHashChange();
  }

  // Get current params
  getParams() {
    return this.currentRoute?.params || {};
  }

  // Match a hash to a route
  _match(hash) {
    const path = hash.replace(/^#\/?/, '/') || '/';

    for (const route of this.routes) {
      const params = this._extractParams(route.path, path);
      if (params !== null) {
        return { route, params };
      }
    }
    return null;
  }

  _extractParams(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  async _onHashChange() {
    const hash = window.location.hash;
    const matched = this._match(hash);

    if (!matched) {
      this.navigate('/dashboard');
      return;
    }

    const { route, params } = matched;
    const from = this.currentRoute;
    const to = { path: route.path, params, meta: route.meta || {} };

    // Run guards
    for (const guard of this._guards) {
      const result = await guard(to, from);
      if (result !== true) {
        if (typeof result === 'string') {
          this.navigate(result);
        }
        return;
      }
    }

    // Destroy current component
    if (this.currentComponent) {
      this.currentComponent.destroy();
      this.currentComponent = null;
    }

    // Set title
    if (route.title) {
      document.title = `${route.title} | Lawmwad Admin`;
    }

    // Mount new component
    this.currentRoute = to;
    const component = new route.componentClass(this.outlet, { params });
    this.currentComponent = component;
    component.mount();
  }
}

export const router = new Router();
