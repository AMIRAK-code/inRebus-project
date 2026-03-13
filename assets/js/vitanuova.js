/**
 * inRebus Career AI Assistant
 * ============================================================
 * Custom AI assistant for the inRebus Edu platform.
 * Fully self-contained: injects its own stylesheet + HTML.
 * Knows about: skill gap analysis, career paths, learning recommendations.
 * Uses smart local responses when offline; connects to real backend if available.
 */

(function () {
    'use strict';

    // ── Config ────────────────────────────────────────────────────────────────
    const CSS_PATH  = 'assets/css/vitanuova.css';
    const BACKEND   = 'https://inrebus-vitanuova-ai.vercel.app/api/chat';

    // ── Inject stylesheet ─────────────────────────────────────────────────────
    const link = document.createElement('link');
    link.rel   = 'stylesheet';
    link.href  = CSS_PATH;
    document.head.appendChild(link);

    // ── Smart local knowledge base ───────────────────────────────────────────
    // These responses trigger when the backend is unavailable or for common queries.
    const KB = [
        {
            patterns: ['skill gap', 'skill gaps', 'what are skill gaps', 'gap'],
            response: "**Skill gaps** are the difference between the skills you currently have and what employers require for your target role.\n\nOn inRebus, after you enter your desired role, our AI maps your profile against market data to highlight exactly which skills you need to develop. 🎯\n\nWant me to walk you through the analysis process?"
        },
        {
            patterns: ['how does it work', 'how to use', 'how to start', 'get started', 'explain', 'what can'],
            response: "Here's how inRebus Edu works:\n\n1️⃣ **Enter your target role** in the search bar — e.g. \"Data Scientist\" or \"UX Designer\"\n2️⃣ **Click Analyze Path** — our AI evaluates your profile vs. market requirements\n3️⃣ **Get your Readiness Score** — a percentage showing how ready you are\n4️⃣ **See your personal learning path** — curated courses, certifications & workshops\n\nTry it now by typing a job title in the main search bar!"
        },
        {
            patterns: ['readiness', 'readiness score', 'score', 'percent'],
            response: "Your **Readiness Score** (shown as a % in the dashboard) reflects how well your current skills match the requirements for your target role.\n\n📊 **Score ranges:**\n• 80–100% → You're well-prepared!\n• 60–79% → A few key gaps to close\n• Below 60% → A focused learning path is recommended\n\nThe score updates as you complete recommended modules."
        },
        {
            patterns: ['learning path', 'course', 'courses', 'recommend', 'recommendation', 'learn'],
            response: "Your **personalized learning path** is built automatically after the skill gap analysis.\n\nIt includes:\n📚 **Courses** — for foundational knowledge\n🏅 **Certifications** — to validate your skills\n🛠 **Workshops** — hands-on practical sessions\n\nEach resource is matched to a specific skill gap to maximize your learning efficiency."
        },
        {
            patterns: ['data scientist', 'data science', 'machine learning', 'ml', 'ai engineer'],
            response: "Heading into **Data Science or AI**? Great choice! 🚀\n\nCommon skill gaps we find for this path:\n• Machine Learning & Deep Learning\n• Python (pandas, scikit-learn, TensorFlow)\n• Cloud Platforms (AWS, GCP, Azure)\n• MLOps & Model Deployment\n\nType \"Data Scientist\" in the search bar to get your personalized analysis!"
        },
        {
            patterns: ['ux', 'designer', 'design', 'ui', 'product design'],
            response: "Interested in **UX/UI Design**? Here's what employers look for:\n\n• Figma & prototyping tools\n• User research methodologies\n• Design systems & tokens\n• Accessibility (WCAG standards)\n• Motion design & micro-interactions\n\nEnter \"UX Designer\" in the main search to see your personal readiness score!"
        },
        {
            patterns: ['full stack', 'frontend', 'backend', 'developer', 'software engineer', 'web dev'],
            response: "**Software / Full Stack Development** is one of the most in-demand fields.\n\nKey skills employers want in 2025:\n• JavaScript / TypeScript + React or Vue\n• Node.js & RESTful APIs\n• Cloud (AWS/Azure) & CI/CD\n• Data structures & system design\n• Testing & DevOps practices\n\nTry analyzing your path for \"Full Stack Dev\" using the main search!"
        },
        {
            patterns: ['hello', 'hi', 'hey', 'ciao', 'good morning', 'good afternoon', 'salve'],
            response: "👋 Hey there! I'm the **inRebus AI Assistant** — here to help you navigate your career journey.\n\nHere's what I can help with:\n• Explaining skill gap analysis\n• Career path advice\n• Understanding your readiness score\n• Tips for specific roles\n\nWhat would you like to know?"
        },
        {
            patterns: ['thank', 'thanks', 'grazie', 'perfect', 'perfect', 'great'],
            response: "You're very welcome! 😊\n\nRemember — you can start your career analysis anytime by entering a job title in the main search bar. Good luck on your journey! 🚀"
        },
        {
            patterns: ['mechatronics', 'robotics', 'automation', 'plc', 'industrial'],
            response: "**Mechatronics & Industrial Automation** is a specialized and growing field!\n\nKey skill gaps we typically find:\n• PLC Programming (Siemens, Allen-Bradley)\n• Robotics Control Systems\n• Industrial IoT & SCADA\n• CAD/CAM Software\n• Electrical circuit design\n\nEnter \"Mechatronics Engineer\" in the search bar to get your full analysis!"
        },
        {
            patterns: ['product manager', 'product management', 'pm', 'project manager'],
            response: "**Product Management** is one of the most cross-functional roles out there.\n\nCore competencies employers look for:\n• Product roadmap strategy\n• Agile & Scrum frameworks\n• Data analytics & A/B testing\n• Stakeholder communication\n• UX fundamentals\n\nTry \"Product Manager\" in the main search for your personalized skill gap report!"
        }
    ];

    const DEFAULT_RESPONSE = "That's a great question! For the most accurate answer about your specific career path, I recommend trying the **Analyze Path** feature — just type your target job title in the main search bar.\n\nIs there anything else I can help you with? I can explain skill gaps, readiness scores, or give advice on specific career paths. 💡";

    function getLocalResponse(query) {
        const q = query.toLowerCase().trim();
        for (const entry of KB) {
            if (entry.patterns.some(p => q.includes(p))) {
                return entry.response;
            }
        }
        return DEFAULT_RESPONSE;
    }

    // ── Build HTML ────────────────────────────────────────────────────────────
    function buildWidget() {
        const wrap = document.createElement('div');
        wrap.id = 'ir-assistant';
        wrap.innerHTML = `
            <div id="ir-chat-window" class="ir-hidden">
                <div class="ir-header">
                    <div class="ir-header-logo">in</div>
                    <div class="ir-header-info">
                        <div class="ir-header-name">inRebus Career AI</div>
                        <div class="ir-header-status">
                            <span class="ir-status-dot"></span>
                            Ready to help
                        </div>
                    </div>
                    <button class="ir-close" id="ir-close" aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div id="ir-messages"></div>

                <div class="ir-chips-wrap" id="ir-chips">
                    <button class="ir-chip" data-msg="How does inRebus work?">How it works</button>
                    <button class="ir-chip" data-msg="What are skill gaps?">Skill gaps?</button>
                    <button class="ir-chip" data-msg="Data Scientist path">Data Scientist</button>
                    <button class="ir-chip" data-msg="UX Designer path">UX Designer</button>
                </div>

                <div class="ir-input-area">
                    <div class="ir-input-row">
                        <textarea id="ir-input" placeholder="Ask about your career path…" rows="1" aria-label="Message"></textarea>
                        <button class="ir-send" id="ir-send" aria-label="Send">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <button id="ir-launcher" aria-label="Open Career AI Assistant">
                <div class="ir-launcher-inner">
                    <div class="ir-launcher-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <span class="ir-launcher-label">Ask AI</span>
                </div>
            </button>
        `;
        document.body.appendChild(wrap);
        return wrap;
    }

    // ── Controller ────────────────────────────────────────────────────────────
    function init() {
        const wrap      = buildWidget();
        const launcher  = wrap.querySelector('#ir-launcher');
        const chatWin   = wrap.querySelector('#ir-chat-window');
        const closeBtn  = wrap.querySelector('#ir-close');
        const sendBtn   = wrap.querySelector('#ir-send');
        const input     = wrap.querySelector('#ir-input');
        const messages  = wrap.querySelector('#ir-messages');
        const chipsEl   = wrap.querySelector('#ir-chips');
        const chips     = wrap.querySelectorAll('.ir-chip');

        let history     = [];
        let isWaiting   = false;
        let chipsUsed   = false;

        // Load session
        try { history = JSON.parse(sessionStorage.getItem('ir-chat') || '[]'); } catch(_) {}

        // Show welcome if fresh session
        if (history.length === 0) {
            const welcomeMsg = "👋 Hi! I'm the **inRebus Career AI** — your guide to smarter career planning.\n\nI can help you understand:\n• 📊 Your skill gaps for any role\n• 🎯 How to read your readiness score\n• 📚 Your personalized learning path\n\nWhat can I help you with today?";
            pushHistory('assistant', welcomeMsg);
        }

        renderAll();

        // ── Helpers ──
        function pushHistory(role, content) {
            history.push({ role, content });
            try { sessionStorage.setItem('ir-chat', JSON.stringify(history.slice(-30))); } catch(_) {}
        }

        function renderAll() {
            messages.innerHTML = '';
            history.forEach(m => appendBubble(m.role, m.content, false));
        }

        function appendBubble(role, content, animate = true) {
            const el = document.createElement('div');
            el.className = `ir-bubble ${role}`;
            // Render simple bold markdown (**text**)
            el.innerHTML = content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            if (!animate) el.style.animation = 'none';
            messages.appendChild(el);
            scrollBottom();
            return el;
        }

        function scrollBottom() {
            requestAnimationFrame(() => {
                messages.scrollTop = messages.scrollHeight;
            });
        }

        function showTyping() {
            const el = document.createElement('div');
            el.className = 'ir-typing';
            el.id = 'ir-typing';
            el.innerHTML = '<span></span><span></span><span></span>';
            messages.appendChild(el);
            scrollBottom();
        }

        function hideTyping() {
            const el = messages.querySelector('#ir-typing');
            if (el) el.remove();
        }

        // Auto-grow textarea
        function resizeInput() {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 88) + 'px';
        }
        input.addEventListener('input', resizeInput);

        // ── Send logic ──
        async function send(text) {
            text = text.trim();
            if (!text || isWaiting) return;

            // Hide chips after first use
            if (!chipsUsed && chipsEl) {
                chipsEl.style.display = 'none';
                chipsUsed = true;
            }

            pushHistory('user', text);
            appendBubble('user', text);
            input.value = '';
            input.style.height = 'auto';
            isWaiting = true;
            showTyping();

            // Try backend; fall back to local KB
            let reply = null;
            try {
                const res = await Promise.race([
                    fetch(BACKEND, {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({
                            message: text,
                            history: history.slice(0, -1),
                            // Include site context so backend knows this is for inRebus
                            context: 'inRebus Edu — AI-powered career intelligence platform. Help users with: career path analysis, skill gap identification, readiness scores, and learning recommendations.'
                        })
                    }),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 6000))
                ]);

                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();
                reply = data.text || data.reply || null;
            } catch (_err) {
                // Silently fall back to local knowledge base
                reply = null;
            }

            // Use local KB if backend failed or returned nothing
            if (!reply) {
                reply = getLocalResponse(text);
            }

            hideTyping();
            pushHistory('assistant', reply);
            appendBubble('assistant', reply);
            isWaiting = false;
            input.focus();
        }

        // ── Events ──
        launcher.addEventListener('click', () => {
            chatWin.classList.remove('ir-hidden');
            launcher.classList.add('ir-hidden');
            setTimeout(() => input.focus(), 350);
        });

        closeBtn.addEventListener('click', () => {
            chatWin.classList.add('ir-hidden');
            launcher.classList.remove('ir-hidden');
        });

        sendBtn.addEventListener('click', () => send(input.value));

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input.value);
            }
        });

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const msg = chip.dataset.msg || chip.textContent;
                send(msg);
            });
        });

        // Close on outside click (optional UX)
        document.addEventListener('click', e => {
            if (!wrap.contains(e.target)) {
                chatWin.classList.add('ir-hidden');
                launcher.classList.remove('ir-hidden');
            }
        }, { capture: false });
    }

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
