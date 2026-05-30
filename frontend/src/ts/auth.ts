// import { redirectIfAuth } from "../main";

// redirectIfAuth()

// ── Helpers ─────────────────────────────────────────────────────────

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function showState(stateId: string): void {
  document.querySelectorAll<HTMLElement>('.form-state').forEach(el => {
    el.classList.remove('active');
  });
  const target = $(stateId);
  if (target) {
    target.classList.add('active');
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function setFieldError(inputId: string, message: string): void {
  const wrap = ($(inputId) as HTMLInputElement)?.closest('.field-wrap');
  wrap?.classList.toggle('error', message.length > 0);
  const errEl = $(`${inputId}Error`);
  if (errEl) errEl.textContent = message;
}

function clearFieldError(inputId: string): void {
  setFieldError(inputId, '');
}

function setButtonLoading(btn: HTMLButtonElement, loading: boolean): void {
  if (loading) {
    btn.disabled = true;
    const originalContent = btn.innerHTML;
    btn.dataset.original = originalContent;
    btn.innerHTML = `<div class="spinner"></div><span>Sending…</span>`;
  } else {
    btn.disabled = false;
    if (btn.dataset.original) btn.innerHTML = btn.dataset.original;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ── Password Strength ────────────────────────────────────────────────

interface StrengthResult {
  score: number; // 0–4
  label: string;
  cls: string;
  rules: { length: boolean; upper: boolean; number: boolean; special: boolean };
}

function evaluatePassword(pw: string): StrengthResult {
  const rules = {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(rules).filter(Boolean).length;
  const map: Record<number, { label: string; cls: string }> = {
    0: { label: 'Too short',  cls: '' },
    1: { label: 'Weak',       cls: 'weak' },
    2: { label: 'Fair',       cls: 'fair' },
    3: { label: 'Good',       cls: 'good' },
    4: { label: 'Strong',     cls: 'strong' },
  };
  return { score, ...map[score], rules };
}

function renderStrength(pw: string): void {
  const wrap = $('strengthWrap');
  const label = $('strengthLabel');
  if (!wrap || !label) return;

  if (!pw) {
    wrap.classList.remove('visible');
    return;
  }

  wrap.classList.add('visible');
  const result = evaluatePassword(pw);

  // Bars
  for (let i = 1; i <= 4; i++) {
    const bar = $(`sb${i}`);
    if (!bar) continue;
    bar.className = 'strength-bar';
    if (i <= result.score && result.cls) bar.classList.add(result.cls);
  }

  // Label
  label.textContent = result.label;
  label.className = `strength-label${result.cls ? ' ' + result.cls : ''}`;

  // Rules
  const ruleMap: Record<keyof typeof result.rules, string> = {
    length:  'rule-length',
    upper:   'rule-upper',
    number:  'rule-number',
    special: 'rule-special',
  };
  for (const [key, elId] of Object.entries(ruleMap)) {
    const el = $(elId);
    if (el) el.classList.toggle('met', result.rules[key as keyof typeof result.rules]);
  }
}

// ── Toggle password visibility ────────────────────────────────────────

function initPasswordToggles(): void {
  document.querySelectorAll<HTMLElement>('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      const input = $(targetId) as HTMLInputElement | null;
      if (!input) return;
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      const showIcon = btn.querySelector<SVGElement>('.eye-show');
      const hideIcon = btn.querySelector<SVGElement>('.eye-hide');
      if (showIcon) showIcon.style.display = isHidden ? 'none' : '';
      if (hideIcon) hideIcon.style.display = isHidden ? '' : 'none';
    });
  });
}

// ── Forgot Password page ─────────────────────────────────────────────

function initForgotPassword(): void {
  const emailInput = $('emailInput') as HTMLInputElement | null;
  const sendBtn    = $('sendLinkBtn') as HTMLButtonElement | null;
  if (!emailInput || !sendBtn) return;

  // Clear error on input
  emailInput.addEventListener('input', () => clearFieldError('emailInput'));

  emailInput.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') sendBtn.click();
  });

  sendBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();

    // Validate
    if (!email) {
      setFieldError('emailInput', 'Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setFieldError('emailInput', 'Please enter a valid email address.');
      return;
    }

    // Simulate API call
    setButtonLoading(sendBtn, true);
    await delay(1400);
    setButtonLoading(sendBtn, false);

    // Show sent state
    const display = $('sentEmailDisplay');
    if (display) display.textContent = email;
    showState('state-sent');
    startResendCountdown();
  });

  // Resend button
  const resendBtn = $('resendBtn') as HTMLButtonElement | null;
  resendBtn?.addEventListener('click', async () => {
    if (resendBtn.disabled) return;
    setButtonLoading(resendBtn, true);
    await delay(1000);
    setButtonLoading(resendBtn, false);
    startResendCountdown();
  });
}

let countdownInterval: ReturnType<typeof setInterval> | null = null;

function startResendCountdown(): void {
  const resendBtn   = $('resendBtn')    as HTMLButtonElement | null;
  const timerEl     = $('resendTimer');
  const countdownEl = $('countdown');
  if (!resendBtn || !timerEl || !countdownEl) return;

  if (countdownInterval) clearInterval(countdownInterval);

  let secs = 60;
  resendBtn.disabled = true;
  timerEl.style.display = 'block';
  countdownEl.textContent = String(secs);

  countdownInterval = setInterval(() => {
    secs--;
    countdownEl.textContent = String(secs);
    if (secs <= 0) {
      clearInterval(countdownInterval!);
      resendBtn.disabled = false;
      timerEl.style.display = 'none';
    }
  }, 1000);
}

// ── Reset Password page ──────────────────────────────────────────────

function initResetPassword(): void {
  const newPwInput  = $('newPassword')  as HTMLInputElement | null;
  const confPwInput = $('confirmPassword') as HTMLInputElement | null;
  const resetBtn    = $('resetBtn')     as HTMLButtonElement | null;
  if (!newPwInput || !confPwInput || !resetBtn) return;

  // Simulate: show expired state if URL has ?expired=1
  if (window.location.search.includes('expired=1')) {
    showState('state-expired');
    return;
  }

  // Live strength feedback
  newPwInput.addEventListener('input', () => {
    clearFieldError('newPassword');
    renderStrength(newPwInput.value);
    // Re-validate confirm match if already typed
    if (confPwInput.value) validateConfirm();
  });

  confPwInput.addEventListener('input', () => {
    clearFieldError('confirmPassword');
    validateConfirm();
  });

  confPwInput.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') resetBtn.click();
  });

  function validateConfirm(): boolean {
    if (confPwInput!.value && confPwInput!.value !== newPwInput!.value) {
      setFieldError('confirmPassword', 'Passwords do not match.');
      return false;
    }
    clearFieldError('confirmPassword');
    return true;
  }

  resetBtn.addEventListener('click', async () => {
    const pw   = newPwInput.value;
    const conf = confPwInput.value;
    let valid  = true;

    // Validate new password
    if (!pw) {
      setFieldError('newPassword', 'Please enter a new password.');
      valid = false;
    } else {
      const result = evaluatePassword(pw);
      if (result.score < 2) {
        setFieldError('newPassword', 'Password is too weak. Please follow the rules below.');
        valid = false;
      }
    }

    // Validate confirm
    if (!conf) {
      setFieldError('confirmPassword', 'Please confirm your new password.');
      valid = false;
    } else if (conf !== pw) {
      setFieldError('confirmPassword', 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    // Simulate API call
    const originalHTML = resetBtn.innerHTML;
    resetBtn.disabled = true;
    resetBtn.innerHTML = `<div class="spinner"></div><span>Updating…</span>`;
    await delay(1600);
    resetBtn.disabled = false;
    resetBtn.innerHTML = originalHTML;

    showState('state-success');
  });
}

// ── Utility ─────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Boot ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initForgotPassword();
  initResetPassword();
});