import { redirectIfNotAuth, getUserData } from "../main";
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
    return
}

await check()

const apiUrl = import.meta.env.VITE_API_URL;

const name = document.querySelector('.name');
const doctorAvtr = document.querySelector('.doc-avatar-lg');
const spec = document.querySelector('.spec');
const topDepart = document.querySelector('.topbar-sub');
const topAvtr = document.querySelector('.avatar-btn');
const titleDate = document.querySelector('.date');
const titleName = document.querySelector('.title-name');
const recentPatients = document.querySelector('.recent-patients');
const fullDate = String(new Date().toDateString()).split(' ');

titleDate!.textContent = fullDate.join(", ");

const userData = await getUserData();
name!.textContent = userData.users[0].full_name;
titleName!.textContent = userData.users[0].full_name;
topDepart!.textContent = userData.users[0]?.doctors[0].department;
topAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
doctorAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
spec!.textContent = `${userData.users[0]?.doctors[0].specialization} • ${userData.users[0]?.doctors[0].room_number}`

async function getDoctorApp() {
    const userId = await cookieStore.get("userId");

    const res = await fetch(`${apiUrl}/doctors/${userId?.value}`);

    const data = await res.json();
    console.log(data.doctors[0].appointments)
    data.doctors[0].appointments.forEach((element: any) => {
        recentPatients!.innerHTML += `
            <tr>
                <td>
                    <div class="patient-cell">
                    <div class="pt-avatar b">${element.user.full_name[0].toUpperCase()}</div>
                    <div>
                        <div class="pt-name">${element.user.full_name}</div>
                        <div class="pt-id">ID #${element.user.id} · ${getAge(element.user.age)}y · ${element.user.full_name[0].toUpperCase()}</div>
                    </div>
                    </div>
                </td>
                <td style="color:var(--gray-600); font-size:13px;">${strMonth(element.appointment_date)} ${element.appointment_date.split('-').at(2)} </td>
                <td style="font-size:13px; color:var(--gray-600);">Problem related to ${userData.users[0]?.doctors[0].department}</td>
                <td><span class="risk-pill medium">Medium</span></td>
                <td><span class="status-pill ${element.status.toLowerCase()}">${element.status}</span></td>
            </tr> 
        `
    });
}

function getAge(age: string) {
    const userAge = new Date().getFullYear() - new Date(age).getFullYear()

    return userAge
}

function strMonth(date: string) {
  const month = date.split('-').at(1);

  switch (month) {
    case '01': return 'January'
    case '02': return 'February'
    case '03': return 'March'
    case '04': return 'April'
    case '05': return 'May'
    case '06': return 'June'
    case '07': return 'July'
    case '08': return 'August'
    case '09': return 'September'
    case '10': return 'October'
    case '11': return 'November'
    case '12': return 'December'

    default:
      return ''
  }
}

const signOut = () => {
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('userId')
  cookieStore.delete('role')

  localStorage.clear()

  window.location.href = '/'
}

getDoctorApp();

(window as any).signOut = signOut;