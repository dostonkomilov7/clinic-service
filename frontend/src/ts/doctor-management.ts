import { redirectIfNotAuth, setCookie, getUserData } from "../main";
import { MediAlert } from "./alert";

redirectIfNotAuth();

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
      onConfirm: () => window.history.back()
    });
  }
}

await check()

const apiUrl = import.meta.env.VITE_API_URL;

/* ─── DATA ─── */
const COLORS = ['#1D9E75', '#378ADD', '#D85A30', '#EF9F27', '#8B7EF8', '#34C97A', '#E0608A', '#22C5D9', '#F07B3F'];

const SPEC_CLASS: Record<string, string> = {
  Cardiology: 'cardio', Dermatology: 'derm', Neurology: 'neuro',
  'General Practice': 'general', Orthopedics: 'ortho', Pediatrics: 'pediatric', Oncology: 'oncology'
};
const name = document.querySelector('.name');
const adminAvtr = document.querySelector('.admin-avatar');
const topTitle = document.querySelector('.topbar-sub');
const topAvtr = document.querySelector('.top-avatar');
const totalDoctors = document.querySelector('.total-dc');
const totalActives = document.querySelector('.total-ac');
const totalInactives = document.querySelector('.total-inc');
// const totalAppointments = document.querySelector('.total-app');
const fullDate = String(new Date().toDateString()).split(' ');

const userData = await getUserData();
name!.textContent = userData.users[0].full_name;
topTitle!.textContent = `MediBook Admin Panel · ${fullDate.join(', ')}`;
topAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
adminAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();

const res = await fetch(`${apiUrl}/doctors`);
const data = await res.json();
const doctorsData = [...data.doctors];

console.log(data)
let filtered = [...data.doctors];
let currentPage = 1;
const PER_PAGE = 8;
let selectedIds = new Set<string>();
let deleteTargetId: string | null = null;
let sortKey: string | null = null, sortAsc = true;

totalDoctors!.textContent = String(filtered.length)
totalActives!.textContent = data.countActive;
totalInactives!.textContent = data.countInactive;

/* ─── RENDER TABLE ─── */
function renderTable() {
  const start = (currentPage - 1) * PER_PAGE;
  const slice = filtered.slice(start, start + PER_PAGE);
  const tbody = document.getElementById('table-body')!;

  if (slice.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:3rem;color:var(--text-3);">No doctors found matching your filters.</td></tr>`;
  } else {
    tbody.innerHTML = slice.map(d => {
      const specClass = SPEC_CLASS[d.specialization] || 'general';
      const statusClass = d.user?.status.toLowerCase();
      const stars = '★'.repeat(Math.round(4.9)) + '☆'.repeat(5 - Math.round(4.9));
      const isSelected = selectedIds.has(d.id);

      console.log(statusClass)

      return `<tr class="${isSelected ? 'selected' : ''}" onclick="handleRowClick(event,'${d.id}')">
        <td class="cb-wrap"><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleRow(event,'${d.id}')" onclick="event.stopPropagation()" style="width:16px;height:16px;accent-color:var(--teal-400);cursor:pointer;"></td>
        <td>
          <div class="doc-cell">
            <div class="doc-av" style="background:${COLORS[Math.floor(0 + Math.random() * 9)]}">${d.user?.full_name[0].toUpperCase()}</div>
            <div><div class="doc-name">${d.user?.full_name}</div><div class="doc-id">ID: ${d.id} · ${d.user?.email}</div></div>
          </div>
        </td>
        <td><span class="spec-badge ${specClass}">${d.specialization}</span></td>
        <td style="color:var(--text-2);font-size:13px;">${d.type}</td>
        <td><div class="rating-cell"><span class="stars">${stars}</span><span class="rating-val">4.9</span></div></td>
        <td style="color:var(--text-2);font-size:13px;">${strAge(d.createdAt)}</td>
        <td><span class="status-pill ${statusClass}">${d.user?.status}</span></td>
        <td>
          <div class="row-actions">
            <button class="row-btn del"  title="Delete" onclick="event.stopPropagation();openDeleteModal('${d.id}')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }
  // Soon
  // <button class="row-btn view" title="View" onclick="event.stopPropagation();openViewDrawer('${d.id}')"><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
  // <button class="row-btn edit" title="Edit" onclick="event.stopPropagation();openEditDrawer('${d.id}')"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
  const total = filtered.length;
  const s = (currentPage - 1) * PER_PAGE + 1;
  const e = Math.min(s + PER_PAGE - 1, total);
  document.getElementById('showing-count')!.textContent = total ? `${s}–${e}` : '0';
  document.getElementById('total-count')!.textContent = String(total);
  renderPagination();
}

function strAge(date: string) {
  let month = date.split('-').slice(0, 2);
  switch (month[1]) {
    case '01': return 'January, ' + month[0]
    case '02': return 'February, ' + month[0]
    case '03': return 'March, ' + month[0]
    case '04': return 'April, ' + month[0]
    case '05': return 'May, ' + month[0]
    case '06': return 'June, ' + month[0]
    case '07': return 'July, ' + month[0]
    case '08': return 'August, ' + month[0]
    case '09': return 'September, ' + month[0]
    case '10': return 'October, ' + month[0]
    case '11': return 'November, ' + month[0]
    case '12': return 'December, ' + month[0]

    default:
      return ''
  }
}

function renderPagination() {
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  let html = '';
  for (let i = 1; i <= Math.min(totalPages, 5); i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  document.getElementById('page-btns')!.innerHTML = html;
  (document.getElementById('prev-btn') as HTMLButtonElement).disabled = currentPage === 1;
  (document.getElementById('next-btn') as HTMLButtonElement).disabled = currentPage >= totalPages;
}

function goToPage(p: number) { currentPage = p; renderTable(); }
function changePage(d: number) { currentPage += d; renderTable(); }

/* ─── FILTER ─── */
function filterTable() {
  const q = (document.getElementById('search-input') as HTMLInputElement).value.toLowerCase();
  const spec = (document.getElementById('spec-filter') as HTMLSelectElement).value;
  const stat = (document.getElementById('status-filter') as HTMLSelectElement).value;
  const type = (document.getElementById('type-filter') as HTMLSelectElement).value;

  filtered = data.doctors.filter((d: any) => {
    const matchQ = !q || d.user.full_name.toLowerCase().includes(q) || d.user.email.toLowerCase().includes(q);
    const matchSpec = !spec || d.department === spec;
    const matchStat = !stat || d.status === stat;
    const matchType = !type || d.type === type;
    return matchQ && matchSpec && matchStat && matchType;
  });

  currentPage = 1;
  renderTable();
}

/* ─── SORT ─── */
function sortTable(key: string) {
  if (sortKey === key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = true; }
  document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted'));
  filtered.sort((a: any, b: any) => {
    let av = a[key], bv = b[key];
    if (typeof av === 'string') av = av.toLowerCase();
    if (typeof bv === 'string') bv = bv.toLowerCase();
    return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });
  renderTable();
}

/* ─── SELECT ─── */
function handleRowClick(e: MouseEvent, id: string) {
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button')) return;
  openViewDrawer(id);
}

function toggleRow(e: Event, id: string) {
  if ((e.target as HTMLInputElement).checked) selectedIds.add(id); else selectedIds.delete(id);
  updateBulkBar();
  renderTable();
}

function toggleSelectAll(cb: HTMLInputElement) {
  if (cb.checked) {
    const start = (currentPage - 1) * PER_PAGE;
    filtered.slice(start, start + PER_PAGE).forEach(d => selectedIds.add(d.id));
  } else {
    selectedIds.clear();
  }
  updateBulkBar();
  renderTable();
}

function updateBulkBar() {
  const bar = document.getElementById('bulk-actions')!;
  if (selectedIds.size > 0) {
    bar.classList.add('visible');
    document.getElementById('bulk-count')!.textContent = `${selectedIds.size} selected`;
  } else {
    bar.classList.remove('visible');
  }
}

function bulkAction(action: string) {
  showToast(`${selectedIds.size} doctor(s) ${action === 'delete' ? 'deleted' : 'deactivated'}.`, action === 'delete' ? 'error' : 'success');
  selectedIds.clear();
  updateBulkBar();
  renderTable();
}

/* ─── DRAWER ─── */
function openViewDrawer(id: string) {
  const d = doctorsData.find(x => x.id === id);
  if (!d) return;

  document.getElementById('drawer-title')!.textContent = 'Doctor Profile';
  document.getElementById('drawer-sub')!.textContent = 'View full doctor information';
  document.getElementById('drawer-save-btn')!.textContent = 'Edit Doctor';
  (document.getElementById('drawer-save-btn') as HTMLButtonElement).onclick = () => openEditDrawer(id);

  const specClass = SPEC_CLASS[d.department] || 'general';
  const statusClass = d.user.status.toLowerCase();

  document.getElementById('drawer-body')!.innerHTML = `
    <div class="drawer-doc-profile">
      <div class="drawer-av doc-av ${d.av}" style="width:56px;height:56px;font-size:18px;">${d.initials}</div>
      <div class="drawer-doc-info">
        <div class="d-name">${d.name}</div>
        <div class="d-spec">${d.specialty} · ${d.type}</div>
        <div class="d-tags">
          <span class="spec-badge ${specClass}">${d.specialty}</span>
          <span class="status-pill ${statusClass}">${d.status}</span>
        </div>
      </div>
    </div>
    <div class="info-section">
      <h4>Contact & Identity</h4>
      <div class="info-grid">
        <div class="info-item"><div class="i-label">Doctor ID</div><div class="i-val">${d.id}</div></div>
        <div class="info-item"><div class="i-label">Phone</div><div class="i-val">${d.phone}</div></div>
        <div class="info-item full"><div class="i-label">Email</div><div class="i-val">${d.email}</div></div>
      </div>
    </div>
    <div class="info-section">
      <h4>Clinical Details</h4>
      <div class="info-grid">
        <div class="info-item"><div class="i-label">Room / Office</div><div class="i-val">${d.room}</div></div>
        <div class="info-item"><div class="i-label">Joined</div><div class="i-val">${d.joined}</div></div>
        <div class="info-item"><div class="i-label">Patients</div><div class="i-val">${d.patients} active</div></div>
        <div class="info-item"><div class="i-label">Rating</div><div class="i-val">⭐ ${d.rating} / 5.0</div></div>
        <div class="info-item full"><div class="i-label">Schedule</div><div class="i-val">${d.schedule}</div></div>
      </div>
    </div>
    <div class="info-section">
      <h4>Biography</h4>
      <div class="info-item" style="grid-column:1/-1"><div class="i-val" style="font-weight:400;line-height:1.6;font-size:13px;color:var(--text-2);">${d.bio}</div></div>
    </div>`;

  document.getElementById('drawer-overlay')!.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openEditDrawer(id: string) {
  const d = doctorsData.find(x => x.id === id);
  if (!d) return;

  document.getElementById('drawer-title')!.textContent = 'Edit Doctor';
  document.getElementById('drawer-sub')!.textContent = `Editing ${d.user.full_name}`;
  document.getElementById('drawer-save-btn')!.textContent = 'Save Changes';
  (document.getElementById('drawer-save-btn') as HTMLButtonElement).onclick = saveEdit;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const selectedDays = d.schedule.replace('–', '-').split(/[,\-]/).map((s: string) => s.trim());

  document.getElementById('drawer-body')!.innerHTML = `
    <div class="form-fields-row">
      <div class="form-field"><label>First Name</label><input class="form-input" id="edit-fname" value="${d.name.split(' ').slice(1, 2).join('')}"></div>
      <div class="form-field"><label>Last Name</label><input class="form-input" id="edit-lname" value="${d.name.split(' ').slice(2).join(' ')}"></div>
    </div>
    <div class="form-field"><label>Email Address</label><input class="form-input" id="edit-email" type="email" value="${d.email}"></div>
    <div class="form-field"><label>Phone Number</label><input class="form-input" id="edit-phone" type="tel" value="${d.phone}"></div>
    <div class="form-fields-row">
      <div class="form-field"><label>Specialty</label><select class="form-input" id="edit-spec">${['Cardiology', 'Dermatology', 'Neurology', 'General Practice', 'Orthopedics', 'Pediatrics', 'Oncology'].map(s => `<option ${s === d.specialty ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
      <div class="form-field"><label>Employment Type</label><select class="form-input" id="edit-type">${['Full-time', 'Part-time', 'Consultant'].map(s => `<option ${s === d.type ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    </div>
    <div class="form-fields-row">
      <div class="form-field"><label>Room / Office</label><input class="form-input" id="edit-room" value="${d.room}"></div>
      <div class="form-field"><label>Status</label><select class="form-input" id="edit-status">${['Active', 'Inactive', 'Suspended'].map(s => `<option ${s === d.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    </div>
    <div class="form-field">
      <label>Working Days</label>
      <div class="days-row" id="days-row">
        ${days.map(day => `<div class="day-chip ${selectedDays.some((sd: string) => sd.includes(day)) ? 'selected' : ''}" onclick="toggleDay(this)">${day}</div>`).join('')}
        <div class="day-chip" onclick="toggleDay(this)">Sun</div>
      </div>
    </div>
    <div class="form-field"><label>Biography</label><textarea class="form-textarea" id="edit-bio">${d.bio}</textarea></div>`;

  document.getElementById('drawer-overlay')!.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openAddDrawer() {
  document.getElementById('drawer-title')!.textContent = 'Add New Doctor';
  document.getElementById('drawer-sub')!.textContent = "Fill in the doctor's information";
  document.getElementById('drawer-save-btn')!.textContent = 'Add Doctor';
  (document.getElementById('drawer-save-btn') as HTMLButtonElement).onclick = saveAdd;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  document.getElementById('drawer-body')!.innerHTML = `
    <div class="form-fields-row">
      <div class="form-field"><label>First Name</label><input class="form-input" id="add-fname" placeholder="John"></div>
      <div class="form-field"><label>Last Name</label><input class="form-input" id="add-lname" placeholder="Doe"></div>
    </div>
    <div class="form-field"><label>Email Address</label><input class="form-input" id="add-email" type="email" placeholder="john.doe@medibook.com"></div>
    <div class="form-field"><label>Phone Number</label><input class="form-input" id="add-phone" type="tel" placeholder="+1 555 000 0000"></div>
    <div class="form-field"><label>Password</label><input class="form-input" id="add-pass" type="password" placeholder="••••••••"></div>
    <div class="form-field"><label>Department</label><select class="form-input" id="add-depart"><option value="">Select department</option>${['Cardiology', 'Dermatology', 'Neurology', 'Surgery', 'General Practice', 'Orthopedics', 'Pediatrics', 'Oncology'].map(s => `<option>${s}</option>`).join('')}</select></div>
    <div class="form-fields-row">
      <div class="form-field"><label>Specialty</label><select class="form-input" id="add-spec"><option value="">Select specialty</option>${['Cardiologist', 'Dermatologist', 'Neurologist', 'General Practice', 'Orthopedic', 'Pediatrician', 'Oncologist'].map(s => `<option>${s}</option>`).join('')}</select></div>
      <div class="form-field"><label>Employment Type</label><select class="form-input" id="add-type"><option>Full-time</option><option>Part-time</option><option>Consultant</option></select></div>
    </div>
    <div class="form-fields-row">
      <div class="form-field"><label>Room / Office</label><input class="form-input" id="add-room" placeholder="e.g. 204"></div>
      <div class="form-field"><label>Experience</label><select class="form-input" id="add-experience"><option>No experience</option><option>2-6 months</option><option>6-12 months</option><option>1-4 year</option><option>5-10 year </option><option>10+ year</option></select></div>
    </div>
    <div class="form-field">
      <label>Working Days</label>
      <div class="days-row" id="days-row">${days.map(day => `<div class="day-chip" onclick="toggleDay(this)">${day}</div>`).join('')}</div>
    </div>
    <div class="form-field"><label>Biography</label><textarea class="form-textarea" id="add-bio" placeholder="Brief professional summary…"></textarea></div>`;

  document.getElementById('drawer-overlay')!.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function toggleDay(el: HTMLElement) { el.classList.toggle('selected'); }

function saveEdit() {
  showToast('Doctor updated successfully.', 'success');
  closeDrawer();
}

async function saveAdd() {
  let workDays = '';
  const fname = (document.getElementById('add-fname') as HTMLInputElement)?.value.trim();
  const lname = (document.getElementById('add-lname') as HTMLInputElement)?.value.trim();
  const email = (document.getElementById('add-email') as HTMLInputElement)?.value.trim();
  const phone = (document.getElementById('add-phone') as HTMLInputElement)?.value.trim();
  const pass = (document.getElementById('add-pass') as HTMLInputElement)?.value.trim();
  const experience = (document.getElementById('add-experience') as HTMLInputElement)?.value.trim();
  const department = (document.getElementById('add-depart') as HTMLInputElement)?.value.trim();
  const spec = (document.getElementById('add-spec') as HTMLInputElement)?.value.trim();
  const type = (document.getElementById('add-type') as HTMLInputElement)?.value.trim();
  const room = (document.getElementById('add-room') as HTMLInputElement)?.value.trim();
  const bio = (document.getElementById('add-bio') as HTMLInputElement)?.value.trim();
  document.querySelectorAll('.day-chip.selected').forEach(days => { workDays += days.textContent + ', ' });

  console.log(bio)
  console.log(type)

  if (!pass || pass.length < 8) {
    showToast('Password must be at least 8 characters.', 'error');
    return;

  }
  if (!fname || !lname || !email || !phone || !spec || !department || !type || !room || !bio || !workDays) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const fullName = fname + ' ' + lname;
  // Registration logic here

  const res1 = await fetch(`${apiUrl}/auth/register`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      full_name: fullName,
      age: null,
      email: email,
      password: pass,
      phone: phone,
      role: "Doctor"
    })
  })
  const response1 = await res1.json()

  if (!response1.success) {
    showToast(response1.message, 'error');
    return
  }

  const res2 = await fetch(`${apiUrl}/doctors`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      specialization: spec,
      department: department,
      experience: experience,
      bio: bio,
      type: type,
      room_number: room,
      user_id: response1.userId
    })
  })
  const response2 = await res2.json()

  if (!response2.success) {
    showToast(response2.message, 'error');
    return
  }
  setCookie("accessToken", response2?.accessToken);
  setCookie("refreshToken", response2?.refreshToken);

  showToast(`Dr. ${fname} ${lname} added successfully.`, 'success');
  closeDrawer();
}

function closeDrawer() {
  document.getElementById('drawer-overlay')!.classList.remove('open');
  document.body.style.overflow = '';
}

function handleDrawerOverlay(e: MouseEvent) {
  if (e.target === document.getElementById('drawer-overlay')) closeDrawer();
}

/* ─── DELETE MODAL ─── */
function openDeleteModal(id: string) {
  deleteTargetId = id;
  const d = doctorsData.find(x => x.id === id);
  document.getElementById('delete-name')!.textContent = d ? d.user.full_name : 'this doctor';
  document.getElementById('delete-modal')!.classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('delete-modal')!.classList.remove('open');
  deleteTargetId = null;
  setTimeout(() => {
    window.location.reload();
  }, 1700);
}

async function accessTelegram() {
  const userId = await cookieStore.get('userId');

  window.location.href = `https://t.me/medibook_clinic_bot?start=${userId?.value}`;
}

function handleDeleteOverlay(e: MouseEvent) {
  if (e.target === document.getElementById('delete-modal')) closeDeleteModal();
}

async function confirmDelete() {
  const d = doctorsData.find(x => x.id === deleteTargetId);
  showToast(`${d ? d.user.full_name : 'Doctor'} has been removed.`, 'error');
  const res = await fetch(`${apiUrl}/doctors/${deleteTargetId}`, {
    method: 'DELETE',
  })

  const response = await res.json();

  if (!response.success) {
    showToast(`${d ? d.user.full_name : 'Doctor'} has not been removed.`, 'error');

  }
  closeDeleteModal();
  renderTable();
}

const signOut = () => {
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('userId')
  cookieStore.delete('role')

  localStorage.clear()

  window.location.href = '/'
}

/* ─── TOAST ─── */
let toastTimer: ReturnType<typeof setTimeout>;
function showToast(msg: string, type = 'success') {
  const t = document.getElementById('toast')!;
  t.textContent = msg;
  t.className = `toast ${type}`;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ─── EXPOSE GLOBALS ─── */
(window as any).filterTable = filterTable;
(window as any).sortTable = sortTable;
(window as any).handleRowClick = handleRowClick;
(window as any).toggleRow = toggleRow;
(window as any).toggleSelectAll = toggleSelectAll;
(window as any).bulkAction = bulkAction;
(window as any).openViewDrawer = openViewDrawer;
(window as any).openEditDrawer = openEditDrawer;
(window as any).openAddDrawer = openAddDrawer;
(window as any).toggleDay = toggleDay;
(window as any).closeDrawer = closeDrawer;
(window as any).handleDrawerOverlay = handleDrawerOverlay;
(window as any).openDeleteModal = openDeleteModal;
(window as any).closeDeleteModal = closeDeleteModal;
(window as any).handleDeleteOverlay = handleDeleteOverlay;
(window as any).confirmDelete = confirmDelete;
(window as any).showToast = showToast;
(window as any).goToPage = goToPage;
(window as any).changePage = changePage;
(window as any).accessTelegram = accessTelegram;
(window as any).signOut = signOut;

/* ─── ESC ─── */
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') { closeDrawer(); closeDeleteModal(); }
});

/* ─── INIT ─── */
renderTable();
