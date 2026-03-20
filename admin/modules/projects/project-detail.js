import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { escape } from '../../arc/security.js';

export class ProjectDetailPage extends ArcComponent {
  setup() {
    this.state = { project: null, loading: true };
  }

  async onMount() {
    const { id } = this.props.params;
    try {
      const { data } = await http.get(`projects/${id}`);
      this.setState({ project: data, loading: false });
    } catch {
      toast.error('Failed to load project');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .back-btn': () => router.navigate('/projects'),
      'click .member-link': (e, el) => {
        e.preventDefault();
        router.navigate(`/team/${el.dataset.id}`);
      },
    };
  }

  _budgetPercent(p) {
    if (!p.budget_allocated || p.budget_allocated === 0) return 0;
    return Math.min(100, Math.round((p.budget_spent / p.budget_allocated) * 100));
  }

  _budgetClass(pct) {
    if (pct > 90) return 'danger';
    if (pct > 70) return 'warning';
    return 'safe';
  }

  render() {
    const { project: p, loading } = this.state;
    if (loading) return '<div class="loading-spinner"></div>';
    if (!p) return '<div class="empty-state"><h3>Project not found</h3></div>';

    const pct = this._budgetPercent(p);

    return `
      <div class="detail-header">
        <div class="detail-header__info">
          <button class="btn btn--secondary btn--sm back-btn" style="margin-bottom:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <h1>${this.esc(p.name)}</h1>
          <div class="detail-header__meta">
            <span class="badge badge--${this.esc(p.division)}">${this.esc(p.division)}</span>
            <span class="badge badge--${this.esc(p.status)}">${this.esc(p.status)}</span>
            <span class="badge badge--${this.esc(p.priority)}">${this.esc(p.priority)}</span>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:2fr 1fr; gap:24px;">
        <div>
          ${p.description ? `
            <div class="detail-section">
              <h3 class="detail-section__title">Description</h3>
              <p style="color:var(--color-text-secondary); font-size:0.9rem; line-height:1.7;">${this.esc(p.description)}</p>
            </div>
          ` : ''}

          <div class="detail-section">
            <h3 class="detail-section__title">Details</h3>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-field__label">Lead</div>
                <div class="detail-field__value">${this.esc(p.lead_name || '—')}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Start Date</div>
                <div class="detail-field__value">${p.start_date ? new Date(p.start_date).toLocaleDateString() : '—'}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Target End</div>
                <div class="detail-field__value">${p.target_end_date ? new Date(p.target_end_date).toLocaleDateString() : '—'}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Repository</div>
                <div class="detail-field__value">${p.repository_url ? `<a href="${this.esc(p.repository_url)}" target="_blank" rel="noopener">${this.esc(p.repository_url)}</a>` : '—'}</div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3 class="detail-section__title">Budget</h3>
            <div style="display:flex; justify-content:space-between; font-size:0.875rem; margin-bottom:4px;">
              <span>$${Number(p.budget_spent||0).toLocaleString()} spent</span>
              <span>$${Number(p.budget_allocated||0).toLocaleString()} allocated</span>
            </div>
            <div class="budget-bar" style="height:12px;">
              <div class="budget-bar__fill budget-bar__fill--${this._budgetClass(pct)}" style="width:${pct}%"></div>
            </div>
            <div style="text-align:right; font-size:0.75rem; color:var(--color-text-muted); margin-top:4px;">${pct}% used</div>
          </div>

          <div class="detail-section">
            <h3 class="detail-section__title">Milestones</h3>
            ${!p.milestones?.length ? '<p style="color:var(--color-text-muted); font-size:0.85rem;">No milestones yet.</p>' : `
              <div class="milestone-list">
                ${p.milestones.map(ms => `
                  <div class="milestone-item">
                    <div class="milestone-item__dot milestone-item__dot--${this.esc(ms.status)}"></div>
                    <div>
                      <div class="milestone-item__title">${this.esc(ms.title)}</div>
                      <div class="milestone-item__date">
                        ${ms.due_date ? `Due: ${new Date(ms.due_date).toLocaleDateString()}` : ''}
                        ${ms.completed_at ? ` | Completed: ${new Date(ms.completed_at).toLocaleDateString()}` : ''}
                      </div>
                      ${ms.description ? `<div style="font-size:0.8rem; color:var(--color-text-secondary); margin-top:4px;">${this.esc(ms.description)}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <div>
          <div class="detail-section">
            <h3 class="detail-section__title">Team Members</h3>
            ${!p.members?.length ? '<p style="color:var(--color-text-muted); font-size:0.85rem;">No members assigned.</p>' : `
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${p.members.map(m => `
                  <a href="#" class="card card--clickable member-link" data-id="${this.esc(m.id)}" style="padding:12px;">
                    <div style="font-weight:500; font-size:0.875rem;">${this.esc(m.name)}</div>
                    <div style="font-size:0.75rem; color:var(--color-text-muted);">${this.esc(m.assignment_role || m.role)}</div>
                    <span class="badge badge--${this.esc(m.division)}" style="margin-top:4px;">${this.esc(m.division)}</span>
                  </a>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }
}
