import { ArcComponent } from '../../arc/component.js';
import { store } from '../../arc/store.js';
import { router } from '../../arc/router.js';

export class LoginPage extends ArcComponent {
  setup() {
    this.state = { error: '', loading: false };
  }

  events() {
    return {
      'click .login-btn': (e) => {
        e.preventDefault();
        this._handleLogin();
      },
      'keydown #login-password': (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this._handleLogin();
        }
      },
    };
  }

  async _handleLogin() {
    const emailEl = this.$('#login-email');
    const passEl = this.$('#login-password');
    if (!emailEl || !passEl) return;

    const email = emailEl.value.trim();
    const password = passEl.value;

    if (!email || !password) {
      this.setState({ error: 'Please enter email and password' });
      // Restore input values after re-render
      this.$('#login-email').value = email;
      this.$('#login-password').value = password;
      return;
    }

    this.setState({ error: '', loading: true });
    // Restore input values after re-render
    this.$('#login-email').value = email;
    this.$('#login-password').value = password;

    try {
      const res = await fetch('/api/admin/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        this.setState({ error: data.error || 'Login failed', loading: false });
        this.$('#login-email').value = email;
        this.$('#login-password').value = password;
        return;
      }

      store.set('auth.user', data.data);
      store.persist(['auth']);
      router.navigate('/dashboard');
    } catch {
      this.setState({ error: 'Connection error. Please try again.', loading: false });
      this.$('#login-email').value = email;
      this.$('#login-password').value = password;
    }
  }

  render() {
    return `
      <div class="login-page">
        <div class="login-card">
          <img src="/assets/images/logos/lawmwad-logo-main.png" alt="Lawmwad Lab" class="login-card__logo">
          <h1>Admin Dashboard</h1>
          <p class="login-card__subtitle">Sign in to Lawmwad Engineering Lab</p>
          ${this.state.error ? `<div class="login-error">${this.esc(this.state.error)}</div>` : ''}
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" class="form-control" placeholder="you@example.com" autocomplete="email">
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" class="form-control" placeholder="Your password" autocomplete="current-password">
          </div>
          <button type="button" class="btn btn--primary btn--lg login-btn" ${this.state.loading ? 'disabled' : ''}>
            ${this.state.loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    `;
  }
}
