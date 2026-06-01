// import { redirectIfAuth } from "../main";

const apiUrl = import.meta.env.VITE_API_URL;

// redirectIfAuth()

const SPECIALTIES = [
    { id: 'Cardiologist', name: 'Cardiologist', icon: 'heart', color: '#D85A30', bg: '#FAECE7' },
    { id: 'Neurologist', name: 'Neurologist', icon: 'brain', color: '#8B7EF8', bg: '#EEEDFE' },
    { id: 'Dermatologist', name: 'Dermatologist', icon: 'skin', color: '#378ADD', bg: '#E6F1FB' },
    { id: 'General', name: 'General Practice', icon: 'steth', color: '#EF9F27', bg: '#FAEEDA' },
    { id: 'Orthopedician', name: 'Orthopedician', icon: 'bone', color: '#34C97A', bg: '#E3F8EC' },
    { id: 'Pediatrician', name: 'Pediatrician', icon: 'child', color: '#22C5D9', bg: '#E0F9FC' },
    { id: 'Oncologist', name: 'Oncologist', icon: 'cell', color: '#E0608A', bg: '#FAECF2' },
    { id: 'Emergency', name: 'Emergency', icon: 'bolt', color: '#F07B3F', bg: '#FFF0E6' },
    { id: 'Radiologist', name: 'Radiologist', icon: 'scan', color: '#888780', bg: '#F7F6F2' },
];

const SPEC_ICONS: Record<string, string> = {
    heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    brain: `<svg viewBox="0 0 24 24"><path d="M9.5 2a2.5 2.5 0 015 0v1a2.5 2.5 0 01-5 0V2zM7 12v6a2 2 0 002 2h6a2 2 0 002-2v-6M4 7a3 3 0 013-3h1a3 3 0 013 3v2a3 3 0 01-3 3H7a3 3 0 01-3-3V7z"/></svg>`,
    skin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    steth: `<svg viewBox="0 0 24 24"><path d="M19 8a3 3 0 110 6 3 3 0 010-6z"/><path d="M13 8V5a3 3 0 00-6 0v8a5 5 0 0010 0v-3"/></svg>`,
    bone: `<svg viewBox="0 0 24 24"><path d="M18.5 2.5a2.121 2.121 0 010 3l-6.5 6.5-3.5-3.5 6.5-6.5a2.121 2.121 0 013 0z"/><path d="M5.5 21.5a2.121 2.121 0 010-3l6.5-6.5 3.5 3.5-6.5 6.5a2.121 2.121 0 01-3 0z"/></svg>`,
    child: `<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"/><path d="M12 8v8M8 12H4m12 0h4M8 20h8"/></svg>`,
    cell: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    scan: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
};

const DEPARTMENTS = [
    { id: 'Cardiology', name: 'Cardiology', sub: 'Heart & Vascular', color: '#D85A30', bg: '#FAECE7', icon: 'heart' },
    { id: 'Neurology', name: 'Neurology', sub: 'Brain & Nervous', color: '#8B7EF8', bg: '#EEEDFE', icon: 'brain' },
    { id: 'Dermatology', name: 'Dermatology', sub: 'Skin & Aesthetics', color: '#378ADD', bg: '#E6F1FB', icon: 'skin' },
    { id: 'General', name: 'General Practice', sub: 'Primary Care', color: '#EF9F27', bg: '#FAEEDA', icon: 'steth' },
    { id: 'Orthopedics', name: 'Orthopedics', sub: 'Bones & Joints', color: '#34C97A', bg: '#E3F8EC', icon: 'bone' },
    { id: 'Pediatrics', name: 'Pediatrics', sub: 'Child Health', color: '#22C5D9', bg: '#E0F9FC', icon: 'child' },
    { id: 'Oncology', name: 'Oncology', sub: 'Cancer Care', color: '#E0608A', bg: '#FAECF2', icon: 'cell' },
    { id: 'Emergency', name: 'Emergency', sub: 'Acute & Trauma', color: '#F07B3F', bg: '#FFF0E6', icon: 'bolt' },
];

const WORK_TYPES = [
    { id: 'full-time', name: 'Full-time', desc: 'Regular contracted employee', icon: 'briefcase' },
    { id: 'part-time', name: 'Part-time', desc: 'Reduced hours contract', icon: 'clock' },
    { id: 'consultant', name: 'Consultant', desc: 'Independent contractor', icon: 'star' },
];

const WT_ICONS: Record<string, string> = {
    briefcase: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
    clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
};

const DAYS: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS: string[] = ['06:00 AM', '07:00 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'];

// ─── STATE ───
let selectedSpecialty: string = '';
let selectedDepartment: string = '';
let selectedWorkType: string = '';
let selectedExperince: string = '';
let selectedBio: string = '';
let selectedHours: string[] = [];
let selectedDays: string[] = [];
let certifications: Array<{ text: string; year: string }> = [];
let languages: string[] = [];

// ─── WINDOW BINDINGS (needed for HTML onclick in module scripts) ───
declare global {
    interface Window {
        selectSpecialty: (id: string) => void;
        selectDepartment: (id: string) => void;
        selectWorkType: (id: string) => void;
        toggleDay: (day: string) => void;
        handleExpRange: (input: HTMLInputElement) => void;
        addCert: () => void;
        removeCert: (i: number) => void;
        addLanguage: () => void;
        removeLang: (lang: string) => void;
        handleBio: (el: HTMLTextAreaElement) => void;
        aiSuggestBio: () => void;
        scrollToBlock: (id: string) => void;
        saveDraft: () => void;
        handleNext: () => void;
    }
}

// ─── RENDER SPECIALTIES ───
function renderSpecialties(): void {
    const grid = document.getElementById('specialtyGrid') as HTMLElement;
    grid.innerHTML = SPECIALTIES.map(s => `
    <div class="spec-card" id="spec-${s.id}" onclick="selectSpecialty('${s.id}')">
      <div class="spec-card-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="spec-card-icon" style="background:${s.bg};">
        <div style="stroke:${s.color};display:contents;">${(SPEC_ICONS[s.icon] || '').replace('<svg', `<svg style="stroke:${s.color}"`)}</div>
      </div>
      <div class="spec-card-name">${s.name}</div>
    </div>`).join('');
}

function selectSpecialty(id: string): void {
    selectedSpecialty = id;
    document.querySelectorAll('.spec-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`spec-${id}`)?.classList.add('selected');

    // Show sub-specialty input
    const wrap = document.getElementById('subSpecWrap') as HTMLElement;
    wrap.classList.add('open');

    // Auto-select matching department
    const spec = SPECIALTIES.find(s => s.id === id);
    if (spec) {
        const matchDept = DEPARTMENTS.find(d => d.name === spec.name);
        if (matchDept) selectDepartment(matchDept.id);
    }

    updateChecklist();
    updatePreview();
    updateSidebarSteps();
}

// ─── RENDER DEPARTMENTS ───
function renderDepartments(): void {
    const grid = document.getElementById('deptGrid') as HTMLElement;
    grid.innerHTML = DEPARTMENTS.map(d => `
    <div class="dept-card" id="dept-${d.id}" onclick="selectDepartment('${d.id}')">
      <div class="dept-icon" style="background:${d.bg};">
        <div style="display:contents;">${(SPEC_ICONS[d.icon] || '').replace('<svg', `<svg style="stroke:${d.color};"`)}</div>
      </div>
      <div class="dept-info">
        <div class="dept-name">${d.name}</div>
        <div class="dept-sub">${d.sub}</div>
      </div>
      <div class="dept-radio"></div>
    </div>`).join('');
}

function selectDepartment(id: string): void {
    selectedDepartment = id;
    document.querySelectorAll('.dept-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`dept-${id}`)?.classList.add('selected');
    updateChecklist();
    updatePreview();
    updateSidebarSteps();
}

// ─── RENDER WORK TYPES ───
function renderWorkTypes(): void {
    const grid = document.getElementById('workTypeGrid') as HTMLElement;
    const colors = ['var(--teal-400)', 'var(--blue-400)', 'var(--purple-400)'];
    const bgs = ['var(--teal-50)', 'var(--blue-50)', 'var(--purple-50)'];

    grid.innerHTML = WORK_TYPES.map((wt, i) => `
    <div class="wt-card" id="wt-${wt.id}" onclick="selectWorkType('${wt.id}')">
      <div class="wt-check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="wt-icon" style="background:${bgs[i]};">
        <div style="display:contents;">${(WT_ICONS[wt.icon] || '').replace('<svg', `<svg style="stroke:${colors[i]}"`)}</div>
      </div>
      <div class="wt-name">${wt.name}</div>
      <div class="wt-desc">${wt.desc}</div>
    </div>`).join('');
}

function selectWorkType(id: string): void {
    selectedWorkType = id;
    document.querySelectorAll('.wt-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`wt-${id}`)?.classList.add('selected');
    updateChecklist();
    updatePreview();
    updateSidebarSteps();
}

// ─── RENDER DAYS ───
function renderDays(): void {
    const row = document.getElementById('daysRow') as HTMLElement;
    row.innerHTML = DAYS.map(d => `
    <button class="day-btn" id="day-${d}" onclick="toggleDay('${d}')">${d}</button>`).join('');
}

function toggleDay(day: string): void {
    const btn = document.getElementById(`day-${day}`) as HTMLElement;
    if (selectedDays.includes(day)) {
        selectedDays = selectedDays.filter(d => d !== day);
        btn.classList.remove('active');
    } else {
        selectedDays.push(day);
        btn.classList.add('active');
    }
    updateChecklist();
    updateSidebarSteps();
}

// ─── RENDER HOURS ───
function renderHours() {
    const from = document.getElementById('hourFrom') as HTMLSelectElement;
    const to = document.getElementById('hourTo') as HTMLSelectElement;
    const opts = HOURS.map((h, i) => `<option value="${i}">${h}</option>`).join('');
    from.innerHTML = opts;
    to.innerHTML = opts;
    from.value = '4'; // 9:00 AM
    to.value = '14'; // 5:00 PM

    const saveHours = () => { selectedHours = [HOURS[+from.value], HOURS[+to.value]]; };
    saveHours();
    from.addEventListener('change', saveHours);
    to.addEventListener('change', saveHours);
}

// ─── EXPERIENCE RANGE ───
function handleExpRange(input: HTMLInputElement): void {
    const val = Number(input.value);
    selectedExperince = String(val);
    const el = document.getElementById('expVal') as HTMLElement;
    el.textContent = val === 0 ? '0' : val === 40 ? '40+' : String(val);
    const pct = (val / 40) * 100;
    input.style.backgroundSize = `${pct}% 100%`;
    updateChecklist();
    updatePreview();
    updateSidebarSteps();
}

// ─── CERTIFICATIONS ───
function addCert(): void {
    const input = document.getElementById('certInput') as HTMLInputElement;
    const year = document.getElementById('certYear') as HTMLInputElement;
    const text = input.value.trim();
    if (!text) { showToast('Please enter a certification name.', 'error'); return; }
    certifications.push({ text, year: year.value || '' });
    input.value = '';
    year.value = '';
    renderCerts();
    updateChecklist();
}

function removeCert(i: number): void {
    certifications.splice(i, 1);
    renderCerts();
    updateChecklist();
}

function renderCerts(): void {
    const list = document.getElementById('certList') as HTMLElement;
    list.innerHTML = certifications.map((c, i) => `
    <div class="cert-item">
      <div class="cert-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>
      <span class="cert-text">${c.text}</span>
      ${c.year ? `<span class="cert-year">${c.year}</span>` : ''}
      <button class="cert-remove" onclick="removeCert(${i})">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

// ─── LANGUAGES ───
function addLanguage(): void {
    const sel = document.getElementById('langSelect') as HTMLSelectElement;
    const lang = sel.value;
    if (!lang) return;
    if (languages.includes(lang)) { showToast(`${lang} already added.`, 'error'); return; }
    languages.push(lang);
    sel.value = '';
    renderLanguages();
    updatePreview();
}

function removeLang(lang: string): void {
    languages = languages.filter(l => l !== lang);
    renderLanguages();
    updatePreview();
}

function renderLanguages(): void {
    const wrap = document.getElementById('langWrap') as HTMLElement;
    wrap.innerHTML = languages.map(l => `
    <div class="lang-chip">
      ${l}
      <button class="lang-remove" onclick="removeLang('${l}')">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

// ─── BIO ───
function handleBio(el: HTMLTextAreaElement): void {
    const len = el.value.length;
    const countEl = document.getElementById('bioCount') as HTMLElement;
    countEl.textContent = `${len} / 600`;
    countEl.className = 'bio-count' + (len > 550 ? ' warn' : '') + (len >= 600 ? ' full' : '');
    selectedBio = el.value;

    updateChecklist();
    updatePreview();
    updateSidebarSteps();
}

// AI suggest bio (demo)
function aiSuggestBio(): void {
    const spec = SPECIALTIES.find(s => s.id === selectedSpecialty);
    if (!spec) { showToast('Please select a specialty first.', 'error'); return; }

    const bio = document.getElementById('bioTextarea') as HTMLTextAreaElement;
    const expVal = (document.getElementById('expVal') as HTMLElement).textContent;
    const school = (document.getElementById('schoolInput') as HTMLInputElement)?.value ?? '';

    const suggestions: Record<string, string> = {
        cardiology: `Dedicated cardiologist with ${expVal} years of clinical experience in diagnosing and treating cardiovascular conditions.${school ? ` Trained at ${school}.` : ''} I specialise in interventional procedures and am committed to clear, compassionate patient communication.`,
        neurology: `Experienced neurologist with ${expVal} years focusing on brain and nervous system disorders.${school ? ` Graduated from ${school}.` : ''} My approach combines the latest diagnostic techniques with personalised, holistic patient care.`,
        dermatology: `Board-certified dermatologist with ${expVal} years of expertise in medical and cosmetic dermatology.${school ? ` Trained at ${school}.` : ''} I treat a full spectrum of skin conditions using evidence-based, patient-centred protocols.`,
        general: `Primary care physician with ${expVal} years dedicated to comprehensive, preventive family medicine.${school ? ` Medical degree from ${school}.` : ''} I build long-term relationships with patients of all ages, prioritising health education and early intervention.`,
        orthopedics: `Orthopedic specialist with ${expVal} years in joint replacement and sports injury management.${school ? ` Trained at ${school}.` : ''} I advocate for minimally invasive techniques that accelerate recovery and restore quality of life.`,
        pediatrics: `Compassionate pediatrician with ${expVal} years caring for children from newborn to adolescent.${school ? ` Degree from ${school}.` : ''} I create a warm, family-friendly environment and focus on developmental milestones and preventive wellness.`,
        oncology: `Medical oncologist with ${expVal} years of experience in comprehensive cancer care.${school ? ` Trained at ${school}.` : ''} I partner closely with patients and their families to navigate diagnosis, treatment, and survivorship with empathy and precision.`,
        emergency: `Emergency medicine physician with ${expVal} years in acute and critical care settings.${school ? ` Graduated from ${school}.` : ''} I thrive in high-pressure environments and am dedicated to rapid, evidence-based decision-making.`,
        radiology: `Radiologist with ${expVal} years interpreting diagnostic imaging across all modalities.${school ? ` Trained at ${school}.` : ''} I combine technical precision with close collaboration with clinical teams to deliver accurate, timely diagnoses.`,
    };

    const text = suggestions[selectedSpecialty] || `Dedicated ${spec.name} specialist with ${expVal} years of clinical experience, committed to outstanding patient care.`;
    bio.value = text;
    handleBio(bio);
    showToast('Bio suggestion applied — feel free to edit!');
}

// ─── CHECKLIST & PROGRESS ───
interface CheckItem { id: string; check: boolean; }

function getCheckItems(): CheckItem[] {
    const expVal = parseInt((document.getElementById('expVal') as HTMLElement).textContent || '0');
    const bio = (document.getElementById('bioTextarea') as HTMLTextAreaElement).value.trim();
    return [
        { id: 'specialty', check: !!selectedSpecialty },
        { id: 'department', check: !!selectedDepartment },
        { id: 'worktype', check: !!selectedWorkType },
        { id: 'days', check: selectedDays.length > 0 },
        { id: 'experience', check: expVal > 0 },
        { id: 'bio', check: bio.length >= 30 },
    ];
}

function updateChecklist(): void {
    const items = getCheckItems();
    let doneCount = 0;

    items.forEach(item => {
        const row = document.getElementById(`chk-${item.id}`) as HTMLElement;
        if (!row) return;
        row.classList.toggle('done', item.check);
        if (item.check) doneCount++;
    });

    const pct = Math.round((doneCount / items.length) * 100);
    const pctStr = `${pct}%`;

    // Update all completeness indicators
    const compBar = document.getElementById('compBar') as HTMLElement;
    const compPct = document.getElementById('compPct') as HTMLElement;
    const footerPct = document.getElementById('footerPct') as HTMLElement;
    const topBar = document.getElementById('topBarFill') as HTMLElement;

    if (compBar) compBar.style.width = pctStr;
    if (compPct) compPct.textContent = pctStr;
    if (footerPct) footerPct.textContent = pctStr;
    if (topBar) topBar.style.width = `${25 + pct * 0.25}%`; // 25-50% range for step 2

    // Enable/disable next button (require core fields)
    const coresDone = items.filter(i => ['specialty', 'department', 'worktype'].includes(i.id)).every(i => i.check);
    const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
    if (nextBtn) nextBtn.disabled = !coresDone;
}

// ─── LIVE PREVIEW ───
function updatePreview(): void {
    const spec = SPECIALTIES.find(s => s.id === selectedSpecialty);
    const dept = DEPARTMENTS.find(d => d.id === selectedDepartment);
    const wt = WORK_TYPES.find(w => w.id === selectedWorkType);
    const bio = (document.getElementById('bioTextarea') as HTMLTextAreaElement)?.value || '';
    const degree = (document.getElementById('degreeSelect') as HTMLSelectElement)?.value || '';

    // Preview card
    const specEl = document.getElementById('previewSpec') as HTMLElement;
    const tagsEl = document.getElementById('previewTags') as HTMLElement;
    const bioEl = document.getElementById('previewBio') as HTMLElement;
    const cardTop = document.getElementById('previewCardTop') as HTMLElement;

    if (spec) {
        specEl.textContent = `${spec.name}${degree ? ' · ' + degree : ''}`;
        cardTop.style.background = `linear-gradient(135deg, ${spec.color}, ${spec.color}99)`;
    } else {
        specEl.textContent = 'Select a specialty to continue';
        cardTop.style.background = 'linear-gradient(135deg, var(--teal-400), var(--teal-800))';
    }

    // Tags
    const tags: string[] = [];
    if (wt) tags.push(wt.name);
    if (dept) tags.push(dept.name);
    if (languages.length) tags.push(`${languages.length} lang${languages.length > 1 ? 's' : ''}`);

    const tagColors: [string, string][] = [
        ['var(--teal-50)', 'var(--teal-600)'],
        ['var(--blue-50)', 'var(--blue-400)'],
        ['var(--amber-50)', '#7A4A08'],
    ];

    tagsEl.innerHTML = tags.map((t, i) => {
        const [bg, color] = tagColors[i % tagColors.length];
        return `<span class="preview-tag" style="background:${bg};color:${color};">${t}</span>`;
    }).join('');

    // Bio
    bioEl.innerHTML = bio.length
        ? `<span>${bio.slice(0, 120)}${bio.length > 120 ? '…' : ''}</span>`
        : `<span class="preview-placeholder">Your bio will appear here…</span>`;

    // Sidebar preview
    const sbSpec = document.getElementById('previewSpecSidebar') as HTMLElement;
    if (sbSpec) sbSpec.textContent = spec ? spec.name : 'Select specialty';
}

// ─── SIDEBAR STEP HIGHLIGHTING ───
function updateSidebarSteps(): void {
    const steps = [
        { id: 'ss-dept', done: !!selectedDepartment },
        { id: 'ss-worktype', done: !!selectedWorkType },
        { id: 'ss-availability', done: selectedDays.length > 0 },
        { id: 'ss-experience', done: parseInt((document.getElementById('expVal') as HTMLElement)?.textContent || '0') > 0 },
        { id: 'ss-bio', done: (document.getElementById('bioTextarea') as HTMLTextAreaElement)?.value?.trim().length >= 30 },
    ];

    steps.forEach(s => {
        const el = document.getElementById(s.id);
        if (!el) return;
        el.classList.toggle('completed', s.done);
        el.classList.toggle('active', !s.done);
    });
}

// ─── SCROLL TO BLOCK ───
function scrollToBlock(id: string): void {
    const el = document.getElementById(`block-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── SAVE DRAFT ───
function saveDraft(): void {
    showToast('Draft saved. You can continue anytime.');
}

// ─── HANDLE NEXT ───
async function handleNext() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email') || 'john.doe@example.com';
    const items = getCheckItems();
    const missing = items.filter(i => !i.check).map(i => i.id);
    const room_number = (document.getElementById('roomInput') as HTMLInputElement).value.trim();
    const userId = await cookieStore.get("userId")

    if (!room_number) { showToast('Please enter your room number.', 'error') }
    if (missing.includes('specialty')) { showToast('Please select your specialty.', 'error'); scrollToBlock('specialty'); return; }
    if (missing.includes('department')) { showToast('Please choose a department.', 'error'); scrollToBlock('department'); return; }
    if (missing.includes('worktype')) { showToast('Please select your work type.', 'error'); scrollToBlock('worktype'); return; }

    const res = await fetch(`${apiUrl}/doctors`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            specialization: selectedSpecialty,
            department: selectedDepartment,
            experience: selectedExperince,
            type: selectedWorkType,
            bio: selectedBio,
            room_number: room_number,
            user_id: userId?.value
        })
    })

    const response = await res.json()

    if (!response.success) {
        return showToast(response.message, 'error');
    }

    const res1 = await fetch(`${apiUrl}/schedules`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            work_day: selectedDays.join(', '),
            start_time: selectedHours[0],
            end_time: selectedHours[1],
            doctor_id: response.userId,
        })
    })
    const response1 = await res1.json()

    if (!response1.success) {
        return showToast(response1.message, 'error');
    }

    showToast('Professional profile saved!');

    setTimeout(async () => {
        // const userId = await cookieStore.get("userId")
        window.location.href = `/src/pages/verify-email?email=${email}`;
    }, 1500);
}

// ─── SCROLL REVEAL ───
function initReveal(): void {
    const blocks = document.querySelectorAll('.form-block');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    blocks.forEach(b => obs.observe(b));
}

// ─── TOAST ───
let toastTimer: ReturnType<typeof setTimeout>;
function showToast(msg: string, type: string = 'success'): void {
    const t = document.getElementById('toast') as HTMLElement;
    t.textContent = msg;
    t.className = `toast ${type}`;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

// ─── INIT ───
function init(): void {
    renderSpecialties();
    renderDepartments();
    renderWorkTypes();
    renderDays();
    renderHours();
    initReveal();
    updateChecklist();
    updatePreview();

    // Set initials from URL or session
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || 'Dr';
    const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
    ['previewAvatar', 'previewAvatarSidebar'].forEach(id => {
        const el = document.getElementById(id) as HTMLElement;
        if (el) el.textContent = initials;
    });
    const nameEl = document.getElementById('previewNameSidebar') as HTMLElement;
    if (nameEl && name !== 'Dr') nameEl.textContent = name;
}

// Expose functions to global scope for HTML onclick handlers
window.selectSpecialty = selectSpecialty;
window.selectDepartment = selectDepartment;
window.selectWorkType = selectWorkType;
window.toggleDay = toggleDay;
window.handleExpRange = handleExpRange;
window.addCert = addCert;
window.removeCert = removeCert;
window.addLanguage = addLanguage;
window.removeLang = removeLang;
window.handleBio = handleBio;
window.aiSuggestBio = aiSuggestBio;
window.scrollToBlock = scrollToBlock;
window.saveDraft = saveDraft;
window.handleNext = handleNext;

document.addEventListener('DOMContentLoaded', init);