import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';

const STAGES = [
  { key: 'new',       label: 'New Request' },
  { key: 'screening', label: 'Reached Out' },
  { key: 'interview', label: 'Demo Scheduled' },
  { key: 'trial',     label: 'Evaluating' },
  { key: 'accepted',  label: 'Won' },
  { key: 'rejected',  label: 'Closed' },
];

export class DemoDetailPage extends ArcComponent {
  setup() {
    this.state = { demo: null, loading: true };
  }

  async onMount() {
    const { id } = this.props.params;
    try {
      const { data } = await http.get(`applications/${id}`);
      this.setState({ demo: data, loading: false });
    } catch {
      toast.error('Failed to load demo request');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .back-btn': () => router.navigate('/arc-ai/demos'),

      'change .stage-select': async (e) => {
        const status = e.target.value;
        try {
          await http.put(`applications/${this.state.demo.id}`, { status });
          this.setState({ demo: { ...this.state.demo, status } });
          toast.success('Status updated');
        } catch {
          toast.error('Failed to update status');
        }
      },

      'click .rate-star': async (e, el) => {
        const rating = parseInt(el.dataset.rating);
        try {
          await http.put(`applications/${this.state.demo.id}`, { rating });
          this.setState({ demo: { ...this.state.demo, rating } });
          toast.success('Priority updated');
        } catch {
          toast.error('Failed to update priority');
        }
      },

      'click .delete-btn': async () => {
        if (!confirm('Delete this demo request? This cannot be undone.')) return;
        try {
          await http.del(`applications/${this.state.demo.id}`);
          toast.success('Demo request deleted');
          router.navigate('/arc-ai/demos');
        } catch {
          toast.error('Failed to delete');
        }
      },
    };
  }

  render() {
    const { demo: d, loading } = this.state;
    if (loading) return '<div class="loading-spinner"></div>';
    if (!d) return '<div class="empty-state"><h3>Demo request not found</h3></div>';

    const currentStageLabel = STAGES.find(s => s.key === d.status)?.label || d.status;

    return `
      <div class="detail-header">
        <div class="detail-header__info">
          <button class="btn btn--secondary btn--sm back-btn" style="margin-bottom:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Demo Requests
          </button>
          <h1 style="display:flex; align-items:center; gap:10px;">
            ${this.esc(d.about || d.name)}
            <span style="font-size:0.7rem; font-weight:500; background:rgba(107,94,248,0.15); color:#8F84FF; border:1px solid rgba(107,94,248,0.25); padding:3px 10px; border-radius:100px; font-family:var(--font-mono);">Arc AI</span>
          </h1>
          <div class="detail-header__meta">
            <span class="badge badge--arc-ai">${this.esc(d.lab)}</span>
            <span class="badge badge--${this.esc(d.status)}">${currentStageLabel}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <select class="form-control stage-select" style="width:auto;">
            ${STAGES.map(s => `
              <option value="${s.key}" ${d.status === s.key ? 'selected' : ''}>${s.label}</option>
            `).join('')}
          </select>
          <button class="btn btn--secondary btn--sm delete-btn" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:2fr 1fr; gap:24px;">
        <div>
          <div class="detail-section">
            <h3 class="detail-section__title">Contact Information</h3>
            <div class="detail-grid">
              <div class="detail-field">
                <div class="detail-field__label">Contact Name</div>
                <div class="detail-field__value">${this.esc(d.name)}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Work Email</div>
                <div class="detail-field__value"><a href="mailto:${this.esc(d.email)}">${this.esc(d.email)}</a></div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Organization</div>
                <div class="detail-field__value">${this.esc(d.about || '—')}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Industry</div>
                <div class="detail-field__value">${this.esc(d.lab)}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Submitted</div>
                <div class="detail-field__value">${d.created_at ? new Date(d.created_at).toLocaleString() : '—'}</div>
              </div>
              <div class="detail-field">
                <div class="detail-field__label">Source</div>
                <div class="detail-field__value">ai.lawmwad.com</div>
              </div>
            </div>
          </div>

          ${d.stage_notes?.length ? `
            <div class="detail-section">
              <h3 class="detail-section__title">Notes</h3>
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${d.stage_notes.map(n => `
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
            <h3 class="detail-section__title">Priority</h3>
            <div style="display:flex; gap:4px; font-size:1.5rem; margin-bottom:8px;">
              ${[1,2,3,4,5].map(r => `
                <span class="rate-star" data-rating="${r}" style="cursor:pointer; color:${r <= (d.rating || 0) ? 'var(--color-warning)' : 'var(--color-text-muted)'};">
                  ${r <= (d.rating || 0) ? '★' : '☆'}
                </span>
              `).join('')}
            </div>
            <p style="font-size:0.78rem; color:var(--color-text-muted);">Rate the opportunity to prioritise outreach</p>
          </div>

          <div class="detail-section">
            <h3 class="detail-section__title">Pipeline</h3>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${STAGES.map(s => `
                <div style="display:flex; align-items:center; gap:10px; font-size:0.82rem; ${d.status === s.key ? 'color:var(--color-text); font-weight:600;' : 'color:var(--color-text-muted);'}">
                  <span style="width:8px; height:8px; border-radius:50%; flex-shrink:0; background:${d.status === s.key ? 'var(--color-primary)' : 'var(--color-border)'}; ${d.status === s.key ? 'box-shadow:0 0 8px var(--color-primary-glow);' : ''}"></span>
                  ${s.label}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
