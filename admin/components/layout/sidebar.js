import { ArcComponent } from '../../arc/component.js';
import { router } from '../../arc/router.js';
import { store } from '../../arc/store.js';

export class Sidebar extends ArcComponent {
  setup() {
    this.state = { activePath: window.location.hash.replace('#', '') || '/dashboard' };
    window.addEventListener('hashchange', () => {
      this.setState({ activePath: window.location.hash.replace('#', '') });
    });
  }

  events() {
    return {
      'click .sidebar__link': (e, el) => {
        e.preventDefault();
        const path = el.dataset.path;
        if (path) router.navigate(path);
      },
    };
  }

  _isActive(path) {
    const current = this.state.activePath;
    if (path === '/dashboard') return current === '/dashboard' || current === '/';
    return current.startsWith(path);
  }

  render() {
    const nav = [
      { section: 'Overview', items: [
        { path: '/dashboard', icon: 'grid', label: 'Dashboard' },
      ]},
      { section: 'People', items: [
        { path: '/team', icon: 'users', label: 'Team' },
        { path: '/applications', icon: 'inbox', label: 'Applications' },
      ]},
      { section: 'Work', items: [
        { path: '/projects', icon: 'folder', label: 'Projects' },
      ]},
    ];

    const icons = {
      grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
      users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
      folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    };

    return `
      <div class="sidebar__brand">
        <img src="/assets/images/logos/lawmwad-logo-main.png" alt="Lawmwad Lab">
        <span class="sidebar__brand-text"><span>ARC</span> Admin</span>
      </div>
      <nav class="sidebar__nav">
        ${nav.map(section => `
          <div class="sidebar__section">
            <div class="sidebar__section-label">${section.section}</div>
            ${section.items.map(item => `
              <a href="#${item.path}" class="sidebar__link ${this._isActive(item.path) ? 'active' : ''}" data-path="${item.path}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${icons[item.icon] || ''}</svg>
                ${item.label}
              </a>
            `).join('')}
          </div>
        `).join('')}
      </nav>
    `;
  }
}
