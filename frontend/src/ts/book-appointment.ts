import { redirectIfNotAuth } from "../main";
import { MediAlert } from "./alert";

redirectIfNotAuth()

async function check() {
    const ROLE = await cookieStore.get('role');
    if (ROLE?.value !== 'User' && ROLE?.value !== 'Admin') {
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

// ── Types ──────────────────────────────────────────
interface DoctorData {
  id: string;
  full_name: string;
  specialization: string;
  rating: string;
  avatar: string;
  avatarClass: string;
  location: string;
}

interface BookingState {
  doctor: DoctorData | null;
  date: string | null;
  time: string | null;
  visitType: 'Virtual' | 'In-Person';
  reason: string;
  notes: string;
  urgency: string;
}

// ── State ──────────────────────────────────────────
const state: BookingState = {
  doctor: null,
  date: null,
  time: null,
  visitType: 'In-Person',
  reason: 'For some reasons',
  notes: '',
  urgency: '',
};
const apiUrl = import.meta.env.VITE_API_URL;

let currentStep = 1;
let calYear = 2026;
let calMonth = 4; // 0-indexed: May = 4

const res = await fetch(`${apiUrl}/doctors`);

const data = await res.json();
// const doctors: Record<string, DoctorData> = {
//   '1': { id: '1', name: 'Dr. Sarah Rahman', specialty: 'Cardiologist', rating: '4.9', avatar: 'SR', avatarClass: 'a', location: 'St. Mary\'s Hospital (Virtual)' },
//   '2': { id: '2', name: 'Dr. Michael Kim', specialty: 'Dermatologist', rating: '4.7', avatar: 'MK', avatarClass: 'b', location: 'City Dermatology Clinic' },
//   '3': { id: '3', name: 'Dr. Ayesha Patel', specialty: 'Neurologist', rating: '4.8', avatar: 'AP', avatarClass: 'c', location: 'Neuro Health Center' },
//   '4': { id: '4', name: 'Dr. Thomas Nguyen', specialty: 'General Practitioner', rating: '4.6', avatar: 'TN', avatarClass: 'd', location: 'Downtown Medical (Virtual)' },
//   '5': { id: '5', name: 'Dr. Laura Beckett', specialty: 'Orthopedic Surgeon', rating: '4.9', avatar: 'LB', avatarClass: 'e', location: 'Orthopedic Specialists' },
//   '6': { id: '6', name: 'Dr. Robert Osei', specialty: 'Cardiologist', rating: '4.5', avatar: 'RO', avatarClass: 'f', location: 'Cardiac Care Center (Virtual)' },
// };

// Available time slots (random availability simulation per day)
const allSlots = ['8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

function getDoctors() {
  const doctorsBox = document.getElementById('doctorGrid') as HTMLElement

  data.doctors.forEach((element: any) => {
    doctorsBox.insertAdjacentHTML("beforeend", `
    <div class="doctor-card" data-specialty="${element.department}" data-id="1">
        <div class="doc-card-header">
            <div class="doc-card-avatar a">${element.user.full_name[0]}</div>
            <div class="doc-card-info">
                <div class="doc-card-name">Dr. ${element.user.full_name}</div>
                <div class="doc-card-spec">${element.specialization}</div>
                <div class="doc-card-rating">
                    <svg viewBox="0 0 24 24">
                        <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    4.9 <span>· 142 reviews</span>
                </div>
            </div>
            <span class="doc-card-badge my-doctor">My Doctor</span>
        </div>
        <div class="doc-card-meta">
            <span>
                <svg viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                St. Mary's Hospital
            </span>
        </div>
        <button class="select-doc-btn" data-id="${element.id}">Select Doctor</button>
    </div>
    `)
  });
}


function getSlotsForDate(dateStr: string): { time: string; available: boolean }[] {
  // Deterministic pseudo-random based on date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) hash = (hash * 31 + dateStr.charCodeAt(i)) & 0xffff;
  return allSlots.map((t, i) => ({ time: t, available: !((hash >> (i % 14)) & 1) || i % 5 !== 0 }));
}

// ── Step navigation ──────────────────────────────────
function goToStep(n: number): void {
  document.getElementById(`step-${currentStep}`)?.classList.remove('active');
  if (n > 4) {
    document.getElementById('step-success')!.classList.add('active');
    updateStepBar(5);
    return;
  }
  currentStep = n;
  document.getElementById(`step-${n}`)?.classList.add('active');
  updateStepBar(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepBar(active: number): void {
  document.querySelectorAll<HTMLElement>('.step').forEach(el => {
    const n = parseInt(el.dataset.step ?? '0');
    el.classList.remove('active', 'completed');
    if (n === active) el.classList.add('active');
    else if (n < active) el.classList.add('completed');
  });
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('completed', i + 1 < active);
  });
}

// ── Step 1: Doctor selection ──────────────────────────
function initStep1(): void {
  // Filter chips
  document.getElementById('specialtyFilter')!.addEventListener('click', (e) => {
    const chip = (e.target as HTMLElement).closest<HTMLElement>('.chip');
    if (!chip) return;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter!;
    document.querySelectorAll<HTMLElement>('.doctor-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.specialty?.toLowerCase() === filter) ? '' : 'none';
    });
  });

  // Doctor search
  document.getElementById('doctorSearch')!.addEventListener('input', (e) => {
    const q = (e.target as HTMLInputElement).value.toLowerCase();
    document.querySelectorAll<HTMLElement>('.doctor-card').forEach(card => {
      const name = card.querySelector('.doc-card-name')?.textContent?.toLowerCase() ?? '';
      const spec = card.querySelector('.doc-card-spec')?.textContent?.toLowerCase() ?? '';
      card.style.display = (name.includes(q) || spec.includes(q)) ? '' : 'none';
    });
  });

  // Select doctor buttons — event delegation
  document.getElementById('doctorGrid')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.select-doc-btn');
    if (!btn) return;
    const id = btn.dataset.id!;
    document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
    btn.closest('.doctor-card')!.classList.add('selected');
    const found = data.doctors.find((d: any) => String(d.id) === id);
    if (found) state.doctor = {
      id: String(found.id),
      full_name: `Dr. ${found.user.full_name}`,
      specialization: found.specialization,
      rating: '4.9',
      avatar: found.user.full_name[0],
      avatarClass: 'a',
      location: found.department ?? '',
    };

    (document.getElementById('step1Next') as HTMLButtonElement).disabled = false;
  });

  document.getElementById('step1Next')!.addEventListener('click', () => goToStep(2));
}

// ── Step 2: Calendar & Time ──────────────────────────
function initStep2(): void {
  renderCalendar();

  document.getElementById('prevMonth')!.addEventListener('click', () => {
    calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });
  document.getElementById('nextMonth')!.addEventListener('click', () => {
    calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });

  document.querySelectorAll('.visit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.visit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.visitType = (btn as HTMLElement).dataset.type === 'virtual' ? 'Virtual' : 'In-Person';
      if (state.date) renderTimeSlots(state.date);
    });
  });

  document.getElementById('step2Back')!.addEventListener('click', () => goToStep(1));
  document.getElementById('step2Next')!.addEventListener('click', () => { populateSummary(); goToStep(3); });
}

function renderCalendar(): void {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('calMonthLabel')!.textContent = `${monthNames[calMonth]} ${calYear}`;

  const grid = document.getElementById('calendarGrid')!;
  grid.innerHTML = '';

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    const thisDate = new Date(calYear, calMonth, d);
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();

    el.className = `cal-day${isPast ? ' past' : ''}${isToday ? ' today' : ''}`;
    if (state.date === dateStr) el.classList.add('selected');
    el.textContent = String(d);

    if (!isPast) {
      el.classList.add('has-slots');
      el.addEventListener('click', () => selectDate(dateStr, el));
    }
    grid.appendChild(el);
  }
}

function selectDate(dateStr: string, el: HTMLElement): void {
  document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.date = dateStr;
  state.time = null;
  (document.getElementById('step2Next') as HTMLButtonElement).disabled = true;

  const d = new Date(dateStr + 'T00:00:00');
  const label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  document.getElementById('selectedDateLabel')!.textContent = label;
  renderTimeSlots(dateStr);
}

function renderTimeSlots(dateStr: string): void {
  const grid = document.getElementById('timeslotGrid')!;
  const slots = getSlotsForDate(dateStr + state.visitType);
  grid.innerHTML = '';
  slots.forEach(slot => {
    const btn = document.createElement('button');
    btn.className = `time-slot${!slot.available ? ' unavailable' : ''}`;
    btn.textContent = slot.time;
    if (!slot.available) btn.disabled = true;
    else btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      btn.classList.add('selected');
      state.time = slot.time;
      (document.getElementById('step2Next') as HTMLButtonElement).disabled = false;
    });
    grid.appendChild(btn);
  });
}

// ── Step 3: Details ──────────────────────────────────
function initStep3(): void {
  document.getElementById('visitReason')!.addEventListener('change', (e) => {
    state.reason = (e.target as HTMLSelectElement).value;
  });
  document.getElementById('symptomsNote')!.addEventListener('input', (e) => {
    state.notes = (e.target as HTMLTextAreaElement).value;
  });

  document.getElementById('urgencyButtons')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('.urgency-btn');
    if (!btn) return;
    document.querySelectorAll('.urgency-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.urgency = btn.dataset.urgency!;
  });

  // File upload
  const zone = document.getElementById('uploadZone')!;
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  zone.addEventListener('click', () => fileInput.click());
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.style.borderColor = 'var(--teal)'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
  zone.addEventListener('drop', (e) => {
    e.preventDefault(); zone.style.borderColor = '';
    if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => { if (fileInput.files) addFiles(fileInput.files); });

  document.getElementById('step3Back')!.addEventListener('click', () => goToStep(2));
  document.getElementById('step3Next')!.addEventListener('click', () => { populateConfirm(); goToStep(4); });
}

function addFiles(files: FileList): void {
  const list = document.getElementById('fileList')!;
  Array.from(files).forEach(f => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke-width="2" stroke-linecap="round"/><polyline points="14 2 14 8 20 8" stroke-width="2" stroke-linecap="round"/></svg><span>${f.name}</span><button onclick="this.parentElement.remove()">×</button>`;
    list.appendChild(item);
  });
}

function populateSummary(): void {
  if (!state.doctor || !state.date || !state.time) return;
  document.getElementById('sum-doctor')!.textContent = state.doctor.full_name;
  document.getElementById('sum-spec')!.textContent = state.doctor.specialization;
  const d = new Date(state.date + 'T00:00:00');
  document.getElementById('sum-date')!.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('sum-time')!.textContent = state.time;
  document.getElementById('sum-type')!.textContent = state.visitType;
}

// ── Step 4: Confirm ──────────────────────────────────
function initStep4(): void {
  document.getElementById('consentCheck')!.addEventListener('change', (e) => {
    (document.getElementById('confirmBtn') as HTMLButtonElement).disabled = !(e.target as HTMLInputElement).checked;
  });
  document.getElementById('step4Back')!.addEventListener('click', () => goToStep(3));
  document.getElementById('confirmBtn')!.addEventListener('click', () => {
    submitBooking();
  });
}

function populateConfirm(): void {
  if (!state.doctor || !state.date || !state.time) return;
  const doc = state.doctor;

  (document.getElementById('conf-avatar') as HTMLElement).textContent = doc.avatar;
  (document.getElementById('conf-avatar') as HTMLElement).className = `confirm-doc-avatar ${doc.avatarClass}`;
  document.getElementById('conf-name')!.textContent = doc.full_name;
  document.getElementById('conf-spec')!.textContent = doc.specialization;
  document.getElementById('conf-rating')!.textContent = doc.rating;

  const d = new Date(state.date + 'T00:00:00');
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  document.getElementById('conf-datetime')!.textContent = `${dateStr} at ${state.time}`;
  document.getElementById('conf-type')!.textContent = state.visitType;
  document.getElementById('conf-reason')!.textContent = state.reason || 'Not specified';
  document.getElementById('conf-location')!.textContent = doc.location;

  const notesEl = document.getElementById('conf-notes')!;
  notesEl.textContent = state.notes || 'No additional notes provided.';
}

async function submitBooking() {
  const btn = document.getElementById('confirmBtn') as HTMLButtonElement;
  const originalHTML = btn.innerHTML;
  btn.disabled = true;

  const userId = await cookieStore.get("userId")

  const res = await fetch(`${apiUrl}/appointments`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      doctor_id: state.doctor?.id,
      patient_id: userId?.value,
      appointment_date: state.date,
      appointment_time: state.time,
    })
  })

  const response = await res.json();

  if (!response.success) {
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    throw Error(response.message)
  }

  setTimeout(() => {
    const ref = `MB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById('bookingRef')!.textContent = ref;
    goToStep(5);
  }, 1200);
}

const signOut = () => {
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('userId')
  cookieStore.delete('role')

  localStorage.clear()

  window.location.href = '/'
}

// ── Init ─────────────────────────────────────────────
getDoctors();
initStep1();
initStep2();
initStep3();
initStep4();
updateStepBar(1);

(window as any).signOut = signOut;