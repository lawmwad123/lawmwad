// ARC Framework — Component Base Class
// Template-literal rendering with delegated events and lifecycle hooks

import { escape } from './security.js';

export class ArcComponent {
  constructor(container, props = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    this.props = props;
    this.state = {};
    this._mounted = false;
    this._eventCleanups = [];
  }

  // Override in subclass to set initial state
  setup() {}

  // Override: return HTML string
  render() {
    return '';
  }

  // Override: return { 'click .selector': handler }
  events() {
    return {};
  }

  // Lifecycle hooks — override in subclass
  onMount() {}
  onUpdate(prevState) {}
  onDestroy() {}

  // Query within component root
  $(selector) {
    return this.container.querySelector(selector);
  }

  $$(selector) {
    return this.container.querySelectorAll(selector);
  }

  setState(partial) {
    const prev = { ...this.state };
    Object.assign(this.state, partial);
    this.onUpdate(prev);
    this._render();
  }

  // Initialize and mount
  mount() {
    this.setup();
    this._render();
    this._mounted = true;
    this.onMount();
    return this;
  }

  // Internal render + event binding
  _render() {
    this._detachEvents();
    this.container.innerHTML = this.render();
    this._attachEvents();
  }

  _attachEvents() {
    const eventMap = this.events();
    for (const [key, handler] of Object.entries(eventMap)) {
      const spaceIdx = key.indexOf(' ');
      const eventType = spaceIdx > -1 ? key.slice(0, spaceIdx) : key;
      const selector = spaceIdx > -1 ? key.slice(spaceIdx + 1) : null;

      const listener = (e) => {
        if (selector) {
          const target = e.target.closest(selector);
          if (target && this.container.contains(target)) {
            handler.call(this, e, target);
          }
        } else {
          handler.call(this, e);
        }
      };

      this.container.addEventListener(eventType, listener, true);
      this._eventCleanups.push(() =>
        this.container.removeEventListener(eventType, listener, true)
      );
    }
  }

  _detachEvents() {
    for (const cleanup of this._eventCleanups) cleanup();
    this._eventCleanups = [];
  }

  destroy() {
    this.onDestroy();
    this._detachEvents();
    this.container.innerHTML = '';
    this._mounted = false;
  }

  // Utility: escape HTML for safe rendering
  esc(val) {
    return escape(val);
  }
}
