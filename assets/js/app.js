const App = {

    init() {
        this.renderSidebar();
        this.showView('roleSelection');

        // Boot animations
        Animations.sidebarEntrance();

        // Logo click → reset to home
        const logoBtn = document.getElementById('logo-btn');
        if (logoBtn) logoBtn.addEventListener('click', () => this.resetSession());

        // Hamburger sidebar toggle
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (toggle && sidebar && overlay) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('active');
            });
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        }

        // Enter key on input
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('role-input');
                if (input && document.activeElement === input) {
                    this.handleRoleSubmit();
                }
            }
        });
    },

    renderSidebar() {
        const nav = document.getElementById('sidebar-nav');
        const items = [
            { id: 'dashboard', label: 'Dashboard',   icon: 'layout-dashboard' },
            { id: 'skills',    label: 'My Skills',   icon: 'award' },
            { id: 'career',    label: 'Career Path', icon: 'target' },
            { id: 'progress',  label: 'Progress',    icon: 'trending-up' },
        ];

        nav.innerHTML = `
            <div class="nav-section-label">Navigation</div>
            ${items.map(item => `
                <button
                    class="nav-btn ${STATE.activeTab === item.id ? 'active' : ''}"
                    id="nav-${item.id}"
                    onclick="App.navigateTo('${item.id}')">
                    <div class="nav-icon">
                        <i data-lucide="${item.icon}" style="width:15px;height:15px;"></i>
                    </div>
                    ${item.label}
                </button>
            `).join('')}
        `;
        lucide.createIcons();
    },

    showView(viewName) {
        const container = document.getElementById('main-content');
        const headerTitle = document.getElementById('header-title');
        const headerAction = document.getElementById('header-action-area');

        switch (viewName) {
            case 'roleSelection':
                headerTitle.textContent = 'Career Goal';
                headerAction.innerHTML = '';
                container.innerHTML = Components.RoleSelection();
                lucide.createIcons();
                // GSAP entrance
                requestAnimationFrame(() => Animations.roleSelectionEntrance());
                // Magnetic button
                requestAnimationFrame(() => {
                    Animations.magneticButton(document.getElementById('analyze-btn'));
                });
                break;

            case 'dashboard':
                headerTitle.textContent = STATE.targetRole || 'Dashboard';
                headerAction.innerHTML = Components.HeaderAction();
                container.innerHTML = Components.Dashboard();
                lucide.createIcons();
                requestAnimationFrame(() => Animations.dashboardEntrance());
                break;

            case 'loading':
                headerTitle.textContent = 'Analyzing…';
                headerAction.innerHTML = '';
                container.innerHTML = Components.Loading();
                lucide.createIcons();
                requestAnimationFrame(() => Animations.animateLoadingSteps());
                break;

            default:
                // Placeholder for other tabs
                headerTitle.textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
                headerAction.innerHTML = Components.HeaderAction();
                container.innerHTML = this._comingSoon(viewName);
                lucide.createIcons();
                break;
        }
    },

    _comingSoon(tab) {
        const icons = { skills: 'award', progress: 'trending-up', career: 'target' };
        const icon = icons[tab] || 'box';
        return `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 130px);text-align:center;gap:1rem;">
                <div style="width:60px;height:60px;border-radius:16px;background:var(--primary-subtle);border:1px solid rgba(249,115,22,0.2);display:flex;align-items:center;justify-content:center;">
                    <i data-lucide="${icon}" style="width:28px;height:28px;color:var(--primary);"></i>
                </div>
                <div style="font-family:'Space Grotesk',sans-serif;font-size:1.15rem;font-weight:600;color:var(--text-primary);">${tab.charAt(0).toUpperCase() + tab.slice(1)}</div>
                <div style="font-size:0.875rem;color:var(--text-muted);max-width:280px;line-height:1.6;">This section is coming soon. Complete a career analysis to unlock all features.</div>
                ${STATE.targetRole
                    ? `<button class="btn-primary" onclick="App.navigateTo('dashboard')" style="margin-top:0.5rem;">Go to Dashboard</button>`
                    : `<button class="btn-primary" onclick="App.navigateTo('dashboard')" style="margin-top:0.5rem;">Start Analysis</button>`
                }
            </div>
        `;
    },

    setRole(role) {
        const input = document.getElementById('role-input');
        if (input) {
            input.value = role;
            input.focus();
            // Pulse animation on input
            gsap.fromTo(input, { borderColor: 'var(--primary)', boxShadow: '0 0 0 3px rgba(249,115,22,0.25)' }, {
                borderColor: '', boxShadow: '', duration: 1, ease: 'power2.out'
            });
        }
    },

    async handleRoleSubmit() {
        const input = document.getElementById('role-input');
        if (!input || !input.value.trim()) {
            // Shake animation
            gsap.fromTo(input,
                { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)',
                  clearProps: 'x', keyframes: [{ x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }]
                }
            );
            return;
        }

        const roleValue = input.value.trim();
        STATE.targetRole = roleValue;
        this.showView('loading');

        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_role: roleValue })
            });
            const data = await response.json();

            STATE.skills = data.extracted_skills || [];
            STATE.gaps = data.skill_gaps || [];
            STATE.recommendations = data.recommendations || [];
            STATE.matchPercentage = data.match_percentage || 0;
        } catch (e) {
            // Realistic mock data for demo
            await new Promise(r => setTimeout(r, 2400));
            const role = roleValue.toLowerCase();

            if (role.includes('data') || role.includes('ai') || role.includes('ml')) {
                STATE.matchPercentage = 72;
                STATE.skills = ['Python', 'SQL', 'Data Visualization', 'Statistics', 'Excel'];
                STATE.gaps = ['Machine Learning', 'TensorFlow', 'Cloud Platforms', 'MLOps'];
                STATE.recommendations = [
                    { title: 'Machine Learning Fundamentals', type: 'Course', target_skill: 'Machine Learning' },
                    { title: 'TensorFlow Developer Certificate', type: 'Certification', target_skill: 'TensorFlow' },
                    { title: 'AWS for ML Engineers', type: 'Workshop', target_skill: 'Cloud Platforms' },
                ];
            } else if (role.includes('design') || role.includes('ux') || role.includes('ui')) {
                STATE.matchPercentage = 81;
                STATE.skills = ['Figma', 'User Research', 'Wireframing', 'Design Systems', 'Prototyping'];
                STATE.gaps = ['Motion Design', 'Accessibility (WCAG)', 'Design Tokens'];
                STATE.recommendations = [
                    { title: 'Advanced Motion Design', type: 'VR Experience', target_skill: 'Motion Design' },
                    { title: 'Accessible Design Principles', type: 'Course', target_skill: 'Accessibility (WCAG)' },
                    { title: 'Design Systems at Scale', type: 'Workshop', target_skill: 'Design Tokens' },
                ];
            } else {
                STATE.matchPercentage = 68;
                STATE.skills = ['Electrical Safety', 'Technical Drawing', 'CAD Software', 'Circuit Analysis'];
                STATE.gaps = ['PLC Programming', 'Robotics Control', 'Industrial IoT', 'Automation Systems'];
                STATE.recommendations = [
                    { title: 'PLC Logic 101', type: 'VR Experience', target_skill: 'PLC Programming' },
                    { title: 'Robotics Fundamentals', type: 'Course', target_skill: 'Robotics Control' },
                    { title: 'Industrial IoT Bootcamp', type: 'Workshop', target_skill: 'Industrial IoT' },
                ];
            }
        }

        STATE.activeTab = 'dashboard';
        this.renderSidebar();
        this.showView('dashboard');
    },

    navigateTo(id) {
        STATE.activeTab = id;
        this.renderSidebar();

        if (id === 'dashboard') {
            if (STATE.targetRole) {
                this.showView('dashboard');
            } else {
                this.showView('roleSelection');
            }
        } else {
            this.showView(id);
        }
    },

    resetSession() {
        gsap.to('.main-wrapper', {
            opacity: 0, duration: 0.3, ease: 'power2.in',
            onComplete: () => {
                localStorage.removeItem('inrebus_session');
                Object.assign(STATE, {
                    targetRole: '', matchPercentage: 0,
                    skills: [], gaps: [], recommendations: [],
                    activeTab: 'dashboard', isLoading: false
                });
                STATE.activeTab = 'dashboard';
                this.renderSidebar();
                this.showView('roleSelection');
                gsap.to('.main-wrapper', { opacity: 1, duration: 0.4, ease: 'power2.out' });
            }
        });
    },

    render() {
        this.renderSidebar();
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());