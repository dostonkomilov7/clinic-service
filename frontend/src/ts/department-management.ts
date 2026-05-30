// import { redirectIfNotAuth } from "../main";

// redirectIfNotAuth();

/* ─── DATA ─── */
const DEPTS = [
  {
    id:'DEPT-001', name:'Cardiology', code:'CARD', color:'#D85A30', colorKey:'coral',
    icon:'heart', status:'Active', building:'Main', floor:'4th Floor',
    head:'Dr. Sarah Rahman', headInitials:'SR', headColor:'#1D9E75',
    staff:28, doctors:8, nurses:20, beds:42, occupancy:88,
    appts:312, founded:'2014', phone:'+1 555 201 4100',
    email:'cardiology@medibook.com', budget:'$2.4M',
    desc:'Specialises in diagnosis and treatment of heart and cardiovascular diseases including interventional cardiology, electrophysiology, and cardiac rehabilitation.',
    staffList:[
      { name:'Dr. Sarah Rahman', role:'Head of Department', initials:'SR', color:'#1D9E75', tag:'head' },
      { name:'Dr. Robert Chen',  role:'Senior Cardiologist',initials:'RC', color:'#378ADD', tag:'sr'   },
      { name:'Nurse Patricia L.', role:'Chief Nurse',       initials:'PL', color:'#8B7EF8', tag:''     },
    ]
  },
  {
    id:'DEPT-002', name:'Neurology', code:'NEUR', color:'#8B7EF8', colorKey:'purple',
    icon:'brain', status:'Active', building:'Main', floor:'5th Floor',
    head:'Dr. Ayesha Patel', headInitials:'AP', headColor:'#D85A30',
    staff:18, doctors:5, nurses:13, beds:28, occupancy:72,
    appts:198, founded:'2015', phone:'+1 555 201 5200',
    email:'neurology@medibook.com', budget:'$1.8M',
    desc:'Covers disorders of the nervous system including epilepsy, stroke, multiple sclerosis, movement disorders, and neurodegenerative conditions.',
    staffList:[
      { name:'Dr. Ayesha Patel',  role:'Head of Department', initials:'AP', color:'#D85A30', tag:'head' },
      { name:'Dr. Carlos Mendez', role:'Senior Neurologist',  initials:'CM', color:'#8B7EF8', tag:'sr'   },
      { name:'Nurse Amanda K.',   role:'Chief Nurse',         initials:'AK', color:'#34C97A', tag:''     },
    ]
  },
  {
    id:'DEPT-003', name:'Dermatology', code:'DERM', color:'#378ADD', colorKey:'blue',
    icon:'skin', status:'Active', building:'East', floor:'2nd Floor',
    head:'Dr. Michael Kim', headInitials:'MK', headColor:'#378ADD',
    staff:14, doctors:4, nurses:10, beds:12, occupancy:58,
    appts:244, founded:'2016', phone:'+1 555 301 4200',
    email:'dermatology@medibook.com', budget:'$1.1M',
    desc:'Diagnoses and treats conditions of the skin, hair, and nails including eczema, psoriasis, acne, melanoma, and cosmetic dermatology procedures.',
    staffList:[
      { name:'Dr. Michael Kim',  role:'Head of Department', initials:'MK', color:'#378ADD', tag:'head' },
      { name:'Dr. Priya Sharma', role:'Consultant',         initials:'PS', color:'#EF9F27', tag:'sr'   },
      { name:'Nurse Sofia B.',   role:'Senior Nurse',       initials:'SB', color:'#E0608A', tag:''     },
    ]
  },
  {
    id:'DEPT-004', name:'General Practice', code:'GENPX', color:'#EF9F27', colorKey:'amber',
    icon:'stethoscope', status:'Active', building:'Main', floor:'1st Floor',
    head:'Dr. Thomas Nguyen', headInitials:'TN', headColor:'#EF9F27',
    staff:42, doctors:12, nurses:30, beds:60, occupancy:91,
    appts:487, founded:'2012', phone:'+1 555 201 1000',
    email:'general@medibook.com', budget:'$3.2M',
    desc:'Primary care for patients of all ages. Focuses on preventive medicine, chronic disease management, routine check-ups, referrals, and family health.',
    staffList:[
      { name:'Dr. Thomas Nguyen', role:'Head of Department', initials:'TN', color:'#EF9F27', tag:'head' },
      { name:'Dr. Fatima Al-Amin',role:'Senior GP',          initials:'FA', color:'#34C97A', tag:'sr'   },
      { name:'Nurse James O.',    role:'Chief Nurse',         initials:'JO', color:'#378ADD', tag:''     },
    ]
  },
  {
    id:'DEPT-005', name:'Orthopedics', code:'ORTH', color:'#34C97A', colorKey:'green',
    icon:'bone', status:'Expanding', building:'North', floor:'3rd Floor',
    head:'Dr. James Okafor', headInitials:'JO', headColor:'#34C97A',
    staff:22, doctors:6, nurses:16, beds:36, occupancy:80,
    appts:176, founded:'2017', phone:'+1 555 401 3300',
    email:'orthopedics@medibook.com', budget:'$2.0M',
    desc:'Specialises in musculoskeletal conditions, joint replacement surgery, sports injuries, spinal disorders, and physical rehabilitation programmes.',
    staffList:[
      { name:'Dr. James Okafor', role:'Head of Department', initials:'JO', color:'#34C97A', tag:'head' },
      { name:'Dr. Sean Murphy',  role:'Consultant Surgeon', initials:'SM', color:'#8B7EF8', tag:'sr'   },
      { name:'Nurse Rachel T.',  role:'Senior Nurse',       initials:'RT', color:'#D85A30', tag:''     },
    ]
  },
  {
    id:'DEPT-006', name:'Pediatrics', code:'PEDS', color:'#22C5D9', colorKey:'cyan',
    icon:'child', status:'Active', building:'East', floor:'1st Floor',
    head:'Dr. Linda Park', headInitials:'LP', headColor:'#22C5D9',
    staff:32, doctors:9, nurses:23, beds:44, occupancy:65,
    appts:289, founded:'2013', phone:'+1 555 301 2100',
    email:'pediatrics@medibook.com', budget:'$2.6M',
    desc:'Dedicated to the medical care of infants, children, and adolescents. Covers developmental assessment, immunisation, acute illness, and chronic condition management.',
    staffList:[
      { name:'Dr. Linda Park',   role:'Head of Department', initials:'LP', color:'#22C5D9', tag:'head' },
      { name:'Dr. Maria Santos', role:'Senior Pediatrician',initials:'MS', color:'#E0608A', tag:'sr'   },
      { name:'Nurse Tom W.',     role:'Chief Nurse',        initials:'TW', color:'#EF9F27', tag:''     },
    ]
  },
  {
    id:'DEPT-007', name:'Oncology', code:'ONCO', color:'#E0608A', colorKey:'pink',
    icon:'cell', status:'Active', building:'North', floor:'4th Floor',
    head:'Dr. Elena Vasquez', headInitials:'EV', headColor:'#E0608A',
    staff:24, doctors:7, nurses:17, beds:38, occupancy:76,
    appts:142, founded:'2015', phone:'+1 555 401 4400',
    email:'oncology@medibook.com', budget:'$3.8M',
    desc:'Provides comprehensive cancer care including medical, surgical, and radiation oncology. Specialises in breast, colorectal, lung cancer, and haematological malignancies.',
    staffList:[
      { name:'Dr. Elena Vasquez', role:'Head of Department', initials:'EV', color:'#E0608A', tag:'head' },
      { name:'Dr. Chris A.',      role:'Medical Oncologist', initials:'CA', color:'#8B7EF8', tag:'sr'   },
      { name:'Nurse Nina P.',     role:'Chief Oncology Nurse',initials:'NP',color:'#1D9E75', tag:''     },
    ]
  },
  {
    id:'DEPT-008', name:'Emergency Medicine', code:'EMRG', color:'#F07B3F', colorKey:'orange',
    icon:'emergency', status:'Active', building:'Main', floor:'Ground Floor',
    head:'Dr. Kevin Walsh', headInitials:'KW', headColor:'#F07B3F',
    staff:56, doctors:14, nurses:42, beds:30, occupancy:95,
    appts:521, founded:'2011', phone:'+1 555 201 9111',
    email:'emergency@medibook.com', budget:'$5.1M',
    desc:'24/7 acute emergency care for life-threatening conditions. Covers trauma, cardiac arrest, stroke, major injuries, and critical care stabilisation.',
    staffList:[
      { name:'Dr. Kevin Walsh', role:'Head of Department',  initials:'KW', color:'#F07B3F', tag:'head' },
      { name:'Dr. Tanya R.',    role:'Senior EM Physician', initials:'TR', color:'#22C5D9', tag:'sr'   },
      { name:'Nurse Samuel F.', role:'Charge Nurse',        initials:'SF', color:'#34C97A', tag:''     },
    ]
  },
  {
    id:'DEPT-009', name:'Radiology', code:'RADI', color:'#9A9890', colorKey:'gray',
    icon:'scan', status:'Inactive', building:'East', floor:'Basement',
    head:'Dr. Maria Santos', headInitials:'MS', headColor:'#9A9890',
    staff:16, doctors:4, nurses:12, beds:0, occupancy:0,
    appts:88, founded:'2018', phone:'+1 555 301 6600',
    email:'radiology@medibook.com', budget:'$1.4M',
    desc:'Diagnostic and interventional radiology services including MRI, CT scans, X-ray, ultrasound, nuclear medicine, and image-guided procedures.',
    staffList:[
      { name:'Dr. Maria Santos', role:'Head of Department', initials:'MS', color:'#9A9890', tag:'head' },
      { name:'Dr. Paul K.',      role:'Senior Radiologist', initials:'PK', color:'#8B7EF8', tag:'sr'   },
      { name:'Nurse Lisa N.',    role:'Chief Nurse',        initials:'LN', color:'#EF9F27', tag:''     },
    ]
  },
];

const DEPT_ICONS: Record<string, string> = {
  heart: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
  brain: `<svg viewBox="0 0 24 24"><path d="M9.5 2a2.5 2.5 0 015 0v1a2.5 2.5 0 01-5 0V2zM4 7a3 3 0 013-3h1a3 3 0 013 3v2a3 3 0 01-3 3H7a3 3 0 01-3-3V7zM14 7a3 3 0 013-3h1v2h-1a1 1 0 000 2h1v4h-1a3 3 0 01-3-3V7z"/><path d="M7 12v6a2 2 0 002 2h6a2 2 0 002-2v-6"/></svg>`,
  skin: `<svg viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  stethoscope: `<svg viewBox="0 0 24 24"><path d="M19 8a3 3 0 110 6 3 3 0 010-6z"/><path d="M13 8V5a3 3 0 00-6 0v8a5 5 0 0010 0v-3"/></svg>`,
  bone: `<svg viewBox="0 0 24 24"><path d="M18.5 2.5a2.121 2.121 0 010 3l-6.5 6.5-3.5-3.5 6.5-6.5a2.121 2.121 0 013 0z"/><path d="M5.5 21.5a2.121 2.121 0 010-3l6.5-6.5 3.5 3.5-6.5 6.5a2.121 2.121 0 01-3 0z"/></svg>`,
  child: `<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"/><path d="M12 8v8m-4 4h8M8 12H4m12 0h4"/></svg>`,
  cell: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
  emergency: `<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  scan: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
};

const COLORS = ['#D85A30','#8B7EF8','#378ADD','#EF9F27','#34C97A','#22C5D9','#E0608A','#F07B3F','#1D9E75'];

function getOccColor(pct: number): string {
  if (pct === 0) return '#5C5B56';
  if (pct >= 90) return '#D85A30';
  if (pct >= 80) return '#EF9F27';
  return '#34C97A';
}

let currentView = 'grid';
let filtered = [...DEPTS];
let sortKey: string | null = null, sortAsc = true;
let deleteTarget: string | null = null;

/* ─── RENDER GRID ─── */
function renderGrid() {
  const container = document.getElementById('dept-grid')!;
  const empty = document.getElementById('empty-state')!;

  if (filtered.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  container.innerHTML = filtered.map((d, i) => {
    const occColor = getOccColor(d.occupancy);
    const statusClass = d.status.toLowerCase();
    const iconHtml = DEPT_ICONS[d.icon] || DEPT_ICONS.stethoscope;

    return `<div class="dept-card" style="animation-delay:${i * 0.05}s" onclick="openViewDrawer('${d.id}')">
      <div class="card-top-band" style="background:${d.color}"></div>
      <div class="card-header">
        <div style="display:flex;align-items:flex-start;gap:12px;flex:1;min-width:0;">
          <div class="dept-icon-wrap" style="background:${d.color}22;">
            <div style="stroke:${d.color}">${iconHtml}</div>
          </div>
          <div class="dept-head-right" style="flex:1;min-width:0;">
            <div class="dept-name">${d.name}</div>
            <div class="dept-code">${d.code} · ${d.building}</div>
          </div>
        </div>
        <span class="dept-status-pill ${statusClass}">${d.status}</span>
      </div>
      <div class="card-stats">
        <div class="card-stat"><div class="cs-val">${d.doctors}</div><div class="cs-lbl">Doctors</div></div>
        <div class="card-stat"><div class="cs-val">${d.staff}</div><div class="cs-lbl">Staff</div></div>
        <div class="card-stat"><div class="cs-val">${d.beds > 0 ? d.beds : '—'}</div><div class="cs-lbl">Beds</div></div>
      </div>
      <div class="card-occupancy" style="padding-top:0.75rem;">
        <div class="occ-row">
          <span class="occ-label">Bed Occupancy</span>
          <span class="occ-pct" style="color:${occColor}">${d.occupancy}%</span>
        </div>
        <div class="occ-bar"><div class="occ-fill" style="width:${d.occupancy}%;background:${occColor}"></div></div>
      </div>
      <div class="card-divider" style="margin-top:0.85rem;"></div>
      <div class="card-footer">
        <div class="card-head-doc">
          <div class="head-av" style="background:${d.headColor}">${d.headInitials}</div>
          <div class="head-info">
            <div class="head-name">${d.head}</div>
            <div class="head-role">Department Head</div>
          </div>
        </div>
        <div class="card-actions">
          <button class="ca-btn edit" title="Edit" onclick="event.stopPropagation();openEditDrawer('${d.id}')">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="ca-btn del" title="Delete" onclick="event.stopPropagation();openDelModal('${d.id}')">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');

  container.querySelectorAll('.dept-icon-wrap svg').forEach((svg, i) => {
    if (filtered[i]) {
      (svg as HTMLElement).style.stroke = filtered[i].color;
      svg.querySelectorAll('path,circle,line,polygon,polyline,rect').forEach(el => {
        (el as HTMLElement).style.stroke = filtered[i].color;
      });
    }
  });
}

/* ─── RENDER LIST ─── */
function renderList() {
  const tbody = document.getElementById('dept-table-body')!;
  const empty = document.getElementById('empty-state')!;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  tbody.innerHTML = filtered.map(d => {
    const occColor = getOccColor(d.occupancy);
    const statusClass = d.status.toLowerCase();
    const iconHtml = DEPT_ICONS[d.icon] || DEPT_ICONS.stethoscope;

    return `<tr onclick="openViewDrawer('${d.id}')">
      <td>
        <div class="dept-cell">
          <div class="tbl-dept-icon" style="background:${d.color}22;">${iconHtml.replace('<svg', `<svg style="stroke:${d.color}"`)}</div>
          <div>
            <div class="tbl-dept-name">${d.name}</div>
            <div class="tbl-dept-code">${d.code} · ${d.floor}</div>
          </div>
        </div>
      </td>
      <td><div class="head-cell"><div class="sm-av" style="background:${d.headColor}">${d.headInitials}</div><span style="font-size:13px;color:var(--text-2);">${d.head}</span></div></td>
      <td style="font-size:13px;color:var(--text-2);">${d.staff} <span style="color:var(--text-3);font-size:11px;">(${d.doctors} Dr)</span></td>
      <td style="font-size:13.5px;">${d.beds > 0 ? d.beds : '—'}</td>
      <td><div class="mini-bar"><div class="mb-track"><div class="mb-fill" style="width:${d.occupancy}%;background:${occColor}"></div></div><span style="font-size:12.5px;color:${occColor};font-weight:500;">${d.occupancy}%</span></div></td>
      <td><span class="s-pill ${statusClass}">${d.status}</span></td>
      <td style="font-size:13px;color:var(--text-2);">${d.building}</td>
      <td>
        <div class="tbl-actions">
          <button class="tbl-btn view" title="View" onclick="event.stopPropagation();openViewDrawer('${d.id}')"><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
          <button class="tbl-btn edit" title="Edit" onclick="event.stopPropagation();openEditDrawer('${d.id}')"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          <button class="tbl-btn del"  title="Delete" onclick="event.stopPropagation();openDelModal('${d.id}')"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function render() {
  renderGrid();
  renderList();
}

/* ─── FILTER ─── */
function filterDepts() {
  const q  = (document.getElementById('dept-search') as HTMLInputElement).value.toLowerCase();
  const st = (document.getElementById('status-filter') as HTMLSelectElement).value;
  const bl = (document.getElementById('building-filter') as HTMLSelectElement).value;

  filtered = DEPTS.filter(d => {
    const mq = !q || d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.head.toLowerCase().includes(q);
    const ms = !st || d.status === st;
    const mb = !bl || d.building.includes(bl);
    return mq && ms && mb;
  });

  render();
}

/* ─── SORT ─── */
function sortDepts(key: string) {
  if (sortKey === key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = true; }
  filtered.sort((a: any, b: any) => {
    let av = a[key], bv = b[key];
    if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
  });
  document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted'));
  render();
}

/* ─── VIEW TOGGLE ─── */
function setView(view: string) {
  currentView = view;
  const grid = document.getElementById('dept-grid')!;
  const list = document.getElementById('dept-list-wrap')!;
  document.getElementById('grid-btn')!.classList.toggle('active', view === 'grid');
  document.getElementById('list-btn')!.classList.toggle('active', view === 'list');
  grid.style.display = view === 'grid' ? '' : 'none';
  list.style.display = view === 'list' ? '' : 'none';
  render();
}

/* ─── DRAWER VIEW ─── */
function openViewDrawer(id: string) {
  const d = DEPTS.find(x => x.id === id);
  if (!d) return;

  document.getElementById('drawer-title')!.textContent = d.name;
  document.getElementById('drawer-sub')!.textContent = `${d.code} · ${d.building} · ${d.floor}`;

  const btn = document.getElementById('drawer-action-btn')!;
  btn.textContent = 'Edit Department';
  (btn as HTMLButtonElement).onclick = () => openEditDrawer(id);

  const iconHtml = DEPT_ICONS[d.icon] || DEPT_ICONS.stethoscope;
  const statusClass = d.status.toLowerCase();
  const occColor = getOccColor(d.occupancy);

  document.getElementById('drawer-body')!.innerHTML = `
    <div class="drawer-dept-hero" style="background:${d.color}0D;">
      <div class="hero-icon" style="background:${d.color}22;">
        <div style="stroke:${d.color};display:contents;">${iconHtml.replace('<svg', `<svg style="stroke:${d.color};"`)}</div>
      </div>
      <div class="hero-info">
        <div class="dept-big-name">${d.name}</div>
        <div class="dept-code-big">${d.code} · ${d.building} · ${d.floor}</div>
        <div class="dept-tags"><span class="dept-status-pill ${statusClass}">${d.status}</span></div>
      </div>
    </div>
    <div class="kpi-row">
      <div class="kpi-box"><div class="kv">${d.doctors}</div><div class="kl">Doctors</div></div>
      <div class="kpi-box"><div class="kv">${d.nurses}</div><div class="kl">Nurses</div></div>
      <div class="kpi-box"><div class="kv" style="color:${occColor}">${d.occupancy}%</div><div class="kl">Occupancy</div></div>
    </div>
    <div class="info-section">
      <h4>Department Info</h4>
      <div class="info-grid">
        <div class="info-box"><div class="ib-label">Dept ID</div><div class="ib-val">${d.id}</div></div>
        <div class="info-box"><div class="ib-label">Founded</div><div class="ib-val">${d.founded}</div></div>
        <div class="info-box"><div class="ib-label">Total Beds</div><div class="ib-val">${d.beds > 0 ? d.beds + ' beds' : 'N/A'}</div></div>
        <div class="info-box"><div class="ib-label">Appts This Month</div><div class="ib-val">${d.appts}</div></div>
        <div class="info-box"><div class="ib-label">Annual Budget</div><div class="ib-val">${d.budget}</div></div>
        <div class="info-box"><div class="ib-label">Building</div><div class="ib-val">${d.building} — ${d.floor}</div></div>
        <div class="info-box"><div class="ib-label">Phone</div><div class="ib-val">${d.phone}</div></div>
        <div class="info-box"><div class="ib-label">Email</div><div class="ib-val" style="font-size:12.5px;">${d.email}</div></div>
        <div class="info-box full"><div class="ib-label">Description</div><div class="ib-val" style="font-weight:400;font-size:13px;color:var(--text-2);line-height:1.6;margin-top:4px;">${d.desc}</div></div>
      </div>
    </div>
    <div class="info-section">
      <h4>Key Staff (${d.staffList.length} shown)</h4>
      <div class="staff-list">
        ${d.staffList.map((s: any) => `
          <div class="staff-item">
            <div class="staff-av" style="background:${s.color}">${s.initials}</div>
            <div><div class="staff-name">${s.name}</div><div class="staff-role">${s.role}</div></div>
            ${s.tag ? `<span class="staff-tag ${s.tag}">${s.tag === 'head' ? 'Head' : 'Senior'}</span>` : ''}
          </div>`).join('')}
      </div>
    </div>`;

  document.getElementById('drawer-overlay')!.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ─── DRAWER EDIT ─── */
function openEditDrawer(id: string) {
  const d = DEPTS.find(x => x.id === id);
  if (!d) return;

  document.getElementById('drawer-title')!.textContent = 'Edit Department';
  document.getElementById('drawer-sub')!.textContent = `Editing ${d.name}`;

  const btn = document.getElementById('drawer-action-btn')!;
  btn.textContent = 'Save Changes';
  (btn as HTMLButtonElement).onclick = () => { showToast(`${d.name} updated successfully.`, 'success'); closeDrawer(); };

  document.getElementById('drawer-body')!.innerHTML = `
    <div class="form-row">
      <div class="form-field"><label>Department Name</label><input class="form-input" value="${d.name}"></div>
      <div class="form-field"><label>Code</label><input class="form-input" value="${d.code}"></div>
    </div>
    <div class="form-field">
      <label>Head of Department</label>
      <select class="form-input">${DEPTS.map(x => `<option ${x.head === d.head ? 'selected' : ''}>${x.head}</option>`).join('')}</select>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Building</label><select class="form-input">${['Main Building','East Wing','North Block'].map(b => `<option ${d.building && b.includes(d.building) ? 'selected' : ''}>${b}</option>`).join('')}</select></div>
      <div class="form-field"><label>Floor</label><input class="form-input" value="${d.floor}"></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Total Beds</label><input class="form-input" type="number" value="${d.beds}"></div>
      <div class="form-field"><label>Annual Budget</label><input class="form-input" value="${d.budget}"></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Phone</label><input class="form-input" value="${d.phone}"></div>
      <div class="form-field"><label>Status</label><select class="form-input">${['Active','Inactive','Expanding'].map(s => `<option ${s === d.status ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    </div>
    <div class="form-field"><label>Email</label><input class="form-input" type="email" value="${d.email}"></div>
    <div class="form-field">
      <label>Department Colour</label>
      <div class="color-picker-row">${COLORS.map(c => `<div class="color-opt ${c === d.color ? 'selected' : ''}" style="background:${c}" onclick="selectColor(this)" title="${c}"></div>`).join('')}</div>
    </div>
    <div class="form-field"><label>Description</label><textarea class="form-textarea">${d.desc}</textarea></div>`;

  document.getElementById('drawer-overlay')!.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ─── DRAWER ADD ─── */
function openAddDrawer() {
  document.getElementById('drawer-title')!.textContent = 'Add Department';
  document.getElementById('drawer-sub')!.textContent = 'Create a new clinical department';

  const btn = document.getElementById('drawer-action-btn')!;
  btn.textContent = 'Create Department';
  (btn as HTMLButtonElement).onclick = () => {
    const name = (document.querySelector('#drawer-body .form-input') as HTMLInputElement)?.value?.trim();
    if (!name) { showToast('Please enter a department name.', 'error'); return; }
    showToast(`Department "${name}" created successfully.`, 'success');
    closeDrawer();
  };

  document.getElementById('drawer-body')!.innerHTML = `
    <div class="form-row">
      <div class="form-field"><label>Department Name</label><input class="form-input" placeholder="e.g. Cardiology"></div>
      <div class="form-field"><label>Code</label><input class="form-input" placeholder="e.g. CARD"></div>
    </div>
    <div class="form-field">
      <label>Head of Department</label>
      <select class="form-input"><option value="">Select a doctor</option>${DEPTS.map(x => `<option>${x.head}</option>`).join('')}</select>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Building</label><select class="form-input"><option>Main Building</option><option>East Wing</option><option>North Block</option></select></div>
      <div class="form-field"><label>Floor</label><input class="form-input" placeholder="e.g. 3rd Floor"></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Total Beds</label><input class="form-input" type="number" placeholder="0"></div>
      <div class="form-field"><label>Annual Budget</label><input class="form-input" placeholder="e.g. $1.5M"></div>
    </div>
    <div class="form-row">
      <div class="form-field"><label>Phone</label><input class="form-input" type="tel" placeholder="+1 555 000 0000"></div>
      <div class="form-field"><label>Status</label><select class="form-input"><option>Active</option><option>Inactive</option><option>Expanding</option></select></div>
    </div>
    <div class="form-field"><label>Email</label><input class="form-input" type="email" placeholder="dept@medibook.com"></div>
    <div class="form-field">
      <label>Department Colour</label>
      <div class="color-picker-row">${COLORS.map((c, i) => `<div class="color-opt ${i===0?'selected':''}" style="background:${c}" onclick="selectColor(this)"></div>`).join('')}</div>
    </div>
    <div class="form-field"><label>Description</label><textarea class="form-textarea" placeholder="Brief description of the department's scope and specialties…"></textarea></div>`;

  document.getElementById('drawer-overlay')!.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectColor(el: HTMLElement) {
  el.closest('.color-picker-row')!.querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function closeDrawer() {
  document.getElementById('drawer-overlay')!.classList.remove('open');
  document.body.style.overflow = '';
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === document.getElementById('drawer-overlay')) closeDrawer();
}

/* ─── DELETE ─── */
function openDelModal(id: string) {
  deleteTarget = id;
  const d = DEPTS.find(x => x.id === id);
  document.getElementById('del-name')!.textContent = d ? d.name : 'this department';
  document.getElementById('del-modal')!.classList.add('open');
}

function closeDelModal() {
  document.getElementById('del-modal')!.classList.remove('open');
  deleteTarget = null;
}

function handleDelOverlay(e: MouseEvent) {
  if (e.target === document.getElementById('del-modal')) closeDelModal();
}

function confirmDel() {
  const d = DEPTS.find(x => x.id === deleteTarget);
  showToast(`${d ? d.name : 'Department'} has been removed.`, 'error');
  closeDelModal();
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
(window as any).filterDepts = filterDepts;
(window as any).sortDepts = sortDepts;
(window as any).setView = setView;
(window as any).openViewDrawer = openViewDrawer;
(window as any).openEditDrawer = openEditDrawer;
(window as any).openAddDrawer = openAddDrawer;
(window as any).selectColor = selectColor;
(window as any).closeDrawer = closeDrawer;
(window as any).handleOverlayClick = handleOverlayClick;
(window as any).openDelModal = openDelModal;
(window as any).closeDelModal = closeDelModal;
(window as any).handleDelOverlay = handleDelOverlay;
(window as any).confirmDel = confirmDel;
(window as any).showToast = showToast;
(window as any).signOut = signOut;

/* ─── ESC ─── */
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') { closeDrawer(); closeDelModal(); }
});

/* ─── INIT ─── */
render();
document.getElementById('dept-list-wrap')!.style.display = 'none';
