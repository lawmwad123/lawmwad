import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { escape } from '../../arc/security.js';

export class DashboardPage extends ArcComponent {
  setup() {
    this.state = { data: null, loading: true };
  }

  async onMount() {
    try {
      const { data } = await http.get('dashboard');
      this.setState({ data, loading: false });
    } catch {
      toast.error('Failed to load dashboard');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .stat-card--clickable': (e, el) => {
        const path = el.dataset.path;
        if (path) router.navigate(path);
      },
      'click .app-row': (e, el) => {
        router.navigate(`/applications/${el.dataset.id}`);
      },
    };
  }

  _timeAgo(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }

  render() {
    const { data: d, loading } = this.state;
    if (loading) return '<div class="loading-spinner"></div>';
    if (!d) return '<div class="empty-state"><h3>Failed to load dashboard</h3></div>';

    const { stats, projectsByStatus, divisionBreakdown, recentApps, recentAudit } = d;

    return `
      <div class="page-header">
        <h1>Dashboard</h1>
        <div class="page-header__actions">
          <span style="font-size:0.8rem; color:var(--color-text-muted);">Welcome to ARC Admin</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-card--clickable" data-path="/team" style="cursor:pointer;">
          <div class="stat-card__icon" style="background:var(--color-primary-glow);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="var(--color-primary)">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">${stats.teamMembers}</div>
            <div class="stat-card__label">Team Members</div>
          </div>
        </div>

        <div class="stat-card stat-card--clickable" data-path="/projects" style="cursor:pointer;">
          <div class="stat-card__icon" style="background:var(--color-success-glow);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="var(--color-success)">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">${stats.activeProjects}</div>
            <div class="stat-card__label">Active Projects</div>
          </div>
        </div>

        <div class="stat-card stat-card--clickable" data-path="/applications" style="cursor:pointer;">
          <div class="stat-card__icon" style="background:var(--color-warning-glow);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="var(--color-warning)">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">${stats.pendingApps}</div>
            <div class="stat-card__label">Pending Applications</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card__icon" style="background:var(--color-accent-glow);">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="var(--color-accent)">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">${stats.availableEquipment}</div>
            <div class="stat-card__label">Available Equipment</div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Recent Applications -->
        <div class="card" style="padding:0; overflow:hidden;">
          <div style="padding:16px 20px; border-bottom:1px solid var(--color-border);">
            <h3 style="font-family:var(--font-heading); font-size:0.95rem; font-weight:600;">Recent Applications</h3>
          </div>
          ${!recentApps?.length ? `
            <div style="padding:24px; text-align:center; color:var(--color-text-muted); font-size:0.85rem;">No applications yet</div>
          ` : `
            <table class="data-table">
              <tbody>
                ${recentApps.map(a => `
                  <tr class="app-row clickable" data-id="${escape(a.id)}">
                    <td style="font-weight:500; color:var(--color-text);">${escape(a.name)}</td>
                    <td><span class="badge badge--${escape(a.lab)}">${escape(a.lab)}</span></td>
                    <td><span class="badge badge--${escape(a.status)}">${escape(a.status)}</span></td>
                    <td style="color:var(--color-text-muted); font-size:0.8rem;">${this._timeAgo(a.created_at)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

        <!-- Recent Activity -->
        <div class="card" style="padding:0; overflow:hidden;">
          <div style="padding:16px 20px; border-bottom:1px solid var(--color-border);">
            <h3 style="font-family:var(--font-heading); font-size:0.95rem; font-weight:600;">Recent Activity</h3>
          </div>
          ${!recentAudit?.length ? `
            <div style="padding:24px; text-align:center; color:var(--color-text-muted); font-size:0.85rem;">No activity yet</div>
          ` : `
            <div style="padding:12px 20px; display:flex; flex-direction:column; gap:12px;">
              ${recentAudit.map(a => `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem;">
                  <div>
                    <span style="color:var(--color-text);">${escape(a.email || 'System')}</span>
                    <span style="color:var(--color-text-muted);"> ${escape(a.action)} ${escape(a.entity_type)}</span>
                  </div>
                  <span style="color:var(--color-text-muted); font-size:0.75rem; white-space:nowrap;">${this._timeAgo(a.created_at)}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>

      ${divisionBreakdown?.length ? `
        <div style="margin-top:24px;">
          <div class="card" style="padding:20px;">
            <h3 style="font-family:var(--font-heading); font-size:0.95rem; font-weight:600; margin-bottom:16px;">Team by Division</h3>
            <div style="display:flex; gap:24px; flex-wrap:wrap;">
              ${divisionBreakdown.map(d => `
                <div style="flex:1; min-width:120px; text-align:center;">
                  <div style="font-size:1.5rem; font-weight:600; font-family:var(--font-heading);">${d.count}</div>
                  <span class="badge badge--${escape(d.division)}">${escape(d.division)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}
