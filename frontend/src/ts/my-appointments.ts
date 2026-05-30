import { redirectIfNotAuth, userData } from "../main";

// redirectIfNotAuth();

const apiUrl = import.meta.env.VITE_API_URL;
const appointmentsBox = document.getElementById('upcoming-grid')
const pastBox = document.getElementById('past-list')
const empty = document.getElementById('empty-state')!;

const upcomingVal = document.getElementById('upcoming-val')!;
const pendingVal = document.getElementById('pending-val')!;
const completedVal = document.getElementById('completed-val')!;
const cancelledVal = document.getElementById('cancelled-val')!;

const allCount = document.getElementById('all-count')!;
const upcomingCount = document.getElementById('upcoming-count')!;
const pendingCount = document.getElementById('pending-count')!;
const completedCount = document.getElementById('completed-count')!;
const cancelledCount = document.getElementById('cancelled-count')!;
const name = document.querySelector('.name');
const role = document.querySelector('.role');
const topAvtr = document.querySelector('.topbar-avatar');
const userAvtr = document.querySelector('.user-avatar');

name!.textContent = userData.users[0].full_name;
topAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
userAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
role!.textContent = `${userData.users[0].role === 'User' ? 'Patient' : userData.users[0].role} • ID #${userData.users[0].id}`

/* ── MODAL ── */
async function getDoctors() {
  const userId = await cookieStore.get("userId");

  const res = await fetch(`${apiUrl}/appointments/${userId?.value}`)
  const data = await res.json();
  console.log(data)

  allCount.textContent = data.appointments.count;
  upcomingVal.textContent = data.totalUpcoming;
  upcomingCount.textContent = data.totalUpcoming;
  pendingVal.textContent = data.totalPending;
  pendingCount.textContent = data.totalPending;
  completedVal.textContent = data.totalCompleted;
  completedCount.textContent = data.totalCompleted;
  cancelledVal.textContent = data.totalCancelled;
  cancelledCount.textContent = data.totalCancelled;

  if (data.appointments.count === 0) {
    empty.style.display = "block"
    return
  }

  data.appointments.rows.forEach((element: any) => {
    appointmentsBox!.innerHTML += `
        <div class="appt-card" data-status="${element.status.toLowerCase()}" data-doctor="Dr. ${element.doctor.user.full_name}" data-spec="${element.doctor.specialization}">
          <div class="appt-card-accent ${element.status === 'Pending' ? 'amber' : element.status === 'Confirmed' ? 'blue' : element.status === 'Completed' ? 'teal' : 'coral'}"></div>
          <div class="appt-card-body">
            <div class="appt-card-top">
              <div class="appt-doc-row">
                <div class="appt-doc-avatar b">${element.doctor.user.full_name[0]}</div>
                <div>
                  <div class="appt-doc-name">Dr. ${element.doctor.user.full_name}</div>
                  <div class="appt-doc-spec">${element.doctor.specialization}</div>
                </div>
              </div>
              <span class="status-pill ${element.status.toLowerCase()}">${element.status}</span>
            </div>
            <div class="appt-divider"></div>
            <div class="appt-meta-row">
              <div class="appt-meta-item">
                <div class="appt-meta-label">Date</div>
                <div class="appt-meta-val">${strMonth(element.appointment_date)} ${element.appointment_date.split('-').at(-1)}</div>
                <div class="appt-meta-sub">${element.appointment_date.split('-').at(0)}</div>
              </div>
              <div class="appt-meta-item">
                <div class="appt-meta-label">Time</div>
                <div class="appt-meta-val">${element.appointment_time}</div>
                <div class="appt-meta-sub">40 min</div>
              </div>
              <div class="appt-meta-item">
                <div class="appt-meta-label">Type</div>
                <div class="appt-meta-val">
                  <div class="type-chip in-person">
                    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    In-person
                  </div>
                </div>
              </div>
            </div>
            <div class="appt-notes">Room ${element.doctor.room_number}, ${element.doctor.department} Building. Arrive 15-20 minutes early for intake forms.</div>
            <div class="appt-card-actions">
              <a href="https://yandex.com/maps/org/128432379794?si=bqu23pfhxug13nx3h684jedtp0">
                <button class="card-btn primary">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Directions
                </button>
              </a>
              <button class="card-btn danger" onclick="cancelAppointment()">
                <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
    `
    pastBox!.innerHTML += `
        <div class="past-item" data-status="${element.status.toLowerCase()}" data-doctor="Dr. ${element.doctor.user.full_name}" data-spec="${element.doctor.specialization}">
          <div class="past-date-box"><div class="day">${element.appointment_date.split('-').at(-1)}</div><div class="mon">${strMonth(element.appointment_date)}</div></div>
          <div class="past-doc-row">
            <div class="past-doc-avatar d">${element.doctor.user.full_name[0]}</div>
            <div>
              <div class="past-doc-name">Dr. ${element.doctor.user.full_name}</div>
              <div class="past-doc-spec">${element.status} · ${element.appointment_time} · 40 min</div>
            </div>
          </div>
          <div class="past-tags">
            <span class="past-type in-person">In-person</span>
            <span class="status-pill ${element.status.toLowerCase()}">${element.status}</span>
          </div>
        </div>
    `
  });

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

// function openModal() {
//   document.getElementById('modal-overlay')!.classList.add('open');
//   document.body.style.overflow = 'hidden';
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   (document.getElementById('modal-date') as HTMLInputElement).value = tomorrow.toISOString().split('T')[0];
// }

function closeModal() {
  document.getElementById('modal-overlay')!.classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function submitBooking() {
  closeModal();
  const toast = document.createElement('div');
  toast.textContent = '✓ Appointment request sent successfully';
  Object.assign(toast.style, {
    position: 'fixed', bottom: '2rem', right: '2rem', zIndex: '9999',
    background: 'var(--teal-600)', color: '#fff',
    padding: '14px 22px', borderRadius: '10px',
    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: '500',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    transition: 'opacity 0.4s', opacity: '1'
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3000);
}

/* ── TAB FILTERING ── */
let currentTab = 'all';

function filterTab(btn: HTMLElement, tab: string) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentTab = tab;
  applyFilters();
}

function applyFilters() {
  const upcomingCards = document.querySelectorAll<HTMLElement>('#upcoming-grid .appt-card');
  const pastItems = document.querySelectorAll<HTMLElement>('#past-list .past-item');

  let upcomingVisible = 0, pastVisible = 0;

  upcomingCards.forEach(card => {
    const status = card.dataset.status;
    const show = currentTab === 'all' || currentTab === status ||
      (currentTab === 'upcoming' && status === 'upcoming') ||
      (currentTab === 'pending' && status === 'pending');
    card.style.display = show ? '' : 'none';
    if (show) upcomingVisible++;
  });

  pastItems.forEach(item => {
    const status = item.dataset.status;
    const show = currentTab === 'all' || currentTab === status;
    item.style.display = show ? '' : 'none';
    if (show) pastVisible++;
  });

  const upcomingSection = document.getElementById('upcoming-section')!;
  const pastSection = document.getElementById('past-section')!;
  // const banner = document.getElementById('next-banner')!;
  const empty = document.getElementById('empty-state')!;

  upcomingSection.style.display = (currentTab === 'completed' || currentTab === 'cancelled') ? 'none' : '';
  pastSection.style.display = (currentTab === 'upcoming' || currentTab === 'pending') ? 'none' : '';
  // banner.style.display = (currentTab === 'completed' || currentTab === 'cancelled') ? 'none' : '';
  empty.style.display = (upcomingVisible + pastVisible) === 0 ? 'block' : 'none';
}

/* ── SEARCH ── */
function handleSearch(query: string) {
  const q = query.toLowerCase();
  document.querySelectorAll<HTMLElement>('.appt-card, .past-item').forEach(el => {
    const doctor = el.dataset.doctor?.toLowerCase() ?? '';
    const spec = el.dataset.spec?.toLowerCase() ?? '';
    el.style.display = (!q || doctor.includes(q) || spec.includes(q)) ? '' : 'none';
  });
}

/* ── VIEW TOGGLE ── */
function setView(view: string, btn: HTMLElement) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('upcoming-grid') as HTMLElement;
  grid.style.gridTemplateColumns = view === 'list' ? '1fr' : '';
}

/* ── SORT ── */
function filterSort(_val: string) {
  // placeholder — in production would re-order the DOM or re-fetch
}

const signOut = () => {
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('userId')
  cookieStore.delete('role')

  localStorage.clear()

  window.location.href = '/'
}

/* ── EXPOSE GLOBALS ── */
// (window as any).openModal = openModal;
(window as any).closeModal = closeModal;
(window as any).handleOverlayClick = handleOverlayClick;
(window as any).submitBooking = submitBooking;
(window as any).filterTab = filterTab;
(window as any).handleSearch = handleSearch;
(window as any).setView = setView;
(window as any).filterSort = filterSort;
(window as any).signOut = signOut;
getDoctors()

/* ── ESC ── */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
