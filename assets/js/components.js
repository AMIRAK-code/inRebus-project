const Components = {

    
    RoleSelection: () => `
        <div class="role-selection-wrapper" id="role-selection">
            <div class="hero-badge">
                <div class="hero-badge-dot"></div>
                AI-Powered Career Intelligence
            </div>

            <h2 class="hero-title">
                What's your next<br><span class="highlight">career move?</span>
            </h2>

            <p class="hero-subtitle">
                Enter a job title and our AI engine will map your skill gaps and generate a personalized learning path — in seconds.
            </p>

            <div class="search-form" id="search-form">
                <div class="search-input-wrapper">
                    <i data-lucide="search" class="search-input-icon" style="width:18px;height:18px;"></i>
                    <input
                        id="role-input"
                        type="text"
                        class="search-input"
                        placeholder="e.g. Mechatronics Engineer, Data Scientist…"
                        autocomplete="off"
                    />
                </div>
                <button class="btn-primary" id="analyze-btn" onclick="App.handleRoleSubmit()">
                    Analyze Path
                    <i data-lucide="arrow-right" style="width:15px;height:15px;display:inline;margin-left:6px;vertical-align:middle;"></i>
                </button>
            </div>

            <div class="popular-roles" id="popular-roles">
                <div class="popular-label">Popular roles</div>
                ${['Mechatronics Engineer','Data Scientist','UX Designer','Full Stack Dev','Product Manager','AI Engineer'].map(r =>
                    `<button class="role-chip" onclick="App.setRole('${r}')">${r}</button>`
                ).join('')}
            </div>

            <div class="features-row" id="features-row">
                <div class="feature-item">
                    <div class="feature-icon"><i data-lucide="zap" style="width:11px;height:11px;color:var(--primary);"></i></div>
                    Instant analysis
                </div>
                <div class="feature-item">
                    <div class="feature-icon"><i data-lucide="brain" style="width:11px;height:11px;color:var(--primary);"></i></div>
                    AI-curated paths
                </div>
                <div class="feature-item">
                    <div class="feature-icon"><i data-lucide="shield-check" style="width:11px;height:11px;color:var(--primary);"></i></div>
                    Skills validation
                </div>
                <div class="feature-item">
                    <div class="feature-icon"><i data-lucide="trending-up" style="width:11px;height:11px;color:var(--primary);"></i></div>
                    Progress tracking
                </div>
            </div>
        </div>
    `,


    Dashboard: () => `
        <div class="max-content" id="dashboard-view" style="max-width:900px;margin:0 auto;">

            <!-- Hero card with circular progress -->
            <div class="hero-card" id="hero-card">
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
                        <span style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--primary);background:var(--primary-subtle);border:1px solid rgba(249,115,22,0.2);padding:2px 8px;border-radius:100px;">Active Analysis</span>
                    </div>
                    <div class="hero-card-role">${STATE.targetRole}</div>
                    <div class="hero-card-subtitle">Based on your profile & current market data</div>

                    <div style="display:flex;gap:1.5rem;margin-top:1.5rem;flex-wrap:wrap;">
                        <div>
                            <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:4px;">Skills Matched</div>
                            <div style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;color:#86efac;">${STATE.skills.length}</div>
                        </div>
                        <div style="width:1px;background:var(--border);"></div>
                        <div>
                            <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:4px;">Skill Gaps</div>
                            <div style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;color:#fdba74;">${STATE.gaps.length}</div>
                        </div>
                        <div style="width:1px;background:var(--border);"></div>
                        <div>
                            <div style="font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:4px;">Recommendations</div>
                            <div style="font-family:'Space Grotesk',sans-serif;font-size:1.4rem;font-weight:700;color:#a5b4fc;">${STATE.recommendations.length}</div>
                        </div>
                    </div>
                </div>

                <!-- Circular Progress -->
                <div class="circular-progress" id="circular-progress">
                    <svg viewBox="0 0 100 100">
                        <circle class="track" cx="50" cy="50" r="44"/>
                        <circle class="fill" cx="50" cy="50" r="44"
                            stroke-dasharray="${2 * Math.PI * 44}"
                            stroke-dashoffset="${2 * Math.PI * 44}"
                            id="progress-fill"/>
                    </svg>
                    <div class="label">
                        <div class="percent" id="progress-number">0%</div>
                        <div class="percent-label">Readiness</div>
                    </div>
                </div>
            </div>

            <!-- Skills Grid -->
            <div class="grid-2" id="skills-grid">
                <div class="card" id="skills-card">
                    <div class="section-header">
                        <div class="section-title">
                            <div class="section-title-dot" style="background:#22c55e;box-shadow:0 0 8px rgba(34,197,94,0.5);"></div>
                            Validated Skills
                        </div>
                        <span style="font-size:0.7rem;font-weight:600;color:#86efac;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);padding:2px 8px;border-radius:100px;">${STATE.skills.length} skills</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
                        ${STATE.skills.map(s =>
                            `<span class="skill-tag green"><i data-lucide="check" style="width:11px;height:11px;"></i>${s}</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="card" id="gaps-card">
                    <div class="section-header">
                        <div class="section-title">
                            <div class="section-title-dot" style="background:var(--primary);"></div>
                            Skill Gaps
                        </div>
                        <span style="font-size:0.7rem;font-weight:600;color:#fdba74;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);padding:2px 8px;border-radius:100px;">${STATE.gaps.length} gaps</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
                        ${STATE.gaps.map(g =>
                            `<span class="skill-tag orange"><i data-lucide="alert-circle" style="width:11px;height:11px;"></i>${g}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>

            <!-- Learning Path -->
            <div id="recs-section">
                <div class="section-header" style="margin-bottom:1.25rem;">
                    <div class="section-title">
                        <div class="section-title-dot"></div>
                        Recommended Learning Path
                    </div>
                    <span style="font-size:0.75rem;color:var(--text-muted);">${STATE.recommendations.length} modules</span>
                </div>
                <div class="grid-3" id="rec-grid">
                    ${STATE.recommendations.map((item, idx) => Components.RecommendationCard(item, idx)).join('')}
                </div>
            </div>
        </div>
    `,

   
    RecommendationCard: (item, idx) => {
        const images = [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=400&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80&auto=format&fit=crop',
        ];
        const img = images[idx % images.length];
        const durations = ['2h 30m', '4h 15m', '1h 45m', '3h 00m', '5h 20m'];
        const levels = ['Beginner', 'Intermediate', 'Advanced'];
        return `
        <div class="rec-card" id="rec-card-${idx}">
            <div class="rec-card-image">
                <img src="${img}" alt="${item.title}" loading="lazy"/>
                <div class="rec-card-badge">${item.type || 'Course'}</div>
            </div>
            <div class="rec-card-body">
                <div class="rec-card-title">${item.title}</div>
                <div class="rec-card-skill">${item.target_skill}</div>
                <div class="rec-card-footer">
                    <div class="rec-card-cta">
                        Start Module
                        <i data-lucide="arrow-right" style="width:12px;height:12px;"></i>
                    </div>
                    <span style="font-size:0.7rem;color:var(--text-muted);">${durations[idx % durations.length]}</span>
                </div>
            </div>
        </div>`;
    },


    HeaderAction: () => `
        <button class="reset-btn" onclick="App.resetSession()" id="reset-btn">
            <i data-lucide="refresh-cw" style="width:12px;height:12px;"></i>
            New Analysis
        </button>
    `,

   
    Loading: () => `
        <div class="loading-view" id="loading-view">
            <div class="loader-container">
                <div class="loader-ring-outer"></div>
                <div class="loader-ring-inner"></div>
                <div class="loader-dot"></div>
            </div>
            <div>
                <div class="loading-text">Analyzing your career path…</div>
                <div class="loading-steps" style="margin-top:1rem;">
                    <div class="loading-step active" id="step-1">
                        <i data-lucide="search" style="width:12px;height:12px;"></i>
                        Scanning job market data
                    </div>
                    <div class="loading-step" id="step-2">
                        <i data-lucide="cpu" style="width:12px;height:12px;"></i>
                        Mapping required skills
                    </div>
                    <div class="loading-step" id="step-3">
                        <i data-lucide="book-open" style="width:12px;height:12px;"></i>
                        Curating learning resources
                    </div>
                </div>
            </div>
        </div>
    `,

  
    DashboardSkeleton: () => `
        <div style="max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:1rem;">
            <div class="skeleton" style="height:160px;"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                <div class="skeleton" style="height:180px;"></div>
                <div class="skeleton" style="height:180px;"></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;">
                <div class="skeleton" style="height:220px;"></div>
                <div class="skeleton" style="height:220px;"></div>
                <div class="skeleton" style="height:220px;"></div>
            </div>
        </div>
    `
};
