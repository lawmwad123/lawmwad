import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { escape } from '../../arc/security.js';

export class TeamDetailPage extends ArcComponent {
  setup() {
    this.state = { member: null, loading: true };
  }

  async onMount() {
    const { id } = this.props.params;
    try {
      const { data } = await http.get(`team/${id}`);
      this.setState({ member: data, loading: false });
    } catch {
      toast.error('Failed to load member');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .back-btn': () => router.navigate('/team'),
      'click .project-link': (e, el) => {
        e.preventDefault();
        router.navigate(`/projects/${el.dataset.id}`);
      },
    };
  }

  render() {
    const { member, loading } = this.state;
    if (loading) return '<div class="loading-spinner"></div>';
    if (!member) return '<div class="empty-state"><h3>Member not found</h3></div>';

    const m = member;
    return `
      <div class="detail-header">
        <div class="detail-header__info">
          <button class="btn btn--secondary btn--sm back-btn" style="margin-bottom:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <h1>${this.esc(m.name)}</h1>
          <div class="detail-header__meta">
            <span class="badge badge--${this.esc(m.division)}">${this.esc(m.division)}</span>
            <span class="badge badge--${this.esc(m.status)}">${this.esc(m.status?.replace('_', ' '))}</span>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <div>
          <div class="detail-section">
            <h3 class="detail-section__title">Information</h3>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-field__label">Email</div>
                <div class="detail-field__value">${this.esc(m.email)}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Phone</div>
                <div class="detail-field__value">${this.esc(m.phone || '—')}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Role</div>
                <div class="detail-field__value">${this.esc(m.role)}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Title</div>
                <div class="detail-field__value">${this.esc(m.title || '—')}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Join Date</div>
                <div class="detail-field__value">${m.join_date ? new Date(m.join_date).toLocaleDateString() : '—'}</div>
              </div>
            </div>
          </div>

          ${m.bio ? `
            <div class="detail-section">
              <h3 class="detail-section__title">Bio</h3>
              <p style="color:var(--color-text-secondary); font-size:0.9rem; line-height:1.7;">${this.esc(m.bio)}</p>
            </div>
          ` : ''}

          ${m.skills?.length ? `
            <div class="detail-section">
              <h3 class="detail-section__title">Skills</h3>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${m.skills.map(s => `<span class="badge" style="background:var(--color-surface-3); color:var(--color-text-secondary);">${this.esc(s)}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div>
          <div class="detail-section">
            <h3 class="detail-section__title">Project Assignments</h3>
            ${!m.projects?.length ? '<p style="color:var(--color-text-muted); font-size:0.85rem;">No project assignments.</p>' : `
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${m.projects.map(p => `
                  <a href="#" class="card card--clickable project-link" data-id="${this.esc(p.id)}" style="padding:12px;">
                    <div style="font-weight:500; font-size:0.875rem; margin-bottom:4px;">${this.esc(p.name)}</div>
                    <div style="display:flex; gap:6px;">
                      <span class="badge badge--${this.esc(p.division)}">${this.esc(p.division)}</span>
                      <span class="badge badge--${this.esc(p.status)}">${this.esc(p.status)}</span>
                    </div>
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
