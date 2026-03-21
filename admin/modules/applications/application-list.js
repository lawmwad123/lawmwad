import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { escape } from '../../arc/security.js';

const STAGES = [
  { key: 'new', label: 'New' },
  { key: 'screening', label: 'Screening' },
  { key: 'interview', label: 'Interview' },
  { key: 'trial', label: 'Trial' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

export class ApplicationListPage extends ArcComponent {
  setup() {
    this.state = { applications: [], loading: true };
    this._dragId = null;
  }

  async onMount() {
    await this.loadApplications();
  }

  async loadApplications() {
    try {
      const { data } = await http.get('applications');
      this.setState({ applications: data, loading: false });
    } catch {
      toast.error('Failed to load applications');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .kanban__card': (e, el) => {
        router.navigate(`/applications/${el.dataset.id}`);
      },
      'dragstart .kanban__card': (e, el) => {
        this._dragId = el.dataset.id;
        el.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      },
      'dragend .kanban__card': (e, el) => {
        el.classList.remove('dragging');
        this._dragId = null;
      },
      'dragover .kanban__column-body': (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
      },
      'dragleave .kanban__column-body': (e) => {
        e.currentTarget.classList.remove('drag-over');
      },
      'drop .kanban__column-body': async (e, el) => {
        e.preventDefault();
        el.classList.remove('drag-over');
        const newStatus = el.dataset.status;
        const appId = this._dragId;
        if (!appId || !newStatus) return;

        try {
          await http.put(`applications/${appId}`, { status: newStatus });
          toast.success(`Moved to ${newStatus}`);
          await this.loadApplications();
        } catch {
          toast.error('Failed to update status');
        }
      },
    };
  }

  _timeAgo(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const days = Math.floor(diffMs / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    return d.toLocaleDateString();
  }

  render() {
    const { applications, loading } = this.state;
    if (loading) return '<div class="loading-spinner"></div>';

    const byStage = {};
    for (const stage of STAGES) byStage[stage.key] = [];
    for (const app of applications) {
      if (byStage[app.status]) byStage[app.status].push(app);
      else byStage['new'].push(app);
    }

    return `
      <div class="page-header">
        <h1>Applications Pipeline</h1>
        <div class="page-header__actions">
          <span style="font-size:0.85rem; color:var(--color-text-muted);">${applications.length} total applications</span>
        </div>
      </div>

      <div class="kanban">
        ${STAGES.map(stage => `
          <div class="kanban__column">
            <div class="kanban__column-header">
              <span>${escape(stage.label)}</span>
              <span class="kanban__column-count">${byStage[stage.key].length}</span>
            </div>
            <div class="kanban__column-body" data-status="${stage.key}">
              ${byStage[stage.key].map(app => `
                <div class="kanban__card" draggable="true" data-id="${escape(app.id)}">
                  <div class="kanban__card-name">
                    ${escape(app.name)}
                    ${app.source === 'arc-ai' ? '<span class="badge badge--arc-ai" style="margin-left:6px; font-size:0.6rem; vertical-align:middle;">Arc AI</span>' : ''}
                  </div>
                  <div class="kanban__card-meta">
                    <span class="badge badge--${escape(app.lab)}">${escape(app.lab)}</span>
                    &middot; ${app.source === 'arc-ai' ? 'Demo Request' : escape(app.level)}
                    &middot; ${this._timeAgo(app.created_at)}
                  </div>
                  ${app.rating ? `<div style="margin-top:6px; font-size:0.75rem; color:var(--color-warning);">${'★'.repeat(app.rating)}${'☆'.repeat(5 - app.rating)}</div>` : ''}
                </div>
              `).join('')}
              ${!byStage[stage.key].length ? '<div style="text-align:center; padding:20px; font-size:0.8rem; color:var(--color-text-muted);">Drop here</div>' : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}
