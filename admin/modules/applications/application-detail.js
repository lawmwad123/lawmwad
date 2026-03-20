import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { escape } from '../../arc/security.js';

const STATUSES = ['new', 'screening', 'interview', 'trial', 'accepted', 'rejected', 'withdrawn'];

export class ApplicationDetailPage extends ArcComponent {
  setup() {
    this.state = { app: null, loading: true };
  }

  async onMount() {
    const { id } = this.props.params;
    try {
      const { data } = await http.get(`applications/${id}`);
      this.setState({ app: data, loading: false });
    } catch {
      toast.error('Failed to load application');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .back-btn': () => router.navigate('/applications'),
      'change .status-select': async (e) => {
        const newStatus = e.target.value;
        try {
          await http.put(`applications/${this.state.app.id}`, { status: newStatus });
          this.setState({ app: { ...this.state.app, status: newStatus } });
          toast.success(`Status updated to ${newStatus}`);
        } catch {
          toast.error('Failed to update status');
        }
      },
      'click .rate-star': async (e, el) => {
        const rating = parseInt(el.dataset.rating);
        try {
          await http.put(`applications/${this.state.app.id}`, { rating });
          this.setState({ app: { ...this.state.app, rating } });
          toast.success('Rating updated');
        } catch {
          toast.error('Failed to update rating');
        }
      },
    };
  }

  render() {
    const { app: a, loading } = this.state;
    if (loading) return '<div class="loading-spinner"></div>';
    if (!a) return '<div class="empty-state"><h3>Application not found</h3></div>';

    return `
      <div class="detail-header">
        <div class="detail-header__info">
          <button class="btn btn--secondary btn--sm back-btn" style="margin-bottom:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <h1>${this.esc(a.name)}</h1>
          <div class="detail-header__meta">
            <span class="badge badge--${this.esc(a.lab)}">${this.esc(a.lab)}</span>
            <span class="badge badge--${this.esc(a.status)}">${this.esc(a.status)}</span>
          </div>
        </div>
        <div>
          <select class="form-control status-select" style="width:auto;">
            ${STATUSES.map(s => `<option value="${s}" ${a.status === s ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:2fr 1fr; gap:24px;">
        <div>
          <div class="detail-section">
            <h3 class="detail-section__title">Applicant Information</h3>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-field__label">Email</div>
                <div class="detail-field__value"><a href="mailto:${this.esc(a.email)}">${this.esc(a.email)}</a></div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Lab Interest</div>
                <div class="detail-field__value">${this.esc(a.lab)}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Experience Level</div>
                <div class="detail-field__value">${this.esc(a.level)}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Applied</div>
                <div class="detail-field__value">${a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Source</div>
                <div class="detail-field__value">${this.esc(a.source || 'website')}</div>
              </div>
            </div>
          </div>

          ${a.about ? `
            <div class="detail-section">
              <h3 class="detail-section__title">About</h3>
              <p style="color:var(--color-text-secondary); font-size:0.9rem; line-height:1.7; white-space:pre-wrap;">${this.esc(a.about)}</p>
            </div>
          ` : ''}

          ${a.stage_notes?.length ? `
            <div class="detail-section">
              <h3 class="detail-section__title">Notes</h3>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${a.stage_notes.map(n => `
                  <div class="card" style="padding:12px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span class="badge badge--${this.esc(n.stage)}">${this.esc(n.stage)}</span>
                      <span style="font-size:0.75rem; color:var(--color-text-muted);">${n.at ? new Date(n.at).toLocaleDateString() : ''}</span>
                    </div>
                    <p style="font-size:0.85rem; color:var(--color-text-secondary);">${this.esc(n.note)}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <div>
          <div class="detail-section">
            <h3 class="detail-section__title">Rating</h3>
            <div style="display:flex; gap:4px; font-size:1.5rem;">
              ${[1,2,3,4,5].map(r => `
                <span class="rate-star" data-rating="${r}" style="cursor:pointer; color:${r <= (a.rating||0) ? 'var(--color-warning)' : 'var(--color-text-muted)'};">
                  ${r <= (a.rating||0) ? '★' : '☆'}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
