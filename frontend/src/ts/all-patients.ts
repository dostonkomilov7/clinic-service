import { redirectIfNotAuth, getUserData } from "../main";
import { MediAlert } from "./alert";

redirectIfNotAuth();

async function check() {
    const ROLE = await cookieStore.get('role');
    if (ROLE?.value !== 'Doctor' && ROLE?.value !== 'Admin') {
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
    }
}

await check()

const COLORS = ['#1D9E75', '#378ADD', '#D85A30', '#EF9F27', '#8B7EF8', '#34C97A', '#E0608A', '#22C5D9', '#F07B3F'];
const apiUrl = import.meta.env.VITE_API_URL;

const userId = await cookieStore.get("userId");
const res = await fetch(`${apiUrl}/doctors/${userId?.value}`);
const data = await res.json();
const PATIENTS = [...data.doctors[0].appointments];

const doctorAvtr = document.querySelector('.doc-av-sm');
const name = document.querySelector('.nm');
const role = document.querySelector('.sp');
const topSub = document.querySelector('.topbar-sub');
const topAvtr = document.querySelector('.avatar-btn');

const fullDate = String(new Date().toDateString()).split(' ');

const userData = await getUserData();
name!.textContent = userData.users[0].full_name;
topAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
doctorAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
role!.textContent = `${userData.users[0]?.doctors[0].specialization} • Room: ${userData.users[0]?.doctors[0].room_number}`
topSub!.textContent = `Dr ${userData.users[0].full_name} • ${userData.users[0]?.doctors[0].department} • ${fullDate.join(", ")}`

const PER_PAGE: number = 8;
let currentPage: number = 1;
let filteredData = [...data.doctors[0].appointments];
let sortKey: string = 'name';
let sortAsc: boolean = true;
let currentView: 'table' | 'grid' = 'table';

// ── Utility ──
const riskClass = (r: string): string => ({ High: 'high', Medium: 'medium', Low: 'low', Stable: 'stable' }[r] || 'stable');
const statusClass = (s: string): string => ({ Active: 'active', Inactive: 'inactive', Critical: 'critical' }[s] || 'inactive');

const visitBar = (v: number): string => {
    const pct = Math.min(Math.round((v / 45) * 100), 100);
    return `<div class="visits-cell"><span style="font-size:13.5px;font-weight:500;min-width:22px;">${v}</span><div class="vis-bar"><div class="vis-fill" style="width:${pct}%"></div></div></div>`;
};

// ── Stats ──
function updateStats(): void {
    const total = filteredData.length;
    const active = filteredData.filter(p => p.user.status === 'Active').length;
    const critical = filteredData.filter(p => p.user.status === 'Inactive').length;
    const today = filteredData.filter(p => p.lastVisit === 'Today').length;

    animateCount('stat-total', total);
    animateCount('stat-active', active);
    animateCount('stat-critical', critical);
    animateCount('stat-today', today);
}

function animateCount(id: string, target: number): void {
    const el = document.getElementById(id);
    if (!el) return;
    let start = 0;
    const step = () => {
        start += Math.ceil((target - start) / 6);
        el.textContent = String(start);
        if (start < target) requestAnimationFrame(step);
        else el.textContent = String(target);
    };
    requestAnimationFrame(step);
}

// ── Filter & Sort ──
function applyFilters(): void {
    const q = (document.getElementById('search-input') as HTMLInputElement).value.toLowerCase();
    const riskF = (document.getElementById('risk-filter') as HTMLSelectElement).value;
    const statusF = (document.getElementById('status-filter') as HTMLSelectElement).value;
    const sortF = (document.getElementById('sort-filter') as HTMLSelectElement).value;

    filteredData = PATIENTS.filter(p => {
        const mq = !q || p.user.full_name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q);
        const mr = !riskF || 'Medium' === riskF;
        const ms = !statusF || p.user.status === statusF;
        return mq && mr && ms;
    });

    // Sort from dropdown
    const sortMap: Record<string, string> = { name: 'user.full_name', recent: 'appointment_date', risk: 'risk', visits: 'visits' };
    sortKey = sortMap[sortF] || 'user.full_name';

    filteredData.sort((a: any, b: any) => {
        let av = a[sortKey], bv = b[sortKey];
        if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
        return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

    currentPage = 1;
    render();
}

function sortBy(key: string): void {
    if (sortKey === key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = true; }
    document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted'));
    applyFilters();
}

// ── Render Table ──
function renderTable(): void {
    const tbody = document.getElementById('table-body')!;
    const empty = document.getElementById('empty-state')!;
    const tblWrap = document.getElementById('table-view')!;

    const start = (currentPage - 1) * PER_PAGE;
    const slice = data.doctors[0].appointments.slice(start, start + PER_PAGE);

    if (filteredData.length === 0) {
        tblWrap.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    tblWrap.style.display = '';

    tbody.innerHTML = slice.map((p: any, i: any) => `
    <tr style="animation-delay:${i * 0.04}s" onclick="openDrawer('${p.id}')">
      <td>
        <div class="pt-cell">
          <div class="pt-av" style="background:${COLORS[Math.floor(0 + Math.random() * 9)]}">${p.user.full_name[0].toUpperCase()}</div>
          <div>
            <div class="pt-name">${p.user.full_name}</div>
            <div class="pt-id">ID: ${p.user.id} · ${getAge(p.user.age)} y </div>
          </div>
        </div>
      </td>
      <td style="color:var(--gray-600);font-size:13px;">${getAge(p.user.age)}</td>
      <td style="font-size:13px;color:var(--gray-600);max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Problem related to ${userData.users[0]?.doctors[0].department}</td>
      <td style="font-size:13px;color:var(--gray-600);">${strMonth(p.appointment_date)} ${p.appointment_date.split('-').at(2)}</td>
      <td><span class="risk-pill ${riskClass('Medium')}">Medium</span></td>
      <td><span class="status-pill ${statusClass(p.user.status)}">${p.user.status}</span></td>
      <td><span class="status-pill ${p.status.toLowerCase()}">${p.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="row-btn view" title="View profile" onclick="event.stopPropagation();openDrawer('${p.id}')">
          <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="row-btn cancel" onclick="cancelAppointment('${p.id}', '${p.status}')">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </button>
          <button class="row-btn edit" onclick="updateAppointment('${p.id}', '${p.status}')">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');

    // Footer
    const total = filteredData.length;
    const s = start + 1, e = Math.min(start + PER_PAGE, total);
    document.getElementById('showing-info')!.textContent = `${s}–${e}`;
    document.getElementById('total-info')!.textContent = String(total);

    renderPagination();
}

// ── Render Grid ──
function renderGrid(): void {
    const grid = document.getElementById('grid-view')!;
    const empty = document.getElementById('empty-state')!;

    if (filteredData.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    grid.style.display = 'grid';

    const start = (currentPage - 1) * PER_PAGE;
    const slice = data.doctors[0].appointments.slice(start, start + PER_PAGE);

    grid.innerHTML = slice.map((p: any, i: any) => `
    <div class="patient-card" style="animation-delay:${i * 0.05}s" onclick="openDrawer('${p.id}')">
      <div class="pc-top">
        <div class="pc-av" style="background:${COLORS[Math.floor(0 + Math.random() * 9)]}">${p.user.full_name[0].toUpperCase()}</div>
        <span class="risk-pill ${riskClass('Medium')}">Medium</span>
      </div>
      <div class="pc-name">${p.user.full_name}</div>
      <div class="pc-id">ID: ${p.user.id} · ${getAge(p.user.age)} y</div>
      <div class="pc-divider"></div>
      <div class="pc-meta">
        <div class="pc-meta-item"><div class="pm-lbl">Condition</div><div class="pm-val" style="font-size:12px;">Problem related to ${userData.users[0]?.doctors[0].department}</div></div>
        <div class="pc-meta-item"><div class="pm-lbl">Status</div><div class="pm-val"><span class="status-pill ${statusClass(p.user.status)}" style="font-size:11px;">${p.user.status}</span></div></div>
        <div class="pc-meta-item"><div class="pm-lbl">Visit Date</div><div class="pm-val">${strMonth(p.appointment_date)} ${p.appointment_date.split('-').at(2)}</div></div>
      </div>
      <div class="pc-actions">
        <button class="pc-btn primary" onclick="event.stopPropagation();openDrawer('PT-2841')">View Profile</button>
      </div>
    </div>`).join('');
}

function getAge(age: string) {
    const userAge = new Date().getFullYear() - new Date(age).getFullYear()

    if (userAge < 1) {
        return '-'
    }
    return userAge
}

function strMonth(date: string) {
    const month = date.split('-').at(1);

    switch (month) {
        case '01': return 'January'
        case '02': return 'February'
        case '03': return 'March'
        case '04': return 'April'
        case '05': return 'May'
        case '06': return 'June'
        case '07': return 'July'
        case '08': return 'August'
        case '09': return 'September'
        case '10': return 'October'
        case '11': return 'November'
        case '12': return 'December'

        default:
            return ''
    }
}

// ── Pagination ──
function renderPagination(): void {
    const total = Math.ceil(filteredData.length / PER_PAGE);
    const container = document.getElementById('pagination')!;
    let html = `<button class="pg-btn" onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
  </button>`;
    for (let i = 1; i <= Math.min(total, 5); i++) {
        html += `<button class="pg-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    html += `<button class="pg-btn" onclick="changePage(1)" ${currentPage >= total ? 'disabled' : ''}>
    <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
  </button>`;
    container.innerHTML = html;
}

function goToPage(p: number): void { currentPage = p; render(); }
function changePage(d: number): void { currentPage += d; render(); }

// ── Render dispatcher ──
function render(): void {
    if (currentView === 'table') {
        document.getElementById('table-view')!.style.display = '';
        document.getElementById('grid-view')!.style.display = 'none';
        renderTable();
    } else {
        document.getElementById('table-view')!.style.display = 'none';
        document.getElementById('grid-view')!.style.display = 'grid';
        renderGrid();
    }
}

async function cancelAppointment(id: string, status: string) {
    if (status === 'Pending') {
        const res = await fetch(`${apiUrl}/appointments/${id}`, {
            method: 'DELETE',
        });

        const response = await res.json();

        if (!response.success) {
            return showToast(response.message, "info")
        }

        showToast(response.message, "info");
        window.location.reload()
    } else {
        return showToast('Only Pending status can be edited', "info")
    }
}

async function updateAppointment(id: string, status: string) {
    if (status === 'Completed') {
        return showToast('Appointment has been completed', "info")
    } else if (status === 'Cancelled') {
        return showToast('Appointment has been cancelled', "info")
    } else {
        const res = await fetch(`${apiUrl}/appointments/${id}`, {
            method: 'PATCH',
        });

        const response = await res.json();

        if (!response.success) {
            return showToast(response.message, "info")
        }

        showToast(response.message, "info")
        window.location.reload()
    }
}

// ── View toggle ──
function setView(v: 'table' | 'grid', btn: HTMLButtonElement): void {
    currentView = v;
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

const signOut = () => {
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    cookieStore.delete('userId')
    cookieStore.delete('role')

    localStorage.clear()

    window.location.href = '/'
}


// ── Drawer ──
// function openDrawer(id: string): void {
//     const p = PATIENTS.find(x => x.id === id);
//     if (!p) return;

//     document.getElementById('drawer-title')!.textContent = p.name;
//     document.getElementById('drawer-sub')!.textContent = `${p.id} · ${p.age}y · ${p.gender} · ${p.condition}`;

//     document.getElementById('drawer-body')!.innerHTML = `
//     <div class="pt-hero">
//     <div class="pt-hero-av" style="background:${p.color}">${p.initials}</div>
//     <div>
//     <div class="pt-hero-name">${p.name}</div>
//     <div class="pt-hero-sub">${p.id} · ${p.age} years · ${p.gender}</div>
//     <div class="pt-hero-tags">
//     <span class="risk-pill ${riskClass(p.risk)}">${p.risk} Risk</span>
//     <span class="status-pill ${statusClass(p.status)}">${p.status}</span>
//     </div>
//     </div>
//     </div>

//     <div class="kpi-row">
//     <div class="kpi-box"><div class="kv">${p.visits}</div><div class="kl">Total Visits</div></div>
//     <div class="kpi-box"><div class="kv">${p.lastVisit}</div><div class="kl">Last Visit</div></div>
//     <div class="kpi-box"><div class="kv">${p.nextAppt}</div><div class="kl">Next Appt</div></div>
//     </div>

//     <div class="info-section">
//     <h4>Contact & Identity</h4>
//     <div class="info-grid">
//     <div class="info-box"><div class="ib-lbl">Phone</div><div class="ib-val">${p.phone}</div></div>
//     <div class="info-box"><div class="ib-lbl">Blood Type</div><div class="ib-val">${p.bloodType}</div></div>
//     <div class="info-box full"><div class="ib-lbl">Email</div><div class="ib-val">${p.email}</div></div>
//     </div>
//     </div>

//     <div class="info-section">
//     <h4>Clinical Data</h4>
//     <div class="info-grid">
//     <div class="info-box"><div class="ib-lbl">Blood Pressure</div><div class="ib-val">${p.bp}</div></div>
//     <div class="info-box"><div class="ib-lbl">Weight</div><div class="ib-val">${p.weight}</div></div>
//     <div class="info-box"><div class="ib-lbl">Height</div><div class="ib-val">${p.height}</div></div>
//     <div class="info-box"><div class="ib-lbl">Allergies</div><div class="ib-val">${p.allergies}</div></div>
//     <div class="info-box full"><div class="ib-lbl">Primary Condition</div><div class="ib-val">${p.condition}</div></div>
//     </div>
//     </div>

//     <div class="info-section">
//     <h4>Doctor's Notes</h4>
//     <div class="info-box full" style="grid-column:1/-1;">
//     <div class="ib-val" style="font-weight:400;font-size:13px;color:var(--gray-600);line-height:1.65;">${p.notes}</div>
//     </div>
//     </div>

//     <div class="info-section">
//     <h4>Visit History (${p.history.length})</h4>
//     <div class="visit-list">
//     ${p.history.map(v => `
//         <div class="visit-item">
//         <div class="visit-dot" style="background:${v.status === 'upcoming' ? 'var(--blue-400)' : 'var(--teal-400)'}"></div>
//         <div style="flex:1;min-width:0;">
//         <div class="visit-date">${v.date}</div>
//         <div class="visit-type">${v.type}</div>
//         <div class="visit-note">${v.note}</div>
//         </div>
//         <span class="visit-tag ${v.status}">${v.status === 'done' ? 'Completed' : 'Upcoming'}</span>
//         </div>`).join('')}
//         </div>
//         </div>`;

//     document.getElementById('drawer-overlay')!.classList.add('open');
//     document.body.style.overflow = 'hidden';
// }

function closeDrawer(): void {
    document.getElementById('drawer-overlay')!.classList.remove('open');
    document.body.style.overflow = '';
}

function handleDrawerOverlay(e: MouseEvent): void {
    if (e.target === document.getElementById('drawer-overlay')) closeDrawer();
}

// ── Toast ──
let toastTimer: ReturnType<typeof setTimeout>;
function showToast(msg: string, type: 'success' | 'info' = 'success'): void {
    const t = document.getElementById('toast')!;
    t.textContent = msg;
    t.className = `toast ${type}`;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ── Event listeners ──
document.getElementById('search-input')!.addEventListener('input', applyFilters);
document.getElementById('risk-filter')!.addEventListener('change', applyFilters);
document.getElementById('status-filter')!.addEventListener('change', applyFilters);
document.getElementById('sort-filter')!.addEventListener('change', applyFilters);
document.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); });

// ── Init ──
updateStats();
applyFilters();

(window as any).riskClass = riskClass;
(window as any).statusClass = statusClass;
(window as any).visitBar = visitBar;
(window as any).animateCount = animateCount;
(window as any).sortBy = sortBy;
(window as any).renderTable = renderTable;
(window as any).renderGrid = renderGrid;
(window as any).renderPagination = renderPagination;
(window as any).goToPage = goToPage;
(window as any).changePage = changePage;
(window as any).render = render;
(window as any).setView = setView;
// (window as any).openDrawer = openDrawer;
(window as any).closeDrawer = closeDrawer;
(window as any).handleDrawerOverlay = handleDrawerOverlay;
(window as any).showToast = showToast;
(window as any).cancelAppointment = cancelAppointment;
(window as any).updateAppointment = updateAppointment;
(window as any).signOut = signOut;