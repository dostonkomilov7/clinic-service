const DOCTORS = [
  { name: 'Dr. Sarah Rahman',  initials: 'SR', specialty: 'Cardiologist',        rating: 4.9, patients: 142, years: 12, bgColor: 'linear-gradient(135deg,#1D9E75,#085041)' },
  { name: 'Dr. Michael Kim',   initials: 'MK', specialty: 'Dermatologist',       rating: 4.7, patients: 98,  years: 8,  bgColor: 'linear-gradient(135deg,#378ADD,#185FA5)' },
  { name: 'Dr. Ayesha Patel',  initials: 'AP', specialty: 'Neurologist',         rating: 4.8, patients: 74,  years: 10, bgColor: 'linear-gradient(135deg,#D85A30,#8B3515)' },
  { name: 'Dr. Thomas Nguyen', initials: 'TN', specialty: 'General Practitioner',rating: 4.6, patients: 210, years: 15, bgColor: 'linear-gradient(135deg,#EF9F27,#A56B0A)' },
];

const TESTIMONIALS = [
  { text: 'MediBook completely transformed how I manage my health. Booking was seamless, the reminder system is brilliant, and I can access all my records in seconds.', author: 'James Mitchell', role: 'Patient since 2023', initials: 'JM', color: '#1D9E75', rating: 5 },
  { text: 'I had a cardiac follow-up due in 3 days and found an available specialist within minutes. The virtual consultation feature saved me hours of travel.', author: 'Linda Park', role: 'Patient since 2024', initials: 'LP', color: '#378ADD', rating: 5 },
  { text: 'As someone managing a chronic condition, having all my prescriptions, test results, and appointments in one place is genuinely life-changing. Highly recommend.', author: 'Priya Sharma', role: 'Patient since 2022', initials: 'PS', color: '#D85A30', rating: 5 },
];

function renderDoctors() {
  const grid = document.getElementById('doctorsGrid');
  if (!grid) return;
  grid.innerHTML = DOCTORS.map(doc => {
    const stars = '★'.repeat(Math.round(doc.rating)) + '☆'.repeat(5 - Math.round(doc.rating));
    return `
    <div class="doctor-card">
      <div class="doc-card-top" style="background:${doc.bgColor};">
        <div class="doc-av-large" style="background:${doc.bgColor};">${doc.initials}</div>
      </div>
      <div class="doc-card-body">
        <div class="doc-card-name">${doc.name}</div>
        <div class="doc-card-spec">${doc.specialty}</div>
        <div class="doc-card-rating"><span class="stars">${stars}</span><span class="rating-num">${doc.rating}</span></div>
        <div class="doc-card-meta">
          <div class="dcm-item"><div class="dcm-val">${doc.patients}</div><div class="dcm-lbl">Patients</div></div>
          <div class="dcm-div"></div>
          <div class="dcm-item"><div class="dcm-val">${doc.years}yr</div><div class="dcm-lbl">Experience</div></div>
          <div class="dcm-div"></div>
          <div class="dcm-item"><div class="dcm-val">${doc.rating}</div><div class="dcm-lbl">Rating</div></div>
        </div>
        <button class="doc-book-btn" onclick="openBookingModal()">Book appointment</button>
      </div>
    </div>`;
  }).join('');
}

function renderTestimonials() {
  const grid = document.getElementById('testiGrid');
  if (!grid) return;
  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card">
      <span class="testi-quote-mark">"</span>
      <p class="testi-text">${t.text}</p>
      <div class="testi-author">
        <div class="testi-av" style="background:${t.color};">${t.initials}</div>
        <div><div class="testi-name">${t.author}</div><div class="testi-role">${t.role}</div></div>
        <div class="testi-stars">${'★'.repeat(t.rating)}</div>
      </div>
    </div>`).join('');
}

function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .spec-card, .doctor-card, .slot, .how-step, .testi-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
}

function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function animateCounter(el: Element, target: number, suffix: string, duration: number) {
  const start = performance.now();
  const update = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    (el as HTMLElement).textContent = Math.round(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = [
    { id: 'counterPatients', target: 12, suffix: 'k+' },
    { id: 'counterDoctors',  target: 340, suffix: '+' },
    { id: 'counterRating',   target: 98,  suffix: '%' },
  ];
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const data = counters.find(c => c.id === entry.target.id);
        if (data) animateCounter(entry.target, data.target, data.suffix, 1800);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => { const el = document.getElementById(c.id); if (el) obs.observe(el); });
}

function selectSlot(el: HTMLElement) {
  document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
}

function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
}

function handleModalOverlay(e: MouseEvent) {
  if (e.target === document.getElementById('bookingModal')) closeBookingModal();
}

function submitBooking() {
  closeBookingModal();
  showToast('✓ \u00a0Appointment request sent! We\'ll confirm shortly.', '#0F6E56');
}

function showToast(html: string, bg: string, duration = 4000) {
  const toast = document.createElement('div');
  toast.innerHTML = html;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '2rem', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: bg, color: '#fff',
    padding: '14px 24px', borderRadius: '100px',
    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: '500',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    zIndex: '9999', opacity: '0',
    transition: 'opacity 0.3s, transform 0.3s',
  });
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; }, 20);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, duration);
}

document.getElementById('watchDemoBtn')?.addEventListener('click', () => {
  showToast('🎬 \u00a0Demo video coming soon!', '#1A1916', 3000);
});

document.getElementById('hamburger')?.addEventListener('click', () => {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const links = nav.querySelector('.nav-links') as HTMLElement | null;
  const ctas  = nav.querySelector('.nav-ctas') as HTMLElement | null;
  if (!links) return;
  const isOpen = links.style.display === 'flex';
  links.style.cssText = isOpen ? '' : 'display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;background:rgba(245,242,236,0.96);backdrop-filter:blur(18px);padding:2rem;gap:1.5rem;border-bottom:1px solid rgba(0,0,0,0.08);z-index:99;';
  if (ctas) ctas.style.cssText = isOpen ? '' : 'display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;background:rgba(245,242,236,0.96);backdrop-filter:blur(18px);padding:0 2rem 2rem;gap:0.75rem;z-index:99;margin-top:10rem;';
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBookingModal(); });

/* ─── EXPOSE GLOBALS ─── */
(window as any).openBookingModal = openBookingModal;
(window as any).closeBookingModal = closeBookingModal;
(window as any).handleModalOverlay = handleModalOverlay;
(window as any).submitBooking = submitBooking;
(window as any).selectSlot = selectSlot;

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  renderDoctors();
  renderTestimonials();
  initCursor();
  initNavScroll();
  initScrollReveal();
  initCounters();
});
