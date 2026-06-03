const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const welcomeText = document.getElementById('welcome-text');
const roleText = document.getElementById('role-text');
const dashboardContent = document.getElementById('dashboard-content');
const loginError = document.getElementById('login-error');
const logoutButton = document.getElementById('logout-button');

const users = {
  'adminoffice': { password: 'office123', role: 'admin-office', name: 'Admin Office' },
  'admintkn': { password: 'teknik123', role: 'admin-teknik', name: 'Admin Teknik' },
  'owner': { password: 'owner123', role: 'owner', name: 'Owner' }
};

const templates = {
  'admin-office': `
    <div class="card-panel">
      <h3>Dashboard Admin Office</h3>
      <p>Kelola administrasi, surat masuk, dan laporan umum.</p>
      <ul>
        <li><a href="https://docs.google.com/forms/d/e/1FAIpQLScJVXfJpQ-example/viewform" target="_blank">Form Permintaan Dokumen</a></li>
        <li><a href="https://docs.google.com/spreadsheets/d/1ExampleOfficeSheet" target="_blank">Spreadsheet Tracking Office</a></li>
        <li><a href="#spreadsheet-embed">Lihat spreadsheet embedded</a></li>
      </ul>
    </div>
    <div class="card-panel" id="spreadsheet-embed">
      <h3>Spreadsheet Office</h3>
      <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-example/pubhtml?widget=true&amp;headers=false"></iframe>
    </div>
  `,
  'admin-teknik': `
    <div class="card-panel">
      <h3>Dashboard Admin Teknik</h3>
      <p>Kelola tugas teknis, jadwal survei, dan laporan inspeksi.</p>
      <ul>
        <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSd5xExample/viewform" target="_blank">Form Permintaan Survei</a></li>
        <li><a href="https://docs.google.com/spreadsheets/d/1ExampleTeknikSheet" target="_blank">Spreadsheet Pemantauan Teknik</a></li>
        <li><a href="#spreadsheet-embed">Lihat spreadsheet embedded</a></li>
      </ul>
    </div>
    <div class="card-panel" id="spreadsheet-embed">
      <h3>Spreadsheet Teknik</h3>
      <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-example2/pubhtml?widget=true&amp;headers=false"></iframe>
    </div>
  `,
  'owner': `
    <div class="card-panel">
      <h3>Dashboard Owner</h3>
      <p>Ringkasan laporan, persetujuan proyek, dan akses kepada dokumen prioritas.</p>
      <ul>
        <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSd6OwnerFormExample/viewform" target="_blank">Form Persetujuan Anggaran</a></li>
        <li><a href="https://docs.google.com/spreadsheets/d/1ExampleOwnerSheet" target="_blank">Spreadsheet Ringkasan Owner</a></li>
        <li><a href="#spreadsheet-embed">Lihat spreadsheet embedded</a></li>
      </ul>
    </div>
    <div class="card-panel" id="spreadsheet-embed">
      <h3>Spreadsheet Owner</h3>
      <iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-example3/pubhtml?widget=true&amp;headers=false"></iframe>
    </div>
  `
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginError.textContent = '';

  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;

  const user = users[username];
  if (!user || user.password !== password || user.role !== role) {
    loginError.textContent = 'Login gagal. Periksa username, password, dan role.';
    return;
  }

  showDashboard(user);
});

logoutButton.addEventListener('click', () => {
  loginSection.classList.add('active');
  dashboardSection.classList.remove('active');
  loginForm.reset();
  dashboardContent.innerHTML = '';
  roleText.textContent = '';
  welcomeText.textContent = '';
});

function showDashboard(user) {
  loginSection.classList.remove('active');
  dashboardSection.classList.add('active');

  welcomeText.textContent = `Halo, ${user.name}`;
  roleText.textContent = `Role: ${formatRole(user.role)}`;
  dashboardContent.innerHTML = templates[user.role] || '<p>Peran tidak ditemukan.</p>';
}

function formatRole(role) {
  switch (role) {
    case 'admin-office':
      return 'Admin Office';
    case 'admin-teknik':
      return 'Admin Teknik';
    case 'owner':
      return 'Owner';
    default:
      return role;
  }
}
