import { redirectIfAuth } from "../main";
const apiUrl = import.meta.env.VITE_API_URL;

redirectIfAuth()

function togglePw() {
    const input = document.getElementById('password') as HTMLInputElement;
    const icon = document.getElementById('pw-icon') as HTMLElement;
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
    } else {
        input.type = 'password';
        icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    }
}

const colors = ['#E24B4A', '#EF9F27', '#1D9E75', '#0F6E56'];
const labels = ['Weak', 'Fair', 'Good', 'Strong'];

function checkStrength(val: string) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById('sb' + i) as HTMLElement;
        bar.style.background = i <= score ? colors[score - 1] : 'var(--gray-100)';
    }

    const txt = document.getElementById('strength-text') as HTMLElement;
    txt.textContent = val.length ? labels[score - 1] || '' : '';
    txt.style.color = val.length && score > 0 ? colors[score - 1] : 'var(--gray-400)';
}

function updateSteps(el: HTMLInputElement) {
    const doctor = (document.getElementById('role-doctor') as HTMLInputElement);
    if (el.id === "role-doctor") {
        el.value = "Doctor"
    } else {
        doctor.value = "User"
    }
    const steps = ['step-1', 'step-2', 'step-3'];
    steps.forEach((id, i) => {
        (document.getElementById(id) as HTMLElement).className = 'step-dot' + (i === 0 ? ' active' : '');
    });
    (document.getElementById('step-label') as HTMLElement).textContent = 'Personal info';


}

async function handleRegister() {
    const fname = (document.getElementById('first-name') as HTMLInputElement).value.trim();
    const lname = (document.getElementById('last-name') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const phone = (document.getElementById('phone') as HTMLInputElement).value.trim();
    const dob = (document.getElementById('dob') as HTMLInputElement).value;
    const pw = (document.getElementById('password') as HTMLInputElement).value;
    const terms = (document.getElementById('terms') as HTMLInputElement).checked;
    const alert = document.getElementById('alert') as HTMLElement;
    const submitBtn = document.getElementById('submit-btn') as HTMLElement;
    const isDoctor = (document.getElementById('role-doctor') as HTMLInputElement).value;

    if (!fname || !lname || !email || !pw || !phone) {
        alert.textContent = 'Please fill in all required fields.';
        alert.style.display = 'block';
        return;
    }
    if (pw.length < 8) {
        alert.textContent = 'Password must be at least 8 characters.';
        alert.style.display = 'block';
        return;
    }
    if (!terms) {
        alert.textContent = 'Please agree to the Terms of Service to continue.';
        alert.style.display = 'block';
        return;
    }
    const fullName = fname + ' ' + lname;
    alert.style.display = 'none';
    // Registration logic here

    const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            full_name: fullName,
            age: dob || null,
            email: email,
            password: pw,
            phone: phone,
            role: isDoctor
        })
    })
    const response = await res.json()

    if (!response.success) {
        alert.textContent = response.message;
        alert.style.display = 'block';
        return
    }

    submitBtn.classList.add('loading');
    setTimeout(async () => {
        submitBtn.classList.remove('loading');
        window.location.href = `/src/pages/verify-email?email=${email}`;
        submitBtn.classList.remove('loading');
    }, 1500);
}

(window as any).togglePw = togglePw;
(window as any).checkStrength = checkStrength;
(window as any).updateSteps = updateSteps;
(window as any).handleRegister = handleRegister;