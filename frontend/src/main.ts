const apiUrl = import.meta.env.VITE_API_URL;

export const getUserData = async () => {
    const userId = await cookieStore.get("userId");
    if (!userId?.value) return null;
    const res = await fetch(`${apiUrl}/users/${userId.value}`);
    return res.json();
};

export const setCookie = (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/`;
};

export const getCookie = (name: string) => {
    const cookies = document.cookie.split('; ');
    for (let c of cookies) {
        const [key, value] = c.split('=');
        if (key === name) return value;
    }
    return null;
};

// Agar token bo'lsa — login/register sahifasiga kira olmasin
export const redirectIfAuth = async () => {
    if (getCookie("accessToken")) {
        const role = await cookieStore.get('role');
        if (role?.value === 'Doctor') {
            window.location.href = "/src/pages/doctor-dashboard";
        } else if (role?.value === 'User') {
            window.location.href = "/src/pages/user-dashboard";
        } else if(role?.value === 'Admin'){
            window.location.href = "/src/pages/doctor-management";
        } else {
            window.location.href = "/";
        }
    }
};

// Agar token yo'q bo'lsa — home sahifasiga kira olmasin
export const redirectIfNotAuth = () => {
    if (!getCookie("accessToken")) {
        window.location.href = "/src/pages/login";
    }
};