import { ArcComponent } from '../../arc/component.js';
import { http } from '../../arc/http.js';
import { router } from '../../arc/router.js';
import { toast } from '../../components/ui/toast.js';
import { openModal } from '../../components/ui/modal.js';
import { confirmDialog } from '../../components/ui/modal.js';
import { escape } from '../../arc/security.js';

export class TeamListPage extends ArcComponent {
  setup() {
    this.state = { members: [], loading: true, filter: 'all', search: '' };
  }

  async onMount() {
    await this.loadMembers();
  }

  async loadMembers() {
    try {
      const { data } = await http.get('team');
      this.setState({ members: data, loading: false });
    } catch (err) {
      toast.error('Failed to load team members');
      this.setState({ loading: false });
    }
  }

  events() {
    return {
      'click .team-row': (e, el) => {
        router.navigate(`/team/${el.dataset.id}`);
      },
      'click .add-member-btn': () => this.openForm(),
      'change .division-filter': (e) => {
        this.setState({ filter: e.target.value });
      },
      'input .search-input': (e) => {
        this.setState({ search: e.target.value.toLowerCase() });
      },
      'click .delete-btn': (e, el) => {
        e.stopPropagation();
        const id = el.dataset.id;
        const name = el.dataset.name;
        confirmDialog(`Delete ${name}? This action cannot be undone.`, async () => {
          try {
            await http.del(`team/${id}`);
            toast.success('Member deleted');
            await this.loadMembers();
          } catch {
            toast.error('Failed to delete member');
          }
        });
      },
    };
  }

  openForm(member = null) {
    const isEdit = !!member;
    const title = isEdit ? 'Edit Team Member' : 'Add Team Member';

    const { close, root } = openModal(title, `
      <form id="member-form">
        <div class="form-row">
          <div class="form-group">
            <label for="m-name">Name *</label>
            <input type="text" id="m-name" class="form-control" value="${escape(member?.name || '')}" required>
          </div>
          <div class="form-group">
            <label for="m-email">Email *</label>
            <input type="email" id="m-email" class="form-control" value="${escape(member?.email || '')}" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="m-division">Division *</label>
            <select id="m-division" class="form-control" required>
              <option value="">Select division</option>
              ${['software', 'robotics', 'mechanics', 'electronics'].map(d =>
                `<option value="${d}" ${member?.division === d ? 'selected' : ''}>${d.charAt(0).toUpperCase() + d.slice(1)}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="m-role">Role *</label>
            <input type="text" id="m-role" class="form-control" value="${escape(member?.role || '')}" placeholder="e.g. Senior Researcher" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="m-title">Title</label>
            <input type="text" id="m-title" class="form-control" value="${escape(member?.title || '')}" placeholder="e.g. Lead PCB Designer">
          </div>
          <div class="form-group">
            <label for="m-phone">Phone</label>
            <input type="tel" id="m-phone" class="form-control" value="${escape(member?.phone || '')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="m-status">Status</label>
            <select id="m-status" class="form-control">
              ${['active', 'on_leave', 'alumni'].map(s =>
                `<option value="${s}" ${member?.status === s ? 'selected' : ''}>${s.replace('_', ' ')}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="m-join-date">Join Date</label>
            <input type="date" id="m-join-date" class="form-control" value="${member?.join_date?.split('T')[0] || ''}">
          </div>
        </div>
        <div class="form-group">
          <label for="m-bio">Bio</label>
          <textarea id="m-bio" class="form-control" rows="3">${escape(member?.bio || '')}</textarea>
        </div>
        <div class="form-group">
          <label for="m-skills">Skills (comma-separated)</label>
          <input type="text" id="m-skills" class="form-control" value="${escape((member?.skills || []).join(', '))}" placeholder="Python, ROS, SolidWorks">
        </div>
      </form>
    `, {
      footer: `
        <button class="btn btn--secondary modal-cancel">Cancel</button>
        <button class="btn btn--primary modal-save">${isEdit ? 'Update' : 'Create'}</button>
      `,
    });

    const modalRoot = document.getElementById('modal-root');
    modalRoot.querySelector('.modal-cancel')?.addEventListener('click', close);
    modalRoot.querySelector('.modal-save')?.addEventListener('click', async () => {
      const form = modalRoot.querySelector('#member-form');
      const name = form.querySelector('#m-name').value.trim();
      const email = form.querySelector('#m-email').value.trim();
      const division = form.querySelector('#m-division').value;
      const role = form.querySelector('#m-role').value.trim();

      if (!name || !email || !division || !role) {
        toast.error('Please fill all required fields');
        return;
      }

      const data = {
        name, email, division, role,
        title: form.querySelector('#m-title').value.trim() || null,
        phone: form.querySelector('#m-phone').value.trim() || null,
        status: form.querySelector('#m-status').value,
        join_date: form.querySelector('#m-join-date').value || null,
        bio: form.querySelector('#m-bio').value.trim() || null,
        skills: form.querySelector('#m-skills').value.split(',').map(s => s.trim()).filter(Boolean),
      };

      try {
        if (isEdit) {
          await http.put(`team/${member.id}`, data);
          toast.success('Member updated');
        } else {
          await http.post('team', data);
          toast.success('Member created');
        }
        close();
        await this.loadMembers();
      } catch (err) {
        toast.error(err.message || 'Failed to save member');
      }
    });
  }

  render() {
    const { members, loading, filter, search } = this.state;

    if (loading) return '<div class="loading-spinner"></div>';

    const filtered = members.filter(m => {
      if (filter !== 'all' && m.division !== filter) return false;
      if (search && !m.name.toLowerCase().includes(search) && !m.email.toLowerCase().includes(search)) return false;
      return true;
    });

    return `
      <div class="page-header">
        <h1>Team Members</h1>
        <div class="page-header__actions">
          <button class="btn btn--primary add-member-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Member
          </button>
        </div>
      </div>

      <div class="filter-bar">
        <input type="text" class="form-control filter-bar__search search-input" placeholder="Search members..." value="${escape(search)}">
        <select class="form-control division-filter">
          <option value="all">All Divisions</option>
          <option value="software" ${filter === 'software' ? 'selected' : ''}>Software</option>
          <option value="robotics" ${filter === 'robotics' ? 'selected' : ''}>Robotics</option>
          <option value="mechanics" ${filter === 'mechanics' ? 'selected' : ''}>Mechanics</option>
          <option value="electronics" ${filter === 'electronics' ? 'selected' : ''}>Electronics</option>
        </select>
      </div>

      ${filtered.length === 0 ? `
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          <h3>No team members found</h3>
          <p>Add your first team member to get started.</p>
        </div>
      ` : `
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Division</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(m => `
                <tr class="team-row clickable" data-id="${escape(m.id)}">
                  <td style="font-weight:500; color:var(--color-text);">${escape(m.name)}</td>
                  <td><span class="badge badge--${escape(m.division)}">${escape(m.division)}</span></td>
                  <td>${escape(m.role)}</td>
                  <td><span class="badge badge--${escape(m.status)}">${escape(m.status?.replace('_', ' '))}</span></td>
                  <td style="text-align:right;">
                    <button class="btn btn--icon delete-btn" data-id="${escape(m.id)}" data-name="${escape(m.name)}" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
  }
}
