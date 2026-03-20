import { ArcComponent } from '../../arc/component.js';
import { store } from '../../arc/store.js';
import { router } from '../../arc/router.js';

export class LoginPage extends ArcComponent {
  setup() {
    this.state = { error: '', loading: false };
  }

  events() {
    return {
      'submit .login-form': async (e) => {
        e.preventDefault();
        this.setState({ error: '', loading: true });

        const email = this.$('#login-email').value.trim();
        const password = this.$('#login-password').value;

        if (!email || !password) {
          this.setState({ error: 'Please enter email and password', loading: false });
          return;
        }

        try {
          const res = await fetch('/api/admin/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            this.setState({ error: data.error || 'Login failed', loading: false });
            return;
          }

          store.set('auth.user', data.data);
          store.persist(['auth']);
          router.navigate('/dashboard');
        } catch {
          this.setState({ error: 'Connection error. Please try again.', loading: false });
        }
      },
    };
  }

  render() {
    return `
      <div class="login-page">
        <div class="login-card">
          <img src="/assets/images/logos/lawmwad-logo-main.png" alt="Lawmwad Lab" class="login-card__logo">
          <h1>Admin Dashboard</h1>
          <p class="login-card__subtitle">Sign in to Lawmwad Engineering Lab</p>
          ${this.state.error ? `<div class="login-error">${this.esc(this.state.error)}</div>` : ''}
          <form class="login-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" class="form-control" placeholder="you@example.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" class="form-control" placeholder="Your password" required autocomplete="current-password">
            </div>
            <button type="submit" class="btn btn--primary btn--lg" ${this.state.loading ? 'disabled' : ''}>
              ${this.state.loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    `;
  }
}
