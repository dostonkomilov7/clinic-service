import { redirectIfAuth, setCookie } from "../main";
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

async function handleLogin() {
    try {
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const pw = (document.getElementById('password') as HTMLInputElement).value;
        const alert = document.getElementById('alert') as HTMLElement;
        const submitBtn = document.getElementById('login-submit') as HTMLElement;

        if (!email || !pw) {
            alert.textContent = 'Please fill in all fields.';
            alert.style.display = 'block';
            return;
        }
        alert.style.display = 'none';
        // Auth logic here

        const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: pw })
        })

        const response = await res.json()

        if (!response.success) {
            alert.textContent = response.message;
            alert.style.display = 'block';
            return
        }
        console.log(response?.role)
        submitBtn.classList.add('loading');
        setTimeout(async () => {
            setCookie("accessToken", response?.accessToken);
            setCookie("refreshToken", response?.refreshToken);
            setCookie("userId", response?.userId);
            setCookie("role", response?.role);
            if (response?.role === 'Doctor') {
                window.location.href = "/src/pages/doctor-dashboard";
            } else if (response?.role === 'User') {
                window.location.href = "/src/pages/user-dashboard";
            } else {
                window.location.href = "/src/pages/doctor-management";
            }
            submitBtn.classList.remove('loading');
        }, 1500);
    } catch (error) {
        console.log(error)
        throw error
    }
}

(window as any).togglePw = togglePw;
(window as any).handleLogin = handleLogin;