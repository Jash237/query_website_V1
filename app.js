// app.js
let issues = JSON.parse(localStorage.getItem('campusIssues')) || [];
let nextId = issues.length ? Math.max(...issues.map(i => i.id)) + 1 : 1;
let currentTheme = localStorage.getItem('campusTheme') || 'dark';

const ADMIN_PASSWORD = "council2026";

// === Theme Application ===
function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('campusTheme', theme);

    const canvas = document.getElementById('animatedBg');
    canvas.style.display = (theme === 'dark') ? 'block' : 'none';

    // Body
    document.body.classList.remove('bg-slate-900', 'bg-gray-50', 'bg-black', 'text-gray-200', 'text-gray-800', 'text-gray-100');
    if (theme === 'light') document.body.classList.add('bg-gray-50', 'text-gray-800');
    else if (theme === 'dark') document.body.classList.add('bg-slate-900', 'text-gray-200');
    else document.body.classList.add('bg-black', 'text-gray-100');

    // Header
    const header = document.querySelector('header');
    header.classList.remove('bg-gradient-to-r', 'from-indigo-900', 'to-purple-900', 'bg-blue-700', 'from-gray-900', 'to-black');
    if (theme === 'light') header.classList.add('bg-blue-700');
    else if (theme === 'dark') header.classList.add('bg-gradient-to-r', 'from-indigo-900', 'to-purple-900');
    else header.classList.add('bg-gradient-to-r', 'from-gray-900', 'to-black');

    // Submit card
    const submitCard = document.getElementById('submitCard');
    submitCard.classList.remove('bg-slate-800', 'bg-white', 'bg-gray-950', 'border-slate-700', 'shadow-2xl', 'shadow-lg');
    if (theme === 'light') {
        submitCard.classList.add('bg-white', 'shadow-lg');
    } else if (theme === 'dark') {
        submitCard.classList.add('bg-slate-800', 'border-slate-700', 'shadow-2xl');
    } else {
        submitCard.classList.add('bg-gray-950', 'shadow-2xl');
    }

    // Inputs & selects (form + modal)
    const inputs = document.querySelectorAll('#issueForm input, #issueForm textarea, #issueForm select, #adminPassword');
    inputs.forEach(el => {
        el.classList.remove('bg-slate-700', 'bg-white', 'bg-gray-900', 'border-slate-600', 'border-gray-300', 'border-gray-800', 'text-white', 'text-gray-900', 'text-gray-100', 'placeholder-gray-500', 'placeholder-gray-400');
        if (theme === 'light') {
            el.classList.add('bg-white', 'border-gray-300', 'text-gray-900', 'placeholder-gray-400');
        } else if (theme === 'dark') {
            el.classList.add('bg-slate-700', 'border-slate-600', 'text-white', 'placeholder-gray-500');
        } else {
            el.classList.add('bg-gray-900', 'border-gray-800', 'text-gray-100', 'placeholder-gray-400');
        }
    });

    // Submit button
    const submitBtn = document.querySelector('#issueForm button[type="submit"]');
    submitBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700', 'bg-blue-700', 'hover:bg-blue-800', 'bg-purple-700', 'hover:bg-purple-800');
    if (theme === 'light') submitBtn.classList.add('bg-blue-700', 'hover:bg-blue-800');
    else if (theme === 'dark') submitBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
    else submitBtn.classList.add('bg-purple-700', 'hover:bg-purple-800');

    // Modal
    const modalCard = document.getElementById('modalCard');
    if (modalCard) {
        modalCard.classList.remove('bg-slate-800', 'bg-white', 'bg-gray-950', 'border-slate-700');
        if (theme === 'light') modalCard.classList.add('bg-white');
        else if (theme === 'dark') modalCard.classList.add('bg-slate-800', 'border-slate-700');
        else modalCard.classList.add('bg-gray-950');
    }

    // Messages
    document.getElementById('submitMessage').classList.remove('text-green-400', 'text-green-600');
    document.getElementById('submitMessage').classList.add(theme === 'light' ? 'text-green-600' : 'text-green-400');

    document.getElementById('loginError').classList.remove('text-red-400', 'text-red-600');
    document.getElementById('loginError').classList.add(theme === 'light' ? 'text-red-600' : 'text-red-400');

    // Theme toggle widget
    const toggleBtn = document.getElementById('toggleBtn');
    const themeMenu = document.getElementById('themeMenu');
    const menuButtons = themeMenu.querySelectorAll('button');

    toggleBtn.classList.remove('bg-slate-800', 'hover:bg-slate-700', 'bg-gray-300', 'hover:bg-gray-400', 'bg-gray-900', 'hover:bg-gray-800', 'text-white', 'text-gray-800');
    themeMenu.classList.remove('bg-slate-800', 'bg-white', 'bg-gray-900', 'border-slate-700', 'border-gray-300');
    menuButtons.forEach(b => b.classList.remove('text-white', 'text-gray-800', 'hover:bg-slate-700', 'hover:bg-gray-200'));

    if (theme === 'light') {
        toggleBtn.classList.add('bg-gray-300', 'text-gray-800', 'hover:bg-gray-400');
        themeMenu.classList.add('bg-white', 'border', 'border-gray-300');
        menuButtons.forEach(b => b.classList.add('text-gray-800', 'hover:bg-gray-200'));
    } else if (theme === 'dark') {
        toggleBtn.classList.add('bg-slate-800', 'hover:bg-slate-700');
        themeMenu.classList.add('bg-slate-800', 'border-slate-700');
        menuButtons.forEach(b => b.classList.add('text-white', 'hover:bg-slate-700'));
    } else {
        toggleBtn.classList.add('bg-gray-900', 'hover:bg-gray-800');
        themeMenu.classList.add('bg-gray-900');
        menuButtons.forEach(b => b.classList.add('text-white', 'hover:bg-gray-800'));
    }

    // Update toggle icon
    const icons = { light: '☀️', dark: '🌙', black: '⚫' };
    toggleBtn.innerHTML = icons[theme];

    // Re-render issues & admin
    renderIssues();
    if (!document.getElementById('adminDashboard').classList.contains('hidden')) renderAdminIssues();
}

//  Animation (only used in dark theme) 
function initParticles() {
    const canvas = document.getElementById('animatedBg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const numParticles = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.speedY = Math.random() * 0.8 - 0.4;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < numParticles; i++) particles.push(new Particle());

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(150, 150, 160, ${1 - distance / 120})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Rendering Functions
function renderIssues() {
    const container = document.getElementById('issuesList');
    container.innerHTML = '';
    issues.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    let cardBg, cardBorder = '', cardShadow, titleColor, descColor, metaColor, upvoteColor, badgeStyles;

    if (currentTheme === 'light') {
        cardBg = 'bg-white';
        cardShadow = 'shadow-md';
        titleColor = 'text-gray-800';
        descColor = 'text-gray-600';
        metaColor = 'text-gray-500';
        upvoteColor = 'text-blue-600 hover:text-blue-800';
        badgeStyles = {
            resolved: 'bg-green-100 text-green-800',
            'in-progress': 'bg-yellow-100 text-yellow-800',
            pending: 'bg-red-100 text-red-800'
        };
    } else if (currentTheme === 'dark') {
        cardBg = 'bg-slate-800';
        cardBorder = 'border border-slate-700';
        cardShadow = 'shadow-xl';
        titleColor = 'text-white';
        descColor = 'text-gray-300';
        metaColor = 'text-gray-400';
        upvoteColor = 'text-indigo-400 hover:text-indigo-300';
        badgeStyles = {
            resolved: 'bg-green-900 text-green-300',
            'in-progress': 'bg-yellow-900 text-yellow-300',
            pending: 'bg-red-900 text-red-300'
        };
    } else { // black
        cardBg = 'bg-gray-950';
        cardShadow = 'shadow-xl';
        titleColor = 'text-gray-100';
        descColor = 'text-gray-300';
        metaColor = 'text-gray-400';
        upvoteColor = 'text-purple-400 hover:text-purple-300';
        badgeStyles = {
            resolved: 'bg-green-950 text-green-400',
            'in-progress': 'bg-yellow-950 text-yellow-400',
            pending: 'bg-red-950 text-red-400'
        };
    }

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.className = `${cardBg} rounded-xl ${cardShadow} p-6 ${cardBorder}`;
        const statusBadge = badgeStyles[issue.status || 'pending'];
        card.innerHTML = `
            <h3 class="${titleColor} text-xl font-semibold mb-2">${issue.title}</h3>
            <p class="${descColor} mb-3">${issue.description}</p>
            <div class="flex justify-between items-center">
                <span class="${metaColor} text-sm">Category: ${issue.category}</span>
                <span class="px-3 py-1 rounded-full text-sm font-medium ${statusBadge}">${issue.status || 'pending'}</span>
            </div>
            ${issue.name ? `<p class="${metaColor} text-sm mt-3">Submitted by: ${issue.name}</p>` : `<p class="${metaColor} text-sm mt-3 italic">Anonymous</p>`}
            <div class="mt-4 flex gap-2">
                <button onclick="upvote(${issue.id})" class="${upvoteColor} hover:underline">↑ Upvote (${issue.upvotes || 0})</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderAdminIssues() {
    const container = document.getElementById('adminIssuesList');
    container.innerHTML = '';

    let cardBg, cardBorder = '', cardShadow, titleColor, descColor, metaColor, selectClass;

    if (currentTheme === 'light') {
        cardBg = 'bg-white';
        cardShadow = 'shadow-md';
        titleColor = 'text-gray-800';
        descColor = 'text-gray-600';
        metaColor = 'text-gray-500';
        selectClass = 'bg-white border-gray-300 text-gray-900';
    } else if (currentTheme === 'dark') {
        cardBg = 'bg-slate-800';
        cardBorder = 'border border-slate-700';
        cardShadow = 'shadow-xl';
        titleColor = 'text-white';
        descColor = 'text-gray-300';
        metaColor = 'text-gray-400';
        selectClass = 'bg-slate-700 border border-slate-600 text-white';
    } else {
        cardBg = 'bg-gray-950';
        cardShadow = 'shadow-xl';
        titleColor = 'text-gray-100';
        descColor = 'text-gray-300';
        metaColor = 'text-gray-400';
        selectClass = 'bg-gray-900 border-gray-800 text-gray-100';
    }

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.className = `${cardBg} rounded-xl ${cardShadow} p-6 ${cardBorder}`;
        card.innerHTML = `
            <h3 class="${titleColor} text-xl font-semibold mb-2">${issue.title}</h3>
            <p class="${descColor} mb-3">${issue.description}</p>
            <p class="${metaColor} text-sm">Category: ${issue.category} | Upvotes: ${issue.upvotes || 0}</p>
            ${issue.name ? `<p class="${metaColor} text-sm">By: ${issue.name}</p>` : `<p class="${metaColor} text-sm italic">Anonymous</p>`}
            <select data-id="${issue.id}" class="statusSelect mt-4 px-4 py-2 border rounded-lg ${selectClass}">
                <option value="pending" ${issue.status === 'pending' || !issue.status ? 'selected' : ''}>Pending</option>
                <option value="in-progress" ${issue.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="resolved" ${issue.status === 'resolved' ? 'selected' : ''}>Resolved</option>
            </select>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.statusSelect').forEach(select => {
        select.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const issue = issues.find(i => i.id === id);
            issue.status = e.target.value;
            saveIssues();
            renderIssues();
            renderAdminIssues();
        });
    });
}

//Core Functions
function saveIssues() {
    localStorage.setItem('campusIssues', JSON.stringify(issues));
}

function upvote(id) {
    const issue = issues.find(i => i.id === id);
    issue.upvotes = (issue.upvotes || 0) + 1;
    saveIssues();
    renderIssues();
    if (!document.getElementById('adminDashboard').classList.contains('hidden')) renderAdminIssues();
}

document.getElementById('issueForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const issue = {
        id: nextId++,
        name: document.getElementById('name').value.trim() || null,
        category: document.getElementById('category').value,
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        status: 'pending',
        upvotes: 0,
        timestamp: new Date().toISOString()
    };
    issues.push(issue);
    saveIssues();
    renderIssues();
    document.getElementById('submitMessage').classList.remove('hidden');
    e.target.reset();
    setTimeout(() => document.getElementById('submitMessage').classList.add('hidden'), 3000);
});

// Admin
document.getElementById('adminLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('adminModal').classList.remove('hidden');
    document.getElementById('adminModal').classList.add('flex');
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('adminModal').classList.add('hidden');
    document.getElementById('adminModal').classList.remove('flex');
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('adminPassword').value = '';
});

document.getElementById('adminModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('adminModal')) document.getElementById('closeModal').click();
});

document.getElementById('loginBtn').addEventListener('click', () => {
    if (document.getElementById('adminPassword').value === ADMIN_PASSWORD) {
        document.getElementById('adminModal').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        renderAdminIssues();
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    document.getElementById('adminDashboard').classList.add('hidden');
});

// Theme Toggle Controls
document.getElementById('toggleBtn').addEventListener('click', () => {
    document.getElementById('themeMenu').classList.toggle('hidden');
});

document.querySelectorAll('#themeMenu button').forEach(btn => {
    btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme);
        document.getElementById('themeMenu').classList.add('hidden');
    });
});

// theme
applyTheme(currentTheme);
renderIssues();
if (currentTheme === 'dark') initParticles();