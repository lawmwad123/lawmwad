import { ArcComponent } from '../../arc/component.js';
import { store } from '../../arc/store.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';

export class Topbar extends ArcComponent {
  setup() {
    this.state = { dropdownOpen: false };

    // Close dropdown on outside click
    this._outsideClick = (e) => {
      if (this.state.dropdownOpen && !e.target.closest('.topbar__user-wrapper')) {
        this.setState({ dropdownOpen: false });
      }
    };
    document.addEventListener('click', this._outsideClick);
  }

  events() {
    return {
      'click .topbar__user': () => {
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
      },
      'click .topbar__logout': async () => {
        try {
          await http.post('/api/admin/auth/logout', {});
        } catch { /* ignore */ }
        store.clear();
        router.navigate('/login');
      },
      'click .topbar__toggle': () => {
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.toggle('open');
      },
    };
  }

  onDestroy() {
    document.removeEventListener('click', this._outsideClick);
  }

  render() {
    const user = store.get('auth.user') || {};
    const initials = (user.email || '?')[0].toUpperCase();

    return `
      <div class="topbar__left">
        <button class="topbar__toggle btn--icon" aria-label="Toggle sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="topbar__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search..." aria-label="Search">
        </div>
      </div>
      <div class="topbar__right">
        <div class="topbar__user-wrapper" style="position:relative;">
          <div class="topbar__user">
            <div class="topbar__avatar">${this.esc(initials)}</div>
            <span class="topbar__username">${this.esc(user.email || '')}</span>
          </div>
          <div class="topbar__dropdown ${this.state.dropdownOpen ? 'open' : ''}">
            <button class="topbar__dropdown-item topbar__logout topbar__dropdown-item--danger">Log out</button>
          </div>
        </div>
      </div>
    `;
  }
}
