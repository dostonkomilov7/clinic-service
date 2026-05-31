import { redirectIfNotAuth } from "../main";
import { MediAlert } from "./alert";

redirectIfNotAuth();

async function check() {
    const ROLE = await cookieStore.get('role');
    if (ROLE?.value !== 'Admin' && ROLE?.value !== 'Doctor') {
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

type ApptType = 'in-person' | 'virtual';
type ApptTag = '' | 'followup' | 'new-pt' | 'urgent';
type ApptStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

interface Appointment {
    id: string;
    date: string;        // YYYY-MM-DD
    time: string;        // HH:MM (24h)
    name: string;
    reason: string;
    type: ApptType;
    tag: ApptTag;
    status: ApptStatus;
}

type Filter = 'all' | 'in-person' | 'virtual' | 'urgent';

// ── State ──
const todayISO = (): string => new Date().toISOString().slice(0, 10);

let currentDate: string = todayISO();
let activeFilter: Filter = 'all';
let searchTerm = '';
let editingId: string | null = null;

const seed = (): Appointment[] => {
    const d = todayISO();
    return [
        { id: 'a1', date: d, time: '09:00', name: 'James Mitchell', reason: 'Cardiac follow-up · ID #2841', type: 'in-person', tag: 'followup', status: 'completed' },
        { id: 'a2', date: d, time: '10:30', name: 'Priya Sharma', reason: 'Echocardiogram review · ID #3102', type: 'virtual', tag: 'new-pt', status: 'confirmed' },
        { id: 'a3', date: d, time: '13:00', name: 'Robert Chen', reason: 'Arrhythmia consult · ID #1975', type: 'in-person', tag: 'urgent', status: 'pending' },
        { id: 'a4', date: d, time: '14:30', name: 'Linda Park', reason: 'Hypertension management · ID #4417', type: 'virtual', tag: 'followup', status: 'confirmed' },
        { id: 'a5', date: d, time: '16:00', name: 'Mark Thompson', reason: 'Annual cardiac checkup · ID #3889', type: 'in-person', tag: '', status: 'confirmed' },
    ];
};

let appts: Appointment[] = seed();

// ── DOM ──
const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

const list = $<HTMLDivElement>('scheduleList');
const emptyState = $<HTMLDivElement>('emptyState');
const dayLabel = $<HTMLParagraphElement>('dayLabel');
const dateLabel = $<HTMLParagraphElement>('dateLabel');
const modal = $<HTMLDivElement>('modal');
const modalTitle = $<HTMLHeadingElement>('modalTitle');

const dotColor: Record<ApptType, string> = { 'in-person': 'blue', virtual: 'teal' };

// ── Date helpers ──
const shiftDay = (delta: number): void => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + delta);
    currentDate = d.toISOString().slice(0, 10);
    render();
};

const formatLabels = (): void => {
    const d = new Date(currentDate + 'T00:00:00');
    dayLabel.textContent = d.toLocaleDateString('en-US', { weekday: 'long' });
    dateLabel.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const to12h = (t: string): { hour: string; min: string } => {
    const [hStr, m] = t.split(':');
    let h = parseInt(hStr, 10);
    const ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return { hour: `${h}:${m}`, min: ap };
};

// ── Filtering ──
const visibleAppts = (): Appointment[] =>
    appts
        .filter(a => a.date === currentDate)
        .filter(a => {
            if (activeFilter === 'all') return true;
            if (activeFilter === 'urgent') return a.tag === 'urgent';
            return a.type === activeFilter;
        })
        .filter(a => {
            if (!searchTerm) return true;
            const s = searchTerm.toLowerCase();
            return a.name.toLowerCase().includes(s) || a.reason.toLowerCase().includes(s);
        })
        .sort((a, b) => a.time.localeCompare(b.time));

// ── Render ──
const tagHtml = (a: Appointment): string => {
    const tags: string[] = [];
    tags.push(`<span class="tag ${a.type === 'virtual' ? 'virtual' : 'in-person'}">${a.type === 'virtual' ? 'Virtual' : 'In-person'}</span>`);
    const tagMap: Record<Exclude<ApptTag, ''>, string> = {
        followup: '<span class="tag followup">Follow-up</span>',
        'new-pt': '<span class="tag new-pt">New Patient</span>',
        urgent: '<span class="tag urgent">Urgent</span>',
    };
    if (a.tag) tags.push(tagMap[a.tag]);
    return tags.join('');
};

const render = (): void => {
    formatLabels();
    const items = visibleAppts();

    list.innerHTML = items.map((a, i) => {
        const { hour, min } = to12h(a.time);
        const tail = i < items.length - 1 ? '<div class="timeline-tail"></div>' : '';
        return `
      <div class="schedule-item" data-id="${a.id}">
        <div class="schedule-time"><div class="hour">${hour}</div><div class="min">${min}</div></div>
        <div class="schedule-line"><div class="timeline-dot ${dotColor[a.type]}"></div>${tail}</div>
        <div class="schedule-body">
          <div class="appt-name">${escapeHtml(a.name)}</div>
          <div class="appt-sub">${escapeHtml(a.reason)}</div>
          <div class="appt-tags">${tagHtml(a)}</div>
        </div>
        <div class="schedule-actions-group">
          <button class="schedule-action edit" data-edit="${a.id}">Edit</button>
          <button class="schedule-action" data-del="${a.id}">Remove</button>
        </div>
      </div>`;
    }).join('');

    emptyState.hidden = items.length !== 0;
    updateStats();
};

const updateStats = (): void => {
    const day = appts.filter(a => a.date === currentDate && a.status !== 'cancelled');
    $('statTotal').textContent = String(day.length);
    $('statVirtual').textContent = String(day.filter(a => a.type === 'virtual').length);
    $('statUrgent').textContent = String(day.filter(a => a.tag === 'urgent').length);
    $('statFree').textContent = String(Math.max(0, 8 - day.length));
};

const escapeHtml = (s: string): string =>
    s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

// ── Modal ──
const openModal = (id?: string): void => {
    editingId = id ?? null;
    modalTitle.textContent = id ? 'Edit Appointment' : 'New Appointment';
    $('deleteBtn').style.display = id ? 'block' : 'none';

    const a = id ? appts.find(x => x.id === id) : undefined;
    $<HTMLInputElement>('fName').value = a?.name ?? '';
    $<HTMLInputElement>('fReason').value = a?.reason ?? '';
    $<HTMLInputElement>('fTime').value = a?.time ?? '09:00';
    $<HTMLSelectElement>('fType').value = a?.type ?? 'in-person';
    $<HTMLSelectElement>('fTag').value = a?.tag ?? '';
    $<HTMLSelectElement>('fStatus').value = a?.status ?? 'confirmed';

    modal.hidden = false;
};

const closeModal = (): void => { modal.hidden = true; editingId = null; };

const save = (): void => {
    const name = $<HTMLInputElement>('fName').value.trim();
    if (!name) { $<HTMLInputElement>('fName').focus(); return; }

    const data: Omit<Appointment, 'id' | 'date'> = {
        name,
        reason: $<HTMLInputElement>('fReason').value.trim() || 'General consultation',
        time: $<HTMLInputElement>('fTime').value,
        type: $<HTMLSelectElement>('fType').value as ApptType,
        tag: $<HTMLSelectElement>('fTag').value as ApptTag,
        status: $<HTMLSelectElement>('fStatus').value as ApptStatus,
    };

    if (editingId) {
        appts = appts.map(a => a.id === editingId ? { ...a, ...data } : a);
    } else {
        appts.push({ id: `a${Date.now()}`, date: currentDate, ...data });
    }
    closeModal();
    render();
};

const remove = (id: string): void => {
    appts = appts.filter(a => a.id !== id);
    render();
};

// ── Events ──
$('prevDay').addEventListener('click', () => shiftDay(-1));
$('nextDay').addEventListener('click', () => shiftDay(1));
$('todayBtn').addEventListener('click', () => { currentDate = todayISO(); render(); });

$('addBtn').addEventListener('click', () => openModal());
$('emptyAdd').addEventListener('click', () => openModal());
$('modalClose').addEventListener('click', closeModal);
$('cancelBtn').addEventListener('click', closeModal);
$('saveBtn').addEventListener('click', save);
$('deleteBtn').addEventListener('click', () => { if (editingId) { remove(editingId); closeModal(); } });

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

$('searchInput').addEventListener('input', e => {
    searchTerm = (e.target as HTMLInputElement).value;
    render();
});

$('filterChips').addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('.chip') as HTMLButtonElement | null;
    if (!btn) return;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter as Filter;
    render();
});

$('clearDay').addEventListener('click', e => {
    e.preventDefault();
    activeFilter = 'all';
    searchTerm = '';
    $<HTMLInputElement>('searchInput').value = '';
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', (c as HTMLElement).dataset.filter === 'all'));
    render();
});

// Delegated edit/remove on list
list.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    const editId = t.dataset.edit;
    const delId = t.dataset.del;
    if (editId) { openModal(editId); return; }
    if (delId) { remove(delId); return; }
    const item = t.closest('.schedule-item') as HTMLElement | null;
    if (item?.dataset.id) openModal(item.dataset.id);
});

// init
render();

// (window as any).signOut = signOut;
(window as any).seed = seed;
(window as any).formatLabels = formatLabels;
(window as any).shiftDay = shiftDay;
(window as any).to12h = to12h;
(window as any).visibleAppts = visibleAppts;
(window as any).tagHtml = tagHtml;
(window as any).updateStats = updateStats;
(window as any).escapeHtml = escapeHtml;
(window as any).openModal = openModal;
(window as any).save = save;
(window as any).remove = remove;
(window as any).closeModal = closeModal;