import { redirectIfAuth, setCookie } from "../main";

redirectIfAuth()

const apiUrl = import.meta.env.VITE_API_URL;
const TOTAL_DIGITS: number = 6;
const RESEND_COOLDOWN: number = 60; // seconds
const CIRCUMFERENCE: number = 97.4; // 2πr for r=15.5

// State
let currentState: string = 'idle';
let resendTimer: ReturnType<typeof setInterval> | null = null;
let resendSecondsLeft: number = RESEND_COOLDOWN;
let otpValues: string[] = Array(TOTAL_DIGITS).fill('');
let resendCount: number = 0;
let autoVerifyTimeout: ReturnType<typeof setTimeout> | null = null;

// DOM refs
const inputs = Array.from({ length: TOTAL_DIGITS }, (_, i) =>
    document.getElementById(`otp-${i}`) as HTMLInputElement
);
const verifyBtn = document.getElementById('verifyBtn') as HTMLButtonElement;
const resendBtn = document.getElementById('resendBtn') as HTMLButtonElement;
const otpStatus = document.getElementById('otpStatus') as HTMLElement;
const timerNum = document.getElementById('timerNum') as HTMLElement;
const timerArc = document.getElementById('timerArc') as Element;
const resendBar = document.getElementById('resendBar') as HTMLElement;

// ─── Particles ───
function initParticles(): void {
    const container = document.getElementById('particles');
    if (!container) return;

    const sizes: number[] = [6, 8, 10, 5, 7, 9, 12, 5];
    const positions: Array<{ left: string; animDur: string; animDelay: string }> = [
        { left: '10%', animDur: '12s', animDelay: '0s' },
        { left: '25%', animDur: '9s', animDelay: '2s' },
        { left: '40%', animDur: '14s', animDelay: '1s' },
        { left: '55%', animDur: '10s', animDelay: '3s' },
        { left: '70%', animDur: '11s', animDelay: '0.5s' },
        { left: '82%', animDur: '13s', animDelay: '1.5s' },
        { left: '15%', animDur: '8s', animDelay: '4s' },
        { left: '90%', animDur: '15s', animDelay: '2.5s' },
    ];

    positions.forEach((pos, i) => {
        const dot = document.createElement('div');
        dot.className = 'particle';
        dot.style.cssText = `
      width: ${sizes[i]}px;
      height: ${sizes[i]}px;
      left: ${pos.left};
      bottom: -20px;
      animation-duration: ${pos.animDur};
      animation-delay: ${pos.animDelay};
    `;
        container.appendChild(dot);
    });
}

// ─── Email display ───
function initEmailDisplay(): void {
    // In production, read from session/URL params
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email') || 'john.doe@example.com';
    const el = document.getElementById('displayEmail');
    if (el) el.textContent = email;
}

// ─── OTP logic ───
function getOTPValue(): string {
    return otpValues.join('');
}

function isComplete(): boolean {
    return otpValues.every(v => v !== '');
}

function setStatus(type: string, message: string): void {
    otpStatus.className = `otp-status ${type}`;
    if (type === 'success') {
        otpStatus.innerHTML = `
      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      ${message}
    `;
    } else {
        otpStatus.textContent = message;
    }
}

function clearStatus(): void {
    otpStatus.className = 'otp-status';
    otpStatus.textContent = '';
}

function setInputState(state: 'error' | 'success' | 'normal'): void {
    inputs.forEach((inp, i) => {
        inp.classList.remove('error', 'success');
        if (state === 'error') inp.classList.add('error');
        if (state === 'success') {
            // stagger success animation
            setTimeout(() => inp.classList.add('success'), i * 60);
        }
    });
}

function updateFilled(idx: number): void {
    const inp = inputs[idx];
    if (otpValues[idx]) inp.classList.add('filled');
    else inp.classList.remove('filled');
    inp.classList.remove('error', 'success');
}

function updateVerifyBtn(): void {
    verifyBtn.disabled = !isComplete() || currentState === 'loading';
}

// ─── OTP Input Handler ───
function handleOTPInput(e: Event, idx: number): void {
    const input = e.target as HTMLInputElement;
    const raw = input.value.replace(/[^0-9]/g, '');

    // Handle paste of full code
    if (raw.length === TOTAL_DIGITS) {
        raw.split('').forEach((digit, i) => {
            otpValues[i] = digit;
            inputs[i].value = digit;
            updateFilled(i);
        });
        inputs[TOTAL_DIGITS - 1].focus();
        updateVerifyBtn();
        clearStatus();
        if (autoVerifyTimeout) clearTimeout(autoVerifyTimeout);
        autoVerifyTimeout = setTimeout(handleVerify, 300);
        return;
    }

    // Single digit
    const digit = raw.slice(-1);
    otpValues[idx] = digit;
    input.value = digit;
    updateFilled(idx);
    clearStatus();

    if (digit && idx < TOTAL_DIGITS - 1) {
        inputs[idx + 1].focus();
    }

    updateVerifyBtn();

    // Auto-verify when all filled
    if (isComplete()) {
        if (autoVerifyTimeout) clearTimeout(autoVerifyTimeout);
        autoVerifyTimeout = setTimeout(handleVerify, 400);
    }
}

function handleOTPKeydown(e: KeyboardEvent, idx: number): void {
    if (e.key === 'Backspace') {
        e.preventDefault();
        if (otpValues[idx]) {
            otpValues[idx] = '';
            inputs[idx].value = '';
            updateFilled(idx);
        } else if (idx > 0) {
            otpValues[idx - 1] = '';
            inputs[idx - 1].value = '';
            updateFilled(idx - 1);
            inputs[idx - 1].focus();
        }
        clearStatus();
        updateVerifyBtn();
    } else if (e.key === 'ArrowLeft' && idx > 0) {
        inputs[idx - 1].focus();
    } else if (e.key === 'ArrowRight' && idx < TOTAL_DIGITS - 1) {
        inputs[idx + 1].focus();
    } else if (e.key === 'Enter' && isComplete()) {
        handleVerify();
    }
}

function handleOTPFocus(idx: number): void {
    inputs[idx].select();
}

// ─── Attach OTP listeners ───
inputs.forEach((inp, idx) => {
    inp.addEventListener('input', (e) => handleOTPInput(e, idx));
    inp.addEventListener('keydown', (e) => handleOTPKeydown(e as KeyboardEvent, idx));
    inp.addEventListener('focus', () => handleOTPFocus(idx));
    inp.addEventListener('paste', (e: ClipboardEvent) => {
        e.preventDefault();
        const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, inputs.length - idx);
        if (!text) return;

        text.split('').forEach((char, i) => {
            const target = inputs[idx + i];
            if (target) {
                target.value = char;
                target.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        // Focus the next empty input after paste, or last one
        const nextEmpty = inputs[idx + text.length];
        (nextEmpty ?? inputs[inputs.length - 1]).focus();
    });
});

// ─── Verify Handler ───
async function handleVerify(): Promise<void> {
    if (!isComplete() || currentState === 'loading') return;

    const code = getOTPValue();
    currentState = 'loading';
    updateVerifyBtn();

    // Loading state
    verifyBtn.innerHTML = '<div class="spinner"></div>';
    verifyBtn.disabled = true;

    // Simulate API call
    await new Promise<void>(resolve => setTimeout(resolve, 1200));

    const email = window.location.href.split('=').at(-1)
    const response = await fetch(`${apiUrl}/auth/activate`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code })
    })

    const res = await response.json()

    if (res.success) {
        setCookie("accessToken", res?.accessToken);
        setCookie("refreshToken", res?.refreshToken);
        setCookie("userId", res?.userId);
        setCookie("userId", res?.role);
        currentState = 'success';
        setInputState('success');
        setStatus('success', 'Code verified successfully!');

        verifyBtn.innerHTML = `
      <div class="check-circle">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      Verified!
    `;
        verifyBtn.style.background = 'var(--teal-400)';

        setTimeout(showSuccessOverlay, 800);
    } else {
        // Error
        currentState = 'idle';
        setInputState('error');
        setStatus('error', 'Incorrect code. Please check your email and try again.');

        verifyBtn.innerHTML = `
      <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      Verify Email
    `;
        verifyBtn.disabled = false;

        // Shake and clear after delay
        setTimeout(() => {
            otpValues = Array(TOTAL_DIGITS).fill('');
            inputs.forEach(inp => {
                inp.value = '';
                inp.classList.remove('error', 'filled');
            });
            clearStatus();
            updateVerifyBtn();
            inputs[0].focus();
        }, 1500);
    }
}

// ─── Success Overlay ───
function showSuccessOverlay(): void {
    const overlay = document.getElementById('successOverlay');
    const iconWrap = document.getElementById('successIconWrap');
    if (!overlay || !iconWrap) return;

    overlay.classList.add('show');

    // Spawn confetti dots
    const colors = ['#1D9E75', '#9FE1CB', '#EF9F27', '#D85A30', '#378ADD', '#E1F5EE'];
    const directions: Array<{ tx: string; ty: string }> = [
        { tx: '-60px', ty: '-80px' }, { tx: '60px', ty: '-80px' },
        { tx: '-90px', ty: '-40px' }, { tx: '90px', ty: '-40px' },
        { tx: '-40px', ty: '-100px' }, { tx: '40px', ty: '-100px' },
        { tx: '-80px', ty: '-60px' }, { tx: '80px', ty: '-60px' },
    ];

    directions.forEach((dir, i) => {
        const dot = document.createElement('div');
        dot.className = 'confetti-dot';
        const size = 8 + Math.random() * 8;
        dot.style.cssText = `
      width: ${size}px; height: ${size}px;
      background: ${colors[i % colors.length]};
      top: 50%; left: 50%;
      --tx: ${dir.tx}; --ty: ${dir.ty};
      --dur: ${0.6 + Math.random() * 0.4}s;
      --delay: ${i * 0.05}s;
    `;
        iconWrap.appendChild(dot);
    });
}

// ─── Resend Timer ───
function startResendTimer(): void {
    resendSecondsLeft = RESEND_COOLDOWN;
    resendBtn.disabled = true;

    // Reset bar
    if (resendBar) {
        resendBar.style.transition = 'none';
        resendBar.style.width = '100%';
        void resendBar.offsetWidth; // force reflow
        resendBar.style.transition = `width ${RESEND_COOLDOWN}s linear`;
        resendBar.style.width = '0%';
    }

    if (resendTimer) clearInterval(resendTimer);

    resendTimer = setInterval(() => {
        resendSecondsLeft--;
        const progress = resendSecondsLeft / RESEND_COOLDOWN;
        const offset = CIRCUMFERENCE * (1 - progress);

        if (timerNum) timerNum.textContent = String(resendSecondsLeft);
        if (timerArc) (timerArc as SVGCircleElement).style.strokeDashoffset = String(offset);

        if (resendSecondsLeft <= 0) {
            clearInterval(resendTimer!);
            resendBtn.disabled = false;
            if (timerNum) timerNum.textContent = '✓';
            if (timerArc) (timerArc as SVGCircleElement).style.strokeDashoffset = String(CIRCUMFERENCE);
        }
    }, 1000);
}

function handleResend(): void {
    if (resendBtn.disabled) return;

    resendCount++;
    const toastMsg = resendCount === 1
        ? 'Code resent! Check your inbox.'
        : `Code resent again (attempt ${resendCount}). Also check spam.`;

    showToast(toastMsg);
    startResendTimer();

    // Clear inputs
    otpValues = Array(TOTAL_DIGITS).fill('');
    inputs.forEach(inp => {
        inp.value = '';
        inp.classList.remove('filled', 'error', 'success');
    });
    clearStatus();
    updateVerifyBtn();
    inputs[0].focus();

    // Reset verify btn
    currentState = 'idle';
    verifyBtn.innerHTML = `
    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
    Verify Email
  `;
    verifyBtn.style.background = '';
}

// ─── Toast ───
function showToast(message: string, type: string = 'success'): void {
    // Remove any existing
    document.querySelectorAll('.medibook-toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'medibook-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%) translateY(12px)',
        background: type === 'error' ? 'var(--coral-400)' : 'var(--teal-600)',
        color: '#fff',
        padding: '13px 24px',
        borderRadius: '100px',
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s, transform 0.3s',
        boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(12px)';
        setTimeout(() => toast.remove(), 350);
    }, 3500);
}

// ─── Init ───
function init(): void {
    initParticles();
    initEmailDisplay();
    startResendTimer();
    inputs[0].focus();

    // Hint toast after delay
    setTimeout(() => {
        showToast('💡  Demo: enter 4 8 2 7 1 6 to verify');
    }, 2000);
}

document.addEventListener('DOMContentLoaded', init);

(window as any).handleResend = handleResend;