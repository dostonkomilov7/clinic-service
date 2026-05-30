import { redirectIfNotAuth, userData } from "../main";

// redirectIfNotAuth();

const apiUrl = import.meta.env.VITE_API_URL;

const appointments = document.querySelector('.app-list');
const totalAppointments = document.querySelector('.stat-value');
const date = document.querySelector('.date');
const intro = document.querySelector('.intro');
const header = document.querySelector('.headers');
const name = document.querySelector('.name');
const role = document.querySelector('.role');
const topAvtr = document.querySelector('.topbar-avatar');
const userAvtr = document.querySelector('.user-avatar');
const userId = await cookieStore.get("userId");
const fullDate = String(new Date().toDateString()).split(' ');

date!.textContent = fullDate.join(", ");
header!.textContent = userData.users[0].full_name;
intro!.textContent = userData.users[0].full_name;
name!.textContent = userData.users[0].full_name;
topAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
userAvtr!.textContent = userData.users[0].full_name[0].toUpperCase();
role!.textContent = `${userData.users[0].role === 'User' ? 'Patient' : userData.users[0].role} • ID #${userData.users[0].id}`

async function getAppointments() {


  try {
    const res = await fetch(`${apiUrl}/appointments/${userId?.value}`, {
      credentials: "include"
    })
    const data = await res.json();

    if (data.appointments.count === 0) {
      document.querySelector('.table-card')?.insertAdjacentHTML("beforeend", `
              <h5 style="text-align: center; padding: 20px 0;">Appointments is not found</h5>

            `)
      return
    }

    totalAppointments!.textContent = data.appointments.count;

    data.appointments.rows.forEach((element: any) => {
      appointments!.innerHTML += `
                  <tr>
                    <td>
                      <div class="doctor-cell">
                        <div class="doc-avatar a">${element.doctor.user.full_name[0]}</div>
                        <div>
                          <div class="doc-name">Dr. ${element.doctor.user.full_name}</div>
                          <div class="doc-spec">${element.doctor.specialization}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="apt-date">${element.appointment_date}</div>
                      <div class="apt-time">${element.appointment_time}</div>
                    </td>
                    <td><span class="type-tag in-person">In-person</span></td>
                    <td><span class="status-pill confirmed">${element.status}</span></td>
                    <td><button class="row-action">Details</button></td>
                  </tr>
                </tbody>
              </table>
            `
    });

  } catch (error) {
    throw error
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


(window as any).signOut = signOut;

getAppointments();