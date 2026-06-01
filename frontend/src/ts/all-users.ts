import { redirectIfNotAuth } from "../main";

import { getUserData } from "../main";
import { MediAlert } from "./alert";

redirectIfNotAuth()

async function check() {
    const ROLE = await cookieStore.get('role');
    if (ROLE?.value !== 'Admin') {
        MediAlert.modal({
            type: 'error',
            title: 'Access Denied',
            message: 'You do not have permission to view this page.',
            detail: 'Error code: 403 — Forbidden',
            confirmText: 'Go Back',
            cancelText: 'Contact Support',
            theme: 'dark',
            onConfirm: () => window.history.back()
        });
        return
    }
}

await check()

const apiUrl = import.meta.env.VITE_API_URL;

type UserRole = 'patient' | 'doctor' | 'admin';
type UserStatus = 'active' | 'suspended' | 'pending' | 'inactive';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  phone: string;
  specialty?: string;
  department?: string;
  notes?: string;
  age?: number;
}

const res = await fetch(`${apiUrl}/users`);
const data = await res.json();
console.log(data)
let ALL_USERS: any[] = (data.users.rows ?? []).map((u: any) => ({ ...u, id: String(u.id) }));

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const state = {
  view: 'table' as 'table' | 'card',
  roleFilter: 'all',
  statusFilter: '',
  verifiedFilter: '',
  sort: 'newest',
  search: '',
  page: 1,
  perPage: 15,
  selected: new Set<string>(),
  sortCol: 'joined' as keyof User,
  sortDir: -1 as 1 | -1,
  editingId: null as string | null,
  deletingId: null as string | null,
};

const totalDoctors = document.getElementById('stat-doctors');
const totalPatients = document.getElementById('stat-patients');
const totalActives = document.getElementById('stat-active');
const totalInactives = document.getElementById('stat-inactive');
const totalUsers = document.getElementById('stat-total');
const name = document.querySelector('.name');
const adminAvtr = document.querySelector('.admin-av');
const topTitle = document.querySelector('.topbar-sub');
const topAvtr = document.querySelector('.topbar-av');
const fullDate = String(new Date().toDateString()).split(' ');

totalDoctors!.textContent = data.countDoctors;
totalPatients!.textContent = data.countPatients;
totalActives!.textContent = String(data.countActive - 1);
totalInactives!.textContent = data.countInactive;
totalUsers!.textContent = data.users.count;
const userData = await getUserData();
name!.textContent = userData.users[0].full_name;
topTitle!.textContent = `MediBook Admin Panel · ${fullDate.join(', ')}`;
topAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
adminAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function $(id: string) { return document.getElementById(id); }

let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(msg: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
  const el = $('toast')!;
  el.textContent = msg;
  el.className = `toast show ${type}`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

function rolePillHTML(role: UserRole): string {
  return `<span class="role-pill ${role}">${role.charAt(0).toUpperCase() + role.slice(1)}</span>`;
}
function statusPillHTML(status: UserStatus): string {
  const labels: Record<UserStatus, string> = { active: 'Active', suspended: 'Suspended', pending: 'Pending', inactive: 'Inactive' };
  return `<span class="s-pill ${status}">${labels[status]}</span>`;
}

// ═══════════════════════════════════════════════════════
// FILTER / SORT
// ═══════════════════════════════════════════════════════

function filteredUsers() {
  let list = [...ALL_USERS];

  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || String(u.id).includes(q));
  }
  if (state.roleFilter !== 'all') list = list.filter(u => (u.role ?? '').toLowerCase() === state.roleFilter);
  if (state.statusFilter) list = list.filter(u => (u.status ?? '').toLowerCase() === state.statusFilter);
  if (state.verifiedFilter) list = list.filter((u: any) => String(u.verified) === state.verifiedFilter);

  const getDate = (u: any) => new Date(u.created_at ?? u.createdAt ?? 0).getTime();

  list.sort((a, b) => {
    switch (state.sort) {
      case 'newest': return getDate(b) - getDate(a);
      case 'oldest': return getDate(a) - getDate(b);
      case 'name-az': return a.full_name.localeCompare(b.full_name);
      case 'name-za': return b.full_name.localeCompare(a.full_name);
      default: return 0;
    }
  });

  return list;
}

function pagedUsers(): { list: any; total: number; pages: number } {
  const list = filteredUsers();
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / state.perPage));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * state.perPage;
  return { list: list.slice(start, start + state.perPage), total, pages };
}

// ═══════════════════════════════════════════════════════
// RENDER
// ═══════════════════════════════════════════════════════

function render(): void {
  const { list, total, pages } = pagedUsers();
  const show = list.length > 0;

  $('emptyState')!.style.display = show ? 'none' : 'block';
  $('pagination')!.style.display = show ? 'flex' : 'none';
  $('tableView')!.style.display = (show && state.view === 'table') ? '' : 'none';
  $('cardView')!.style.display = (show && state.view === 'card') ? '' : 'none';
  if (show && state.view === 'card') $('cardView')!.classList.add('visible');
  else $('cardView')!.classList.remove('visible');

  const start = (state.page - 1) * state.perPage + 1;
  const end = Math.min(state.page * state.perPage, total);
  $('results-count')!.textContent = `Showing ${start}–${end} of ${total.toLocaleString()}`;

  if (state.view === 'table') renderTable(list);
  else renderCards(list);

  renderPagination(pages);
  updateBulkBar();
  updateSelectAll(list);
}

// ── TABLE ──
function renderTable(list: any): void {
  const tbody = $('usersTableBody')!;
  tbody.innerHTML = list.map((u: any) => {
    const checked = state.selected.has(u.id);
    return `
    <tr data-id="${u.id}" class="${checked ? 'selected' : ''}" onclick="handleRowClick(event,'${u.id}')">
      <td onclick="event.stopPropagation()">
        <label class="cb-wrap">
          <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleSelect('${u.id}',this.checked)">
          <span class="cb-custom"></span>
        </label>
      </td>
      <td>
        <div class="user-cell">
          <div class="user-av" style="background:${['#1D9E75', '#378ADD', '#D85A30', '#EF9F27', '#8B7EF8'][u.id % 5]};">${u.full_name[0].toUpperCase()}</div>
          <div>
            <div class="user-name">${u.full_name}</div>
            <div class="user-email">${u.email}</div>
            <div class="user-id">${u.id}</div>
          </div>
        </div>
      </td>
      <td>${rolePillHTML((u.role === 'User' ? 'patient' : u.role.toLowerCase()) as UserRole)}</td>
      <td>${statusPillHTML(u.status.toLowerCase())}</td>
      <td style="color:var(--text-2);font-size:12.5px;">${fmtDate(new Date(u.created_at ?? u.createdAt))}</td>
      <td style="font-family:var(--font-display);font-size:17px;color:var(--text-1);">0 appointments</td>
      <td onclick="event.stopPropagation()">
        <div class="tbl-actions">
          <button class="tbl-btn del" title="Delete" onclick="openDelModal('${u.id}')">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// SOON
// <button class="tbl-btn view" title="View" onclick="openViewDrawer('${u.id}')">
//   <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
// </button>
// <button class="tbl-btn edit" title="Edit" onclick="openEditDrawer('${u.id}')">
//   <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
// </button>
// <button class="tbl-btn sus" title="${u.status === 'suspended' ? 'Unsuspend' : 'Suspend'}" onclick="toggleSuspend('${u.id}')">
//   <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
// </button>

// ── CARDS ──
function renderCards(list: User[]): void {
  const grid = $('cardView')!;
  grid.innerHTML = list.map((u: any, i) => {
    const checked = state.selected.has(u.id);
    const topColor = u.role === 'Doctor' ? 'var(--purple-400)' : u.role === 'Admin' ? 'var(--teal-400)' : 'var(--blue-400)';
    return `
    <div class="user-card ${checked ? 'selected' : ''}" data-id="${u.id}" style="animation-delay:${i * 0.03}s" onclick="handleRowClick(event,'${u.id}')">
      <div class="uc-top" style="background:${topColor};"></div>
      <div class="uc-body">
        <div class="uc-head">
          <div class="uc-av" style="background:${['#1D9E75', '#378ADD', '#D85A30', '#EF9F27', '#8B7EF8'][(u.id) as any % 5]};">
            ${u.full_name[0].toUpperCase()}
          </div>
          <div class="uc-info">
            <div class="uc-name">${u.full_name}</div>
            <div class="uc-email">${u.email}</div>
            <div class="uc-meta">
              ${rolePillHTML(u.role)}
              ${statusPillHTML(u.status)}
            </div>
          </div>
          <label class="cb-wrap" onclick="event.stopPropagation()" style="margin-left:4px;flex-shrink:0;">
            <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleSelect('${u.id}',this.checked)">
            <span class="cb-custom"></span>
          </label>
        </div>
        <div class="uc-divider"></div>
        <div class="uc-stats">
          <div class="uc-stat">
            <div class="csv">${fmtDate(new Date(u.createdAt))}</div>
            <div class="csl">Joined</div>
          </div>
          <div class="uc-stat">
            <div class="csv">${u.phone ?? '—'}</div>
            <div class="csl">Phone</div>
          </div>
        </div>
        <div class="uc-footer">
          <div class="uc-actions" onclick="event.stopPropagation()">
            <button class="tbl-btn del" title="Delete" onclick="openDelModal('${u.id}')">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// SOON
// <button class="tbl-btn view" title="View" onclick="openViewDrawer('${u.id}')">
//   <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
// </button>
// <button class="tbl-btn edit" title="Edit" onclick="openEditDrawer('${u.id}')">
//   <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
// </button>

// ── PAGINATION ──
function renderPagination(pages: number): void {
  const pg = $('pgPages')!;
  const info = $('pgInfo')!;
  const prev = $('prevPage') as HTMLButtonElement;
  const next = $('nextPage') as HTMLButtonElement;

  prev.disabled = state.page <= 1;
  next.disabled = state.page >= pages;
  info.textContent = `Page ${state.page} of ${pages}`;

  const range: Array<number | '…'> = [];
  if (pages <= 7) {
    for (let i = 1; i <= pages; i++) range.push(i);
  } else {
    range.push(1);
    if (state.page > 3) range.push('…');
    for (let i = Math.max(2, state.page - 1); i <= Math.min(pages - 1, state.page + 1); i++) range.push(i);
    if (state.page < pages - 2) range.push('…');
    range.push(pages);
  }

  pg.innerHTML = range.map(r =>
    r === '…'
      ? `<span class="pg-dots">…</span>`
      : `<button class="pg-num ${r === state.page ? 'active' : ''}" onclick="goToPage(${r})">${r}</button>`
  ).join('');
}

// ═══════════════════════════════════════════════════════
// SELECTION
// ═══════════════════════════════════════════════════════

function toggleSelect(id: string, checked: boolean): void {
  checked ? state.selected.add(id) : state.selected.delete(id);
  render();
}

function updateSelectAll(list: User[]): void {
  const sa = $('selectAll') as HTMLInputElement;
  if (!sa) return;
  const allChecked = list.length > 0 && list.every(u => state.selected.has(u.id));
  sa.checked = allChecked;
  sa.indeterminate = !allChecked && list.some(u => state.selected.has(u.id));
}

function updateBulkBar(): void {
  const bar = $('bulkBar')!;
  const cnt = state.selected.size;
  bar.classList.toggle('visible', cnt > 0);
  $('bulkCount')!.textContent = `${cnt} selected`;
}

// ═══════════════════════════════════════════════════════
// DRAWER
// ═══════════════════════════════════════════════════════

function openOverlay(): void { $('drawerOverlay')!.classList.add('open'); }
function closeDrawer(): void {
  $('drawerOverlay')!.classList.remove('open');
  state.editingId = null;
}

function openViewDrawer(id: string): void {
  const u = ALL_USERS.find((x: any) => x.id === id);
  if (!u) return;
  state.editingId = id;

  $('drawerTitle')!.textContent = u.full_name;
  $('drawerSub')!.textContent = `${u.role.charAt(0).toUpperCase() + u.role.slice(1)} · ${u.id}`;
  $('drawerSave')!.textContent = 'Edit User';
  ($('drawerSave') as HTMLButtonElement).onclick = () => { closeDrawer(); openEditDrawer(id); };

  const activities = [
    { text: 'Appointment booked with Dr. Sarah Rahman', time: '2 hours ago', color: 'var(--teal-400)' },
    { text: 'Profile information updated', time: '1 day ago', color: 'var(--blue-400)' },
    { text: 'Password changed successfully', time: '3 days ago', color: 'var(--amber-400)' },
    { text: 'Account verified via email', time: '1 week ago', color: 'var(--green-400)' },
  ];

  const topColor = u.role === 'doctor' ? 'var(--purple-400)' : u.role === 'admin' ? 'var(--teal-400)' : 'var(--blue-400)';

  $('drawerBody')!.innerHTML = `
    <div class="drawer-user-hero">
      <div class="drawer-user-av" style="background:${topColor};">${u.full_name[0].toUpperCase()}</div>
      <div>
        <div class="drawer-user-name">${u.full_name}</div>
        <div class="drawer-user-email">${u.email}</div>
        <div class="drawer-user-meta">
          ${rolePillHTML(u.role)}
          ${statusPillHTML(u.status)}
        </div>
      </div>
    </div>

    <div class="drawer-section">
      <h4>Contact Information</h4>
      <div class="info-grid">
        <div class="info-box"><div class="ib-label">Phone</div><div class="ib-val">${u.phone ?? '—'}</div></div>
        <div class="info-box"><div class="ib-label">Member Since</div><div class="ib-val">${fmtDate(new Date(u.created_at ?? u.createdAt))}</div></div>
      </div>
    </div>

    ${u.role === 'doctor' ? `
    <div class="drawer-section">
      <h4>Professional Info</h4>
      <div class="info-grid">
        <div class="info-box"><div class="ib-label">Specialty</div><div class="ib-val">${u.specialty ?? '—'}</div></div>
        <div class="info-box"><div class="ib-label">Department</div><div class="ib-val">${u.department ?? '—'}</div></div>
      </div>
    </div>` : ''}

    <div class="drawer-section">
      <h4>Account Details</h4>
      <div class="info-grid">
        <div class="info-box"><div class="ib-label">User ID</div><div class="ib-val" style="font-family:monospace;">${u.id}</div></div>
        <div class="info-box"><div class="ib-label">Status</div><div class="ib-val">${u.status.charAt(0).toUpperCase() + u.status.slice(1)}</div></div>
      </div>
    </div>

    <div class="drawer-section">
      <h4>Recent Activity</h4>
      <div class="activity-list">
        ${activities.map(a => `
        <div class="activity-item">
          <div class="activity-dot" style="background:${a.color};"></div>
          <div>
            <div class="activity-text">${a.text}</div>
            <div class="activity-time">${a.time}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  `;

  openOverlay();
}

function openEditDrawer(id: string): void {
  const u = ALL_USERS.find((x: any) => x.id === id);
  if (!u) return;
  state.editingId = id;

  $('drawerTitle')!.textContent = 'Edit User';
  $('drawerSub')!.textContent = `${u.full_name} · ${u.id}`;
  $('drawerSave')!.textContent = 'Save Changes';
  ($('drawerSave') as HTMLButtonElement).onclick = () => saveEdit(id);

  const topColor = u.role === 'doctor' ? 'var(--purple-400)' : u.role === 'admin' ? 'var(--teal-400)' : 'var(--blue-400)';

  $('drawerBody')!.innerHTML = `
    <div class="drawer-user-hero" style="margin-bottom:1.4rem;">
      <div class="drawer-user-av" style="background:${topColor};">${u.full_name[0].toUpperCase()}</div>
      <div>
        <div class="drawer-user-name">${u.full_name}</div>
        <div class="drawer-user-email">${u.email}</div>
      </div>
    </div>

    <div class="form-row">
      <div class="form-field">
        <label>First Name</label>
        <input class="form-input" id="ef-first" value="${u.full_name.split(' ')[0]}">
      </div>
      <div class="form-field">
        <label>Last Name</label>
        <input class="form-input" id="ef-last" value="${u.full_name.split(' ').slice(1).join(' ')}">
      </div>
    </div>

    <div class="form-field">
      <label>Email Address</label>
      <input class="form-input" id="ef-email" type="email" value="${u.email}">
    </div>

    <div class="form-field">
      <label>Phone</label>
      <input class="form-input" id="ef-phone" value="${u.phone ?? ''}">
    </div>

    <div class="form-row">
      <div class="form-field">
        <label>Role</label>
        <select class="form-input" id="ef-role">
          <option value="patient" ${u.role === 'patient' ? 'selected' : ''}>Patient</option>
          <option value="doctor"  ${u.role === 'doctor' ? 'selected' : ''}>Doctor</option>
          <option value="admin"   ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
        </select>
      </div>
      <div class="form-field">
        <label>Status</label>
        <select class="form-input" id="ef-status">
          <option value="active"    ${u.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="suspended" ${u.status === 'suspended' ? 'selected' : ''}>Suspended</option>
          <option value="pending"   ${u.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="inactive"  ${u.status === 'inactive' ? 'selected' : ''}>Inactive</option>
        </select>
      </div>
    </div>

    ${u.role === 'doctor' ? `
    <div class="form-row">
      <div class="form-field">
        <label>Specialty</label>
        <input class="form-input" id="ef-spec" value="${u.specialty ?? ''}">
      </div>
      <div class="form-field">
        <label>Department</label>
        <input class="form-input" id="ef-dept" value="${u.department ?? ''}">
      </div>
    </div>` : ''}
  `;

  openOverlay();
}

function saveEdit(id: string): void {
  const u = ALL_USERS.find((x: any) => x.id === id);
  if (!u) return;
  const first = (document.getElementById('ef-first') as HTMLInputElement)?.value.trim();
  const last = (document.getElementById('ef-last') as HTMLInputElement)?.value.trim();
  if (first) u.full_name = last ? `${first} ${last}` : first;
  const email = (document.getElementById('ef-email') as HTMLInputElement)?.value.trim();
  if (email) u.email = email;
  u.phone = (document.getElementById('ef-phone') as HTMLInputElement)?.value ?? u.phone;
  u.role = (document.getElementById('ef-role') as HTMLSelectElement)?.value as UserRole ?? u.role;
  u.status = (document.getElementById('ef-status') as HTMLSelectElement)?.value as UserStatus ?? u.status;
  if (u.role === 'doctor') {
    u.specialty = (document.getElementById('ef-spec') as HTMLInputElement)?.value ?? u.specialty;
    u.department = (document.getElementById('ef-dept') as HTMLInputElement)?.value ?? u.department;
  }
  closeDrawer();
  render();
  showToast(`${u.full_name} updated successfully.`, 'success');
}

// ═══════════════════════════════════════════════════════
// DELETE
// ═══════════════════════════════════════════════════════

function openDelModal(id: string): void {
  const u = ALL_USERS.find((x: any) => x.id === id);
  if (!u) return;
  state.deletingId = id;
  $('delName')!.textContent = u.full_name;
  $('delModal')!.classList.add('open');
}
function closeDelModal(): void { $('delModal')!.classList.remove('open'); state.deletingId = null; }
async function confirmDel() {
  if (!state.deletingId) return;
  const idx = ALL_USERS.findIndex((u: any) => u.id === state.deletingId);
  const name = ALL_USERS[idx]?.full_name ?? 'User';
  if (idx > -1) ALL_USERS.splice(idx, 1);
  state.selected.delete(state.deletingId!);
  console.log(state.deletingId)

  const res = await fetch(`${apiUrl}/users/${state.deletingId}`, {
    method: 'DELETE',
  })

  const response = await res.json();

  if (!response.success) {
    showToast(`${name || 'User'} has not been removed.`, 'error');

  }

  closeDelModal();
  render();
  showToast(`${name} deleted.`, 'error');
}

// ═══════════════════════════════════════════════════════
// MISC ACTIONS
// ═══════════════════════════════════════════════════════

function toggleSuspend(id: string): void {
  const u = ALL_USERS.find((x: any) => x.id === id);
  if (!u) return;
  u.status = u.status === 'suspended' ? 'active' : 'suspended';
  render();
  showToast(`${u.full_name} ${u.status === 'suspended' ? 'suspended' : 'reactivated'}.`, 'warning');
}

function handleRowClick(e: Event, id: string): void {
  const target = e.target as HTMLElement;
  if (target.closest('.tbl-actions') || target.closest('.uc-actions') || target.closest('.cb-wrap')) return;
  openViewDrawer(id);
}

function goToPage(n: number): void { state.page = n; render(); }

// ═══════════════════════════════════════════════════════
// EVENT WIRING
// ═══════════════════════════════════════════════════════

const signOut = () => {
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('userId')
  cookieStore.delete('role')

  localStorage.clear()

  window.location.href = '/'
}

function initEvents(): void {
  // Search
  $('user-search')!.addEventListener('input', (e) => {
    state.search = (e.target as HTMLInputElement).value;
    state.page = 1;
    render();
  });

  // Role tabs
  document.getElementById('roleTabs')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.role-tab');
    if (!btn) return;
    document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    state.roleFilter = btn.dataset.role ?? 'all';
    state.page = 1;
    render();
  });

  // Filters
  $('status-filter')!.addEventListener('change', (e) => {
    state.statusFilter = (e.target as HTMLSelectElement).value;
    state.page = 1; render();
  });
  $('verified-filter')!.addEventListener('change', (e) => {
    state.verifiedFilter = (e.target as HTMLSelectElement).value;
    state.page = 1; render();
  });
  $('sort-select')!.addEventListener('change', (e) => {
    state.sort = (e.target as HTMLSelectElement).value;
    state.page = 1; render();
  });

  // View toggle
  document.querySelectorAll<HTMLElement>('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = (btn.dataset.view ?? 'table') as 'table' | 'card';
      render();
    });
  });

  // Select all
  $('selectAll')!.addEventListener('change', (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    const { list } = pagedUsers();
    list.forEach((u: any) => checked ? state.selected.add(u.id) : state.selected.delete(u.id));
    render();
  });

  // Bulk actions
  $('bulkVerify')!.addEventListener('click', () => {
    state.selected.forEach(id => { const u = ALL_USERS.find((x: any) => x.id === id); if (u) u.verified = true; });
    showToast(`${state.selected.size} users verified.`, 'success');
    state.selected.clear(); render();
  });
  $('bulkSuspend')!.addEventListener('click', () => {
    state.selected.forEach(id => { const u = ALL_USERS.find((x: any) => x.id === id); if (u) u.status = 'suspended'; });
    showToast(`${state.selected.size} users suspended.`, 'warning');
    state.selected.clear(); render();
  });
  $('bulkDelete')!.addEventListener('click', () => {
    const count = state.selected.size;
    state.selected.forEach(id => { const idx = ALL_USERS.findIndex((u: any) => u.id === id); if (idx > -1) ALL_USERS.splice(idx, 1); });
    state.selected.clear();
    showToast(`${count} users deleted.`, 'error');
    render();
  });
  $('bulkCancel')!.addEventListener('click', () => { state.selected.clear(); render(); });

  // Pagination
  $('prevPage')!.addEventListener('click', () => { if (state.page > 1) { state.page--; render(); } });
  $('nextPage')!.addEventListener('click', () => { state.page++; render(); });

  // Drawer close
  $('drawerClose')!.addEventListener('click', closeDrawer);
  $('drawerCancel')!.addEventListener('click', closeDrawer);
  $('drawerOverlay')!.addEventListener('click', (e) => { if ((e.target as HTMLElement).id === 'drawerOverlay') closeDrawer(); });

  // Modal close
  $('delCancel')!.addEventListener('click', closeDelModal);
  $('delConfirm')!.addEventListener('click', confirmDel);
  $('delModal')!.addEventListener('click', (e) => { if ((e.target as HTMLElement).id === 'delModal') closeDelModal(); });

  // Add / export buttons
  // $('addUserBtn')!.addEventListener('click', () => showToast('Add user flow — connect to your backend.', 'info'));
  // $('emptyAddBtn')!.addEventListener('click', () => showToast('Add user flow — connect to your backend.', 'info'));
  // $('exportBtn')!.addEventListener('click', () => showToast('CSV exported.', 'success'));
}

// Expose globals used inline in HTML
(window as any).openViewDrawer = openViewDrawer;
(window as any).openEditDrawer = openEditDrawer;
(window as any).openDelModal = openDelModal;
(window as any).toggleSuspend = toggleSuspend;
(window as any).toggleSelect = toggleSelect;
(window as any).handleRowClick = handleRowClick;
(window as any).goToPage = goToPage;
(window as any).signOut = signOut;

// ═══════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════

initEvents();
render();

// (window as any).signOut = signOut;