const App = {

    init() {
        this.renderSidebar();
        this.showView('roleSelection');

        Animations.sidebarEntrance();

        const logoBtn = document.getElementById('logo-btn');
        if (logoBtn) logoBtn.addEventListener('click', () => this.resetSession());

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

        this.initTheme();

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('role-input');
                if (input && document.activeElement === input) {
                    this.handleRoleSubmit();
                }
            }
        });
    },

    
    _moonSVG: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
    _sunSVG:  `<circle cx="12" cy="12" r="5"/>
               <line x1="12" y1="1" x2="12" y2="3"/>
               <line x1="12" y1="21" x2="12" y2="23"/>
               <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
               <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
               <line x1="1" y1="12" x2="3" y2="12"/>
               <line x1="21" y1="12" x2="23" y2="12"/>
               <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
               <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`,

    initTheme() {
        const html      = document.documentElement;
        const themeBtn  = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const themeLabel= document.getElementById('theme-label');
        if (!themeBtn || !themeIcon) return;

        const applyTheme = (mode) => {
            html.setAttribute('data-theme', mode);
            localStorage.setItem('inrebus-theme', mode);
            if (mode === 'dark') {
                themeIcon.innerHTML = this._moonSVG;
                themeBtn.title = 'Switch to light mode';
                if (themeLabel) themeLabel.textContent = 'Dark';
            } else {
                themeIcon.innerHTML = this._sunSVG;
                themeBtn.title = 'Switch to dark mode';
                if (themeLabel) themeLabel.textContent = 'Light';
            }
        };

        const saved = localStorage.getItem('inrebus-theme') || 'dark';
        applyTheme(saved);

        themeBtn.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            gsap.fromTo(themeBtn,
                { scale: 0.88 },
                { scale: 1, duration: 0.35, ease: 'back.out(2)' }
            );
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

                requestAnimationFrame(() => Animations.roleSelectionEntrance());

                requestAnimationFrame(() => {
                    Animations.magneticButton(document.getElementById('analyze-btn'));
                });
                break;

            case 'cvUpload':
                headerTitle.textContent = 'Upload CV';
                headerAction.innerHTML = '';
                container.innerHTML = Components.CVUpload();
                lucide.createIcons();
                requestAnimationFrame(() => Animations.roleSelectionEntrance()); // Reuse animation
                break;

            case 'options':
                headerTitle.textContent = 'Career Path Options';
                headerAction.innerHTML = Components.HeaderAction();
                container.innerHTML = Components.CareerOptions();
                lucide.createIcons();
                requestAnimationFrame(() => Animations.dashboardEntrance()); // Reuse animation
                break;

            case 'dashboard':
                headerTitle.textContent = STATE.targetRole || 'Dashboard';
                headerAction.innerHTML = Components.HeaderAction();
                container.innerHTML = Components.Dashboard();
                lucide.createIcons();
                requestAnimationFrame(() => Animations.dashboardEntrance());
                break;

            case 'loading':
                const type = STATE.uploadedCV ? 'cv' : 'generic';
                headerTitle.textContent = 'Analyzing…';
                headerAction.innerHTML = '';
                container.innerHTML = Components.Loading(type);
                lucide.createIcons();
                requestAnimationFrame(() => Animations.animateLoadingSteps());
                break;

            case 'error':
                headerTitle.textContent = 'System Error';
                headerAction.innerHTML = '';
                // Errors are passed via STATE or arguments, here we'll assume they are handled by a dedicated method
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

            gsap.fromTo(input, { borderColor: 'var(--primary)', boxShadow: '0 0 0 3px rgba(249,115,22,0.25)' }, {
                borderColor: '', boxShadow: '', duration: 1, ease: 'power2.out'
            });
        }
    },

    async handleRoleSubmit() {
        const input = document.getElementById('role-input');
        if (!input || !input.value.trim()) {

            gsap.fromTo(input,
                { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)',
                  clearProps: 'x', keyframes: [{ x: -6 }, { x: 6 }, { x: -4 }, { x: 4 }, { x: 0 }]
                }
            );
            return;
        }

        const roleValue = input.value.trim();
        STATE.targetRole = roleValue;
        
        // Instead of analyzing immediately, move to CV upload for the "DNA" part
        this.showView('cvUpload');
    },

    async handleCVUpload(input) {
        if (!input.files || !input.files[0]) return;
        
        const file = input.files[0];
        STATE.uploadedCV = file.name;
        
        this.showView('loading');

        try {
            // Check connectivity / status before uploading
            const formData = new FormData();
            formData.append('file', file);
            if (STATE.targetRole) {
                formData.append('target_role', STATE.targetRole);
            }

            const response = await fetch('https://inrebus-backendlms.onrender.com/api/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            
            // Map the real backend response to our state
            // We'll be flexible with field names
            STATE.matchPercentage = data.match_percentage || data.matchPercentage || data.readiness || 0;
            STATE.skills = data.skills || [];
            STATE.gaps = data.gaps || [];
            STATE.recommendations = data.recommendations || [];
            STATE.analysisResult = data;

            this.showView('options');

        } catch (error) {
            console.error('CV Analysis Failed:', error);
            this.showErrorView(
                'Connection Failure', 
                'We couldn\'t connect to the AI engine. Please verify the server is online and try again.'
            );
        }
    },

    showErrorView(title, message) {
        const container = document.getElementById('main-content');
        const headerTitle = document.getElementById('header-title');
        
        headerTitle.textContent = 'Analysis Failed';
        container.innerHTML = Components.Error(title, message);
        lucide.createIcons();
    },

    handleAnalysisSelection(choice) {
        if (choice === 'learn') {
            STATE.activeTab = 'dashboard';
            this.renderSidebar();
            this.showView('dashboard');
        } else if (choice === 'apply') {
            this.navigateTo('career'); // Use career tab for jobs
        } else if (choice === 'write') {
            this.navigateTo('skills'); // Use skills tab for CV writing
        }
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
                    activeTab: 'dashboard', isLoading: false,
                    uploadedCV: null
                });
                STATE.activeTab = 'dashboard';
                this.renderSidebar();
                this.showView('cvUpload');
                gsap.to('.main-wrapper', { opacity: 1, duration: 0.4, ease: 'power2.out' });
            }
        });
    },

    render() {
        this.renderSidebar();
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());