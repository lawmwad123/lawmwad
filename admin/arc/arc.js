// ARC Framework — Main Bootstrap
// Initializes store, router, layout, and auth check

import { store } from './store.js';
import { router } from './router.js';

// Layout components
import { Sidebar } from '../components/layout/sidebar.js';
import { Topbar } from '../components/layout/topbar.js';

// Page modules
import { LoginPage } from '../modules/auth/login.js';
import { DashboardPage } from '../modules/dashboard/dashboard.js';
import { TeamListPage } from '../modules/team/team-list.js';
import { TeamDetailPage } from '../modules/team/team-detail.js';
import { ProjectListPage } from '../modules/projects/project-list.js';
import { ProjectDetailPage } from '../modules/projects/project-detail.js';
import { ApplicationListPage } from '../modules/applications/application-list.js';
import { ApplicationDetailPage } from '../modules/applications/application-detail.js';

class ArcApp {
  constructor() {
    this.sidebar = null;
    this.topbar = null;
  }

  async init() {
    // Hydrate persisted state
    store.hydrate(['auth']);

    // Setup router
    router.setOutlet('#outlet');

    // Auth guard
    router.beforeEach((to) => {
      const publicPaths = ['/login'];
      if (publicPaths.includes(to.path)) return true;
      if (!store.get('auth.user')) return '/login';
      return true;
    });

    // Register routes
    router
      .add('/login', LoginPage, { title: 'Login', meta: { public: true } })
      .add('/dashboard', DashboardPage, { title: 'Dashboard' })
      .add('/team', TeamListPage, { title: 'Team' })
      .add('/team/:id', TeamDetailPage, { title: 'Team Member' })
      .add('/projects', ProjectListPage, { title: 'Projects' })
      .add('/projects/:id', ProjectDetailPage, { title: 'Project' })
      .add('/applications', ApplicationListPage, { title: 'Applications' })
      .add('/applications/:id', ApplicationDetailPage, { title: 'Application' });

    // Check auth using raw fetch (bypass http.js 401 interceptor)
    await this._checkAuth();

    // Listen for auth changes to show/hide layout
    store.subscribe('auth.user', (user) => {
      if (user) {
        this._mountLayout();
      } else {
        this._unmountLayout();
      }
    });

    // Start router
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = store.get('auth.user') ? '#/dashboard' : '#/login';
    }
    router.start();
  }

  async _checkAuth() {
    try {
      const res = await fetch('/api/admin/auth?action=me', {
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Not authenticated');
      const { data } = await res.json();
      store.set('auth.user', data);
      store.persist(['auth']);
      this._mountLayout();
    } catch {
      store.set('auth.user', null);
      this._unmountLayout();
    }
  }

  _mountLayout() {
    const sidebarEl = document.getElementById('sidebar');
    const topbarEl = document.getElementById('topbar');

    if (sidebarEl && !this.sidebar) {
      document.body.classList.remove('no-layout');
      this.sidebar = new Sidebar(sidebarEl);
      this.sidebar.mount();
    }
    if (topbarEl && !this.topbar) {
      this.topbar = new Topbar(topbarEl);
      this.topbar.mount();
    }
  }

  _unmountLayout() {
    document.body.classList.add('no-layout');
    if (this.sidebar) {
      this.sidebar.destroy();
      this.sidebar = null;
    }
    if (this.topbar) {
      this.topbar.destroy();
      this.topbar = null;
    }
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  const app = new ArcApp();
  app.init();
});
