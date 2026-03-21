import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { escape } from '../../arc/security.js';

const STAGES = [
  { key: 'all',       label: 'All' },
  { key: 'new',       label: 'New' },
  { key: 'screening', label: 'Reached Out' },
  { key: 'interview', label: 'Demo Scheduled' },
  { key: 'trial',     label: 'Evaluating' },
  { key: 'accepted',  label: 'Won' },
  { key: 'rejected',  label: 'Closed' },
];

const STAGE_LABELS = Object.fromEntries(STAGES.slice(1).map(s => [s.key, s.label]));

export class DemoListPage extends ArcComponent {
  setup() {
    this.state = { demos: [], loading: true, filter: 'all', search: '' };
    this._searchTimer = null;
  }

  async onMount() {
    await this._load();
  }

  async _load() {
    this.setState({ loading: true });
    try {
      const params = new URLSearchParams({ source: 'arc-ai' });
      if (this.state.filter !== 'all') params.set('status', this.state.filter);
      if (this.state.search) params.set('search', this.state.search);

      const { data } = await http.get(`applications?${params}`);
      this.setState({ demos: data, loading: false });
    } catch {
      toast.error('Failed to load demo requests');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .demo-filter-btn': (e, el) => {
        this.setState({ filter: el.dataset.filter });
        this._load();
      },
      'input #demo-search': (e) => {
        clearTimeout(this._searchTimer);
        const search = e.target.value;
        this._searchTimer = setTimeout(() => {
          this.setState({ search });
          this._load();
        }, 300);
      },
      'click .demo-row': (e, el) => {
        router.navigate(`/arc-ai/demos/${el.dataset.id}`);
      },
    };
  }

  _stageLabel(key) {
    return STAGE_LABELS[key] || key;
  }

  _stageBadgeClass(key) {
    const map = {
      new: 'badge--new',
      screening: 'badge--screening',
      interview: 'badge--interview',
      trial: 'badge--trial',
      accepted: 'badge--accepted',
      rejected: 'badge--rejected',
    };
    return map[key] || 'badge--new';
  }

  _timeAgo(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const days = Math.floor((now - d) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    return d.toLocaleDateString();
  }

  render() {
    const { demos, loading, filter } = this.state;

    return `
      <div class="page-header">
        <div>
          <h1 style="display:flex; align-items:center; gap:10px;">
            Demo Requests
            <span style="font-size:0.75rem; font-weight:500; background:rgba(107,94,248,0.15); color:#8F84FF; border:1px solid rgba(107,94,248,0.25); padding:3px 10px; border-radius:100px; font-family:var(--font-mono);">Arc AI</span>
          </h1>
        </div>
        <div class="page-header__actions">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input id="demo-search" type="text" placeholder="Search by name or email…" value="${escape(this.state.search)}">
          </div>
        </div>
      </div>

      <div class="filter-bar" style="margin-bottom:20px;">
        ${STAGES.map(s => `
          <button class="demo-filter-btn filter-btn ${filter === s.key ? 'active' : ''}" data-filter="${s.key}">
            ${escape(s.label)}
          </button>
        `).join('')}
      </div>

      ${loading ? '<div class="loading-spinner"></div>' : `
        ${!demos.length ? `
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <h3>No demo requests yet</h3>
            <p>Requests from ai.lawmwad.com will appear here.</p>
          </div>
        ` : `
          <div class="card" style="padding:0; overflow:hidden;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Contact</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                ${demos.map(d => `
                  <tr class="demo-row clickable" data-id="${escape(d.id)}">
                    <td style="font-weight:500; color:var(--color-text);">${escape(d.about || '—')}</td>
                    <td>
                      <div>${escape(d.name)}</div>
                      <div style="font-size:0.75rem; color:var(--color-text-muted);">${escape(d.email)}</div>
                    </td>
                    <td><span class="badge badge--arc-ai">${escape(d.lab)}</span></td>
                    <td><span class="badge ${this._stageBadgeClass(d.status)}">${this._stageLabel(d.status)}</span></td>
                    <td style="color:var(--color-text-muted); font-size:0.82rem;">${this._timeAgo(d.created_at)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div style="margin-top:12px; font-size:0.8rem; color:var(--color-text-muted);">${demos.length} request${demos.length !== 1 ? 's' : ''}</div>
        `}
      `}
    `;
  }
}
