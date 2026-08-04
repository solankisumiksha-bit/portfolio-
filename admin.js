/* ============================================================
   ADMIN DASHBOARD — JavaScript Logic
   Sumiksha Portfolio Admin Panel
   ============================================================ */

/* ---- CONFIG ---- */
// Change this password to whatever you want
const ADMIN_PASSWORD = 'sumiksha2024';

/* ---- STATE ---- */
let deleteTarget = null; // { type, id }

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (sessionStorage.getItem('admin_auth') === 'true') {
        showDashboard();
    }

    initLogin();
    initNav();
    initProjects();
    initExperience();
    initCertificates();
    initSkills();
    initProfilePhoto();
    initModal();
    initSidebarToggle();
});

/* ============================================================
   LOGIN
   ============================================================ */
function initLogin() {
    const form  = document.getElementById('login-form');
    const errEl = document.getElementById('login-error');
    const input = document.getElementById('admin-pass');

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (input.value === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_auth', 'true');
            errEl.style.display = 'none';
            showDashboard();
        } else {
            errEl.style.display = 'flex';
            input.value = '';
            input.focus();
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('admin_auth');
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
        input.value = '';
        input.focus();
    });
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    renderAllLists();
}

/* ============================================================
   SIDEBAR NAVIGATION
   ============================================================ */
function initNav() {
    const navBtns  = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');
    const titleEl  = document.getElementById('topbar-title');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-section');
            titleEl.textContent = btn.querySelector('span').textContent;

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById('section-' + target).classList.add('active');

            // Close sidebar on mobile
            if (window.innerWidth < 900) {
                document.getElementById('sidebar').classList.remove('open');
            }
        });
    });
}

function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar   = document.getElementById('sidebar');
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    // Close on outside click
    document.addEventListener('click', e => {
        if (window.innerWidth < 900 && sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

/* ============================================================
   PROJECTS
   ============================================================ */
function initProjects() {
    const addBtn    = document.getElementById('add-project-btn');
    const formCard  = document.getElementById('project-form-card');
    const form      = document.getElementById('project-form');
    const cancelBtn = document.getElementById('cancel-project-btn');

    addBtn.addEventListener('click', () => {
        resetProjectForm();
        document.getElementById('project-form-title').textContent = 'New Project';
        formCard.style.display = 'block';
        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    cancelBtn.addEventListener('click', () => {
        formCard.style.display = 'none';
        resetProjectForm();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const editId = document.getElementById('project-edit-id').value;
        const projects = getProjects();

        const data = {
            id:           editId || uid(),
            title:        document.getElementById('proj-title').value.trim(),
            category:     document.getElementById('proj-category').value,
            description:  document.getElementById('proj-desc').value.trim(),
            tags:         document.getElementById('proj-tags').value.trim(),
            liveUrl:      document.getElementById('proj-live').value.trim(),
            githubUrl:    document.getElementById('proj-github').value.trim(),
            caseStudyUrl: document.getElementById('proj-casestudy').value.trim(),
        };

        if (editId) {
            const idx = projects.findIndex(p => p.id === editId);
            if (idx > -1) projects[idx] = data;
        } else {
            projects.push(data);
        }

        saveProjects(projects);
        formCard.style.display = 'none';
        resetProjectForm();
        renderProjectsList();
        showToast(editId ? 'Project updated!' : 'Project added!');
    });

    renderProjectsList();
}

function resetProjectForm() {
    document.getElementById('project-edit-id').value = '';
    document.getElementById('proj-title').value = '';
    document.getElementById('proj-category').value = 'web';
    document.getElementById('proj-desc').value = '';
    document.getElementById('proj-tags').value = '';
    document.getElementById('proj-live').value = '';
    document.getElementById('proj-github').value = '';
    document.getElementById('proj-casestudy').value = '';
}

function renderProjectsList() {
    const projects  = getProjects();
    const list      = document.getElementById('projects-list');
    const emptyEl   = document.getElementById('projects-empty');
    const iconMap   = { web: 'fa-laptop-code', data: 'fa-chart-column', other: 'fa-code' };

    if (projects.length === 0) {
        list.innerHTML = '';
        emptyEl.style.display = 'block';
        return;
    }
    emptyEl.style.display = 'none';

    list.innerHTML = projects.map((p, i) => `
        <div class="item-card">
            <div class="item-icon"><i class="fa-solid ${iconMap[p.category] || 'fa-laptop-code'}"></i></div>
            <div class="item-body">
                <div class="item-title">${esc(p.title)}</div>
                <div class="item-meta">
                    <span class="item-tag" style="display:inline-flex">${esc(p.category)}</span>
                    ${p.caseStudyUrl ? `<span class="item-tag" style="display:inline-flex;background:rgba(168,85,247,.15);color:#c084fc;border-color:rgba(168,85,247,.3)"><i class="fa-solid fa-book-open" style="margin-right:4px"></i> Case Study</span>` : ''}
                </div>
                <div class="item-desc">${esc(p.description)}</div>
                ${p.tags ? `<div class="item-tags">${p.tags.split(',').map(t => `<span class="item-tag">${esc(t.trim())}</span>`).join('')}</div>` : ''}
            </div>
            <div class="item-actions">
                <button class="btn-icon edit" title="Edit" onclick="editProject('${p.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon del"  title="Delete" onclick="deleteItem('project','${p.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function editProject(id) {
    const p = getProjects().find(p => p.id === id);
    if (!p) return;
    document.getElementById('project-edit-id').value   = id;
    document.getElementById('proj-title').value      = p.title;
    document.getElementById('proj-category').value   = p.category;
    document.getElementById('proj-desc').value       = p.description;
    document.getElementById('proj-tags').value       = p.tags || '';
    document.getElementById('proj-live').value       = p.liveUrl || '';
    document.getElementById('proj-github').value     = p.githubUrl || '';
    document.getElementById('proj-casestudy').value  = p.caseStudyUrl || '';

    document.getElementById('project-form-title').textContent = 'Edit Project';
    const card = document.getElementById('project-form-card');
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getProjects()       { return JSON.parse(localStorage.getItem('portfolio_projects') || '[]'); }
function saveProjects(data)  { localStorage.setItem('portfolio_projects', JSON.stringify(data)); }

/* ============================================================
   EXPERIENCE
   ============================================================ */
function initExperience() {
    const addBtn    = document.getElementById('add-exp-btn');
    const formCard  = document.getElementById('exp-form-card');
    const form      = document.getElementById('exp-form');
    const cancelBtn = document.getElementById('cancel-exp-btn');

    addBtn.addEventListener('click', () => {
        resetExpForm();
        document.getElementById('exp-form-title').textContent = 'New Experience';
        formCard.style.display = 'block';
        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    cancelBtn.addEventListener('click', () => {
        formCard.style.display = 'none';
        resetExpForm();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const editId = document.getElementById('exp-edit-id').value;
        const list = getExperience();

        const data = {
            id:          editId || uid(),
            role:        document.getElementById('exp-role').value.trim(),
            company:     document.getElementById('exp-company').value.trim(),
            period:      document.getElementById('exp-period').value.trim(),
            description: document.getElementById('exp-desc').value.trim(),
        };

        if (editId) {
            const idx = list.findIndex(e => e.id === editId);
            if (idx > -1) list[idx] = data;
        } else {
            list.push(data);
        }

        saveExperience(list);
        formCard.style.display = 'none';
        resetExpForm();
        renderExpList();
        showToast(editId ? 'Experience updated!' : 'Experience added!');
    });

    renderExpList();
}

function resetExpForm() {
    document.getElementById('exp-edit-id').value = '';
    document.getElementById('exp-role').value = '';
    document.getElementById('exp-company').value = '';
    document.getElementById('exp-period').value = '';
    document.getElementById('exp-desc').value = '';
}

function renderExpList() {
    const list    = getExperience();
    const listEl  = document.getElementById('experience-list');
    const emptyEl = document.getElementById('experience-empty');

    if (list.length === 0) { listEl.innerHTML = ''; emptyEl.style.display = 'block'; return; }
    emptyEl.style.display = 'none';

    listEl.innerHTML = list.map(e => `
        <div class="item-card">
            <div class="item-icon"><i class="fa-solid fa-briefcase"></i></div>
            <div class="item-body">
                <div class="item-title">${esc(e.role)}</div>
                <div class="item-meta">${esc(e.company)} &nbsp;·&nbsp; ${esc(e.period)}</div>
                <div class="item-desc">${esc(e.description)}</div>
            </div>
            <div class="item-actions">
                <button class="btn-icon edit" title="Edit" onclick="editExperience('${e.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon del"  title="Delete" onclick="deleteItem('experience','${e.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function editExperience(id) {
    const e = getExperience().find(e => e.id === id);
    if (!e) return;
    document.getElementById('exp-edit-id').value  = id;
    document.getElementById('exp-role').value     = e.role;
    document.getElementById('exp-company').value  = e.company;
    document.getElementById('exp-period').value   = e.period;
    document.getElementById('exp-desc').value     = e.description;

    document.getElementById('exp-form-title').textContent = 'Edit Experience';
    const card = document.getElementById('exp-form-card');
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getExperience()       { return JSON.parse(localStorage.getItem('portfolio_experience') || '[]'); }
function saveExperience(data)  { localStorage.setItem('portfolio_experience', JSON.stringify(data)); }

/* ============================================================
   CERTIFICATES
   ============================================================ */
function initCertificates() {
    const addBtn    = document.getElementById('add-cert-btn');
    const formCard  = document.getElementById('cert-form-card');
    const form      = document.getElementById('cert-form');
    const cancelBtn = document.getElementById('cancel-cert-btn');

    // File upload -> Data URL conversion
    const fileInput = document.getElementById('cert-file');
    if (fileInput) {
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    document.getElementById('cert-img').value = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addBtn.addEventListener('click', () => {
        resetCertForm();
        document.getElementById('cert-form-title').textContent = 'New Certificate';
        formCard.style.display = 'block';
        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    cancelBtn.addEventListener('click', () => {
        formCard.style.display = 'none';
        resetCertForm();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const editId = document.getElementById('cert-edit-id').value;
        const list = getCertificates();

        const data = {
            id:        editId || uid(),
            title:     document.getElementById('cert-title').value.trim(),
            issuer:    document.getElementById('cert-issuer').value.trim(),
            year:      document.getElementById('cert-year').value.trim(),
            verifyUrl: document.getElementById('cert-verify').value.trim(),
            imgUrl:    document.getElementById('cert-img').value.trim(),
        };

        if (editId) {
            const idx = list.findIndex(c => c.id === editId);
            if (idx > -1) list[idx] = data;
        } else {
            list.push(data);
        }

        saveCertificates(list);
        formCard.style.display = 'none';
        resetCertForm();
        renderCertList();
        showToast(editId ? 'Certificate updated!' : 'Certificate added!');
    });

    renderCertList();
}

function resetCertForm() {
    document.getElementById('cert-edit-id').value = '';
    document.getElementById('cert-title').value = '';
    document.getElementById('cert-issuer').value = '';
    document.getElementById('cert-year').value = '';
    document.getElementById('cert-verify').value = '';
    document.getElementById('cert-img').value = '';
    const fileInput = document.getElementById('cert-file');
    if (fileInput) fileInput.value = '';
}

function renderCertList() {
    const list    = getCertificates();
    const listEl  = document.getElementById('certificates-list');
    const emptyEl = document.getElementById('certificates-empty');

    if (list.length === 0) { listEl.innerHTML = ''; emptyEl.style.display = 'block'; return; }
    emptyEl.style.display = 'none';

    listEl.innerHTML = list.map(c => `
        <div class="item-card">
            ${c.imgUrl ? `<div class="item-icon" style="padding:0;overflow:hidden"><img src="${esc(c.imgUrl)}" style="width:100%;height:100%;object-fit:cover"></div>` : `<div class="item-icon"><i class="fa-solid fa-certificate"></i></div>`}
            <div class="item-body">
                <div class="item-title">${esc(c.title)}</div>
                <div class="item-meta">${esc(c.issuer)}${c.year ? ' &nbsp;·&nbsp; ' + esc(c.year) : ''}</div>
                ${c.verifyUrl ? `<div class="item-meta" style="margin-top:4px"><a href="${esc(c.verifyUrl)}" target="_blank" style="color:#818cf8;font-size:.8rem">Verify Link <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:.7rem"></i></a></div>` : ''}
            </div>
            <div class="item-actions">
                <button class="btn-icon edit" title="Edit" onclick="editCertificate('${c.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon del"  title="Delete" onclick="deleteItem('certificate','${c.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function editCertificate(id) {
    const c = getCertificates().find(c => c.id === id);
    if (!c) return;
    document.getElementById('cert-edit-id').value  = id;
    document.getElementById('cert-title').value    = c.title;
    document.getElementById('cert-issuer').value   = c.issuer;
    document.getElementById('cert-year').value     = c.year || '';
    document.getElementById('cert-verify').value   = c.verifyUrl || '';
    document.getElementById('cert-img').value      = c.imgUrl || '';

    document.getElementById('cert-form-title').textContent = 'Edit Certificate';
    const card = document.getElementById('cert-form-card');
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getCertificates()       { return JSON.parse(localStorage.getItem('portfolio_certificates') || '[]'); }
function saveCertificates(data)  { localStorage.setItem('portfolio_certificates', JSON.stringify(data)); }

/* ============================================================
   DELETE MODAL
   ============================================================ */
function initModal() {
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        if (!deleteTarget) return;
        const { type, id } = deleteTarget;

        if (type === 'project') {
            saveProjects(getProjects().filter(p => p.id !== id));
            renderProjectsList();
        } else if (type === 'experience') {
            saveExperience(getExperience().filter(e => e.id !== id));
            renderExpList();
        } else if (type === 'certificate') {
            saveCertificates(getCertificates().filter(c => c.id !== id));
            renderCertList();
        } else if (type === 'skill') {
            saveSkills(getSkills().filter(s => s.id !== id));
            renderSkillsList();
        }

        closeModal();
        showToast('Item deleted.');
        deleteTarget = null;
    });
}

function deleteItem(type, id) {
    deleteTarget = { type, id };
    const modal = document.getElementById('confirm-modal');
    const text  = document.getElementById('confirm-modal-text');
    text.textContent = `This will permanently remove this ${type} from your portfolio.`;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    deleteTarget = null;
}

// Close modal on overlay click
document.addEventListener('click', e => {
    if (e.target.id === 'confirm-modal') closeModal();
});


/* ============================================================
   HELPERS
   ============================================================ */
function renderAllLists() {
    renderProjectsList();
    renderExpList();
    renderCertList();
    renderSkillsList();
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-msg');
    msgEl.textContent = msg;
    toast.style.display = 'flex';
    setTimeout(() => toast.style.display = 'none', 3000);
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   SKILLS
   ============================================================ */
function initSkills() {
    const addBtn    = document.getElementById('add-skill-btn');
    const formCard  = document.getElementById('skill-form-card');
    const form      = document.getElementById('skill-form');
    const cancelBtn = document.getElementById('cancel-skill-btn');
    const colorPick = document.getElementById('skill-color');
    const colorText = document.getElementById('skill-color-text');

    // Sync color picker <-> text input
    colorPick.addEventListener('input', () => colorText.value = colorPick.value);

    addBtn.addEventListener('click', () => {
        resetSkillForm();
        document.getElementById('skill-form-title').textContent = 'New Skill';
        formCard.style.display = 'block';
        formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    cancelBtn.addEventListener('click', () => {
        formCard.style.display = 'none';
        resetSkillForm();
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const editId = document.getElementById('skill-edit-id').value;
        const list   = getSkills();

        const colorVal = document.getElementById('skill-color').value;
        const data = {
            id:       editId || uid(),
            name:     document.getElementById('skill-name').value.trim(),
            category: document.getElementById('skill-category').value,
            percent:  parseInt(document.getElementById('skill-percent').value),
            color:    colorVal,
            icon:     document.getElementById('skill-icon').value.trim(),
        };

        if (editId) {
            const idx = list.findIndex(s => s.id === editId);
            if (idx > -1) list[idx] = data;
        } else {
            list.push(data);
        }

        saveSkills(list);
        formCard.style.display = 'none';
        resetSkillForm();
        renderSkillsList();
        showToast(editId ? 'Skill updated!' : 'Skill added!');
    });

    renderSkillsList();
}

function resetSkillForm() {
    document.getElementById('skill-edit-id').value   = '';
    document.getElementById('skill-name').value      = '';
    document.getElementById('skill-category').value  = 'web';
    document.getElementById('skill-percent').value   = 80;
    document.getElementById('skill-percent-val').textContent = '80%';
    document.getElementById('skill-color').value     = '#6366f1';
    document.getElementById('skill-color-text').value = '#6366f1';
    document.getElementById('skill-icon').value      = '';
}

function renderSkillsList() {
    const list    = getSkills();
    const listEl  = document.getElementById('skills-list');
    const emptyEl = document.getElementById('skills-empty');
    if (!listEl) return;

    if (list.length === 0) { listEl.innerHTML = ''; emptyEl.style.display = 'block'; return; }
    emptyEl.style.display = 'none';

    listEl.innerHTML = list.map(s => `
        <div class="item-card">
            <div class="item-icon" style="background:${esc(s.color)}22; border-color:${esc(s.color)}55">
                <i class="${esc(s.icon || 'fa-solid fa-star')}" style="color:${esc(s.color)}"></i>
            </div>
            <div class="item-body">
                <div class="skill-cat-badge ${esc(s.category)}">${esc(s.category)}</div>
                <div class="item-title">${esc(s.name)}</div>
                <div class="skill-bar-wrap">
                    <div class="skill-bar-fill" style="width:${s.percent}%; background:linear-gradient(90deg,${esc(s.color)},${esc(s.color)}88)"></div>
                </div>
                <div class="item-meta" style="margin-top:6px">${s.percent}% proficiency</div>
            </div>
            <div class="item-actions">
                <button class="btn-icon edit" title="Edit" onclick="editSkill('${s.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon del"  title="Delete" onclick="deleteItem('skill','${s.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function editSkill(id) {
    const s = getSkills().find(s => s.id === id);
    if (!s) return;
    document.getElementById('skill-edit-id').value    = id;
    document.getElementById('skill-name').value       = s.name;
    document.getElementById('skill-category').value   = s.category;
    document.getElementById('skill-percent').value    = s.percent;
    document.getElementById('skill-percent-val').textContent = s.percent + '%';
    document.getElementById('skill-color').value      = s.color || '#6366f1';
    document.getElementById('skill-color-text').value = s.color || '#6366f1';
    document.getElementById('skill-icon').value       = s.icon || '';

    document.getElementById('skill-form-title').textContent = 'Edit Skill';
    const card = document.getElementById('skill-form-card');
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const DEFAULT_SKILLS = [
    // Web Development
    { id: 'sk_1', name: 'HTML5', category: 'web', percent: 95, color: '#e34f26', icon: 'fa-brands fa-html5' },
    { id: 'sk_2', name: 'CSS3', category: 'web', percent: 90, color: '#1572b6', icon: 'fa-brands fa-css3-alt' },
    { id: 'sk_3', name: 'JavaScript', category: 'web', percent: 85, color: '#f7df1e', icon: 'fa-brands fa-js' },
    { id: 'sk_4', name: 'PHP', category: 'web', percent: 80, color: '#8892be', icon: 'fa-brands fa-php' },
    { id: 'sk_5', name: 'Tailwind & Bootstrap', category: 'web', percent: 85, color: '#38bdf8', icon: 'fa-solid fa-wind' },
    { id: 'sk_6', name: 'SQL & Firebase', category: 'web', percent: 80, color: '#ffca28', icon: 'fa-solid fa-fire' },
    { id: 'sk_7', name: 'SEO & UI/UX', category: 'web', percent: 90, color: '#a78bfa', icon: 'fa-solid fa-magnifying-glass' },

    // Data Analytics
    { id: 'sk_8', name: 'Power BI', category: 'data', percent: 90, color: '#f59e0b', icon: 'fa-solid fa-chart-pie' },
    { id: 'sk_9', name: 'Microsoft Excel', category: 'data', percent: 85, color: '#22c55e', icon: 'fa-solid fa-table' },
    { id: 'sk_10', name: 'SQL Queries', category: 'data', percent: 80, color: '#60a5fa', icon: 'fa-solid fa-database' },
    { id: 'sk_11', name: 'Python (Pandas)', category: 'data', percent: 75, color: '#3b82f6', icon: 'fa-brands fa-python' },
    { id: 'sk_12', name: 'Data Cleaning', category: 'data', percent: 85, color: '#e879f9', icon: 'fa-solid fa-filter' },
    { id: 'sk_13', name: 'Data Visualization', category: 'data', percent: 80, color: '#fb923c', icon: 'fa-solid fa-chart-area' },

    // Tools
    { id: 'sk_14', name: 'VS Code', category: 'tools', percent: 90, color: '#007acc', icon: 'fa-solid fa-code' },
    { id: 'sk_15', name: 'Git & GitHub', category: 'tools', percent: 85, color: '#f05032', icon: 'fa-brands fa-git-alt' },
    { id: 'sk_16', name: 'MySQL Workbench', category: 'tools', percent: 80, color: '#00758f', icon: 'fa-solid fa-database' },
    { id: 'sk_17', name: 'Power BI Desktop', category: 'tools', percent: 90, color: '#f59e0b', icon: 'fa-solid fa-chart-pie' },
    { id: 'sk_18', name: 'Figma & Canva', category: 'tools', percent: 75, color: '#a259ff', icon: 'fa-brands fa-figma' },
    { id: 'sk_19', name: 'Chrome DevTools', category: 'tools', percent: 85, color: '#4caf50', icon: 'fa-brands fa-chrome' },

    // Soft Skills
    { id: 'sk_20', name: 'Problem Solving', category: 'soft', percent: 95, color: '#facc15', icon: 'fa-solid fa-lightbulb' },
    { id: 'sk_21', name: 'Analytical Thinking', category: 'soft', percent: 90, color: '#c084fc', icon: 'fa-solid fa-brain' },
    { id: 'sk_22', name: 'Communication', category: 'soft', percent: 85, color: '#34d399', icon: 'fa-solid fa-comments' },
    { id: 'sk_23', name: 'Teamwork', category: 'soft', percent: 90, color: '#60a5fa', icon: 'fa-solid fa-users' },
    { id: 'sk_24', name: 'Time Management', category: 'soft', percent: 80, color: '#fb923c', icon: 'fa-solid fa-clock' },
    { id: 'sk_25', name: 'Project Management', category: 'soft', percent: 85, color: '#f472b6', icon: 'fa-solid fa-list-check' }
];

function getSkills() {
    const saved = localStorage.getItem('portfolio_skills');
    if (!saved) {
        localStorage.setItem('portfolio_skills', JSON.stringify(DEFAULT_SKILLS));
        return DEFAULT_SKILLS;
    }
    return JSON.parse(saved);
}
function saveSkills(data) { localStorage.setItem('portfolio_skills', JSON.stringify(data)); }

/* ============================================================
   PROFILE PHOTO
   ============================================================ */
function initProfilePhoto() {
    const urlInput   = document.getElementById('profile-photo-url');
    const fileInput  = document.getElementById('profile-photo-file');
    const form       = document.getElementById('profile-form');
    const previewImg = document.getElementById('profile-preview-img');
    const fallback   = document.getElementById('profile-preview-fallback');
    const removeBtn  = document.getElementById('remove-profile-photo-btn');

    if (!form) return;

    // Load existing
    const currentPhoto = localStorage.getItem('portfolio_profile_photo') || '';
    updateProfilePreview(currentPhoto);

    // URL input live preview
    urlInput.addEventListener('input', () => {
        updateProfilePreview(urlInput.value.trim());
    });

    // File input -> Base64 data URL
    if (fileInput) {
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    urlInput.value = evt.target.result;
                    updateProfilePreview(evt.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Remove photo
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            urlInput.value = '';
            if (fileInput) fileInput.value = '';
            localStorage.removeItem('portfolio_profile_photo');
            updateProfilePreview('');
            showToast('Profile photo removed.');
        });
    }

    // Form submit
    form.addEventListener('submit', e => {
        e.preventDefault();
        const photoVal = urlInput.value.trim();
        if (photoVal) {
            localStorage.setItem('portfolio_profile_photo', photoVal);
            showToast('Profile photo updated successfully!');
        } else {
            localStorage.removeItem('portfolio_profile_photo');
            showToast('Profile photo cleared.');
        }
    });

    function updateProfilePreview(src) {
        if (src) {
            urlInput.value = src;
            previewImg.src = src;
            previewImg.style.display = 'block';
            fallback.style.display = 'none';
        } else {
            urlInput.value = '';
            previewImg.src = '';
            previewImg.style.display = 'none';
            fallback.style.display = 'block';
        }
    }
}

