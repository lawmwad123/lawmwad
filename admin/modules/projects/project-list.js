import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { openModal, confirmDialog } from '../../components/ui/modal.js';
import { escape } from '../../arc/security.js';

export class ProjectListPage extends ArcComponent {
  setup() {
    this.state = { projects: [], loading: true, filter: 'all', statusFilter: 'all', search: '' };
  }

  async onMount() {
    await this.loadProjects();
  }

  async loadProjects() {
    try {
      const { data } = await http.get('projects');
      this.setState({ projects: data, loading: false });
    } catch {
      toast.error('Failed to load projects');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .project-row': (e, el) => router.navigate(`/projects/${el.dataset.id}`),
      'click .add-project-btn': () => this.openForm(),
      'change .division-filter': (e) => this.setState({ filter: e.target.value }),
      'change .status-filter': (e) => this.setState({ statusFilter: e.target.value }),
      'input .search-input': (e) => this.setState({ search: e.target.value.toLowerCase() }),
      'click .delete-btn': (e, el) => {
        e.stopPropagation();
        confirmDialog(`Delete project "${el.dataset.name}"?`, async () => {
          try {
            await http.del(`projects/${el.dataset.id}`);
            toast.success('Project deleted');
            await this.loadProjects();
          } catch { toast.error('Failed to delete project'); }
        });
      },
    };
  }

  openForm() {
    const { close } = openModal('New Project', `
      <form id="project-form">
        <div class="form-row">
          <div class="form-group">
            <label>Name *</label>
            <input type="text" id="p-name" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Slug *</label>
            <input type="text" id="p-slug" class="form-control" placeholder="e.g. superthermo" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Division *</label>
            <select id="p-division" class="form-control" required>
              <option value="">Select</option>
              ${['software','robotics','mechanics','electronics','cross-division'].map(d =>
                `<option value="${d}">${d.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Priority</label>
            <select id="p-priority" class="form-control">
              ${['low','medium','high','critical'].map(p =>
                `<option value="${p}" ${p==='medium'?'selected':''}>${p.charAt(0).toUpperCase()+p.slice(1)}</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="p-desc" class="form-control" rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" id="p-start" class="form-control">
          </div>
          <div class="form-group">
            <label>Target End Date</label>
            <input type="date" id="p-end" class="form-control">
          </div>
        </div>
        <div class="form-group">
          <label>Budget ($)</label>
          <input type="number" id="p-budget" class="form-control" step="0.01" min="0">
        </div>
      </form>
    `, {
      footer: `
        <button class="btn btn--secondary modal-cancel">Cancel</button>
        <button class="btn btn--primary modal-save">Create</button>
      `,
    });

    const root = document.getElementById('modal-root');
    root.querySelector('.modal-cancel')?.addEventListener('click', close);

    // Auto-generate slug from name
    root.querySelector('#p-name')?.addEventListener('input', (e) => {
      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      root.querySelector('#p-slug').value = slug;
    });

    root.querySelector('.modal-save')?.addEventListener('click', async () => {
      const name = root.querySelector('#p-name').value.trim();
      const slug = root.querySelector('#p-slug').value.trim();
      const division = root.querySelector('#p-division').value;

      if (!name || !slug || !division) {
        toast.error('Name, slug, and division are required');
        return;
      }

      try {
        await http.post('projects', {
          name, slug, division,
          description: root.querySelector('#p-desc').value.trim() || null,
          priority: root.querySelector('#p-priority').value,
          start_date: root.querySelector('#p-start').value || null,
          target_end_date: root.querySelector('#p-end').value || null,
          budget_allocated: parseFloat(root.querySelector('#p-budget').value) || 0,
        });
        toast.success('Project created');
        close();
        await this.loadProjects();
      } catch (err) {
        toast.error(err.message || 'Failed to create project');
      }
    });
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
    const { projects, loading, filter, statusFilter, search } = this.state;
    if (loading) return '<div class="loading-spinner"></div>';

    const filtered = projects.filter(p => {
      if (filter !== 'all' && p.division !== filter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search && !p.name.toLowerCase().includes(search)) return false;
      return true;
    });

    return `
      <div class="page-header">
        <h1>Projects</h1>
        <div class="page-header__actions">
          <button class="btn btn--primary add-project-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <input type="text" class="form-control filter-bar__search search-input" placeholder="Search projects..." value="${escape(search)}">
        <select class="form-control division-filter">
          <option value="all">All Divisions</option>
          ${['software','robotics','mechanics','electronics','cross-division'].map(d =>
            `<option value="${d}" ${filter===d?'selected':''}>${d.replace('-',' ').replace(/\b\w/g,c=>c.toUpperCase())}</option>`
          ).join('')}
        </select>
        <select class="form-control status-filter">
          <option value="all">All Statuses</option>
          ${['planning','active','paused','completed','archived'].map(s =>
            `<option value="${s}" ${statusFilter===s?'selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`
          ).join('')}
        </select>
      </div>

      ${!filtered.length ? `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <h3>No projects found</h3>
          <p>Create your first project to get started.</p>
        </div>
      ` : `
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Division</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Budget</th>
                <th>Lead</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(p => {
                const pct = this._budgetPercent(p);
                return `
                  <tr class="project-row clickable" data-id="${escape(p.id)}">
                    <td style="font-weight:500; color:var(--color-text);">${escape(p.name)}</td>
                    <td><span class="badge badge--${escape(p.division)}">${escape(p.division)}</span></td>
                    <td><span class="badge badge--${escape(p.status)}">${escape(p.status)}</span></td>
                    <td><span class="badge badge--${escape(p.priority)}">${escape(p.priority)}</span></td>
                    <td>
                      <div style="font-size:0.8rem;">$${Number(p.budget_spent||0).toLocaleString()} / $${Number(p.budget_allocated||0).toLocaleString()}</div>
                      <div class="budget-bar"><div class="budget-bar__fill budget-bar__fill--${this._budgetClass(pct)}" style="width:${pct}%"></div></div>
                    </td>
                    <td style="color:var(--color-text-secondary);">${escape(p.lead_name || '—')}</td>
                    <td style="text-align:right;">
                      <button class="btn btn--icon delete-btn" data-id="${escape(p.id)}" data-name="${escape(p.name)}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  }
}
