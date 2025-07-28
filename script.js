const translations = {
    "pl": {
        "title": "Aplikacje Matematyczne",
        "welcome": {
            "title": "Witaj w Aplikacjach Matematycznych",
            "subtitle": "Odkryj narzędzia do obliczeń matematycznych",
            "button": "Rozpocznij"
        },
        "menu": {
            "applications": "Aplikacje",
            "help": "Pomoc",
            "about": "O aplikacji",
            "instructions": "Instrukcja"
        },
        "leapYear": {
            "title": "Badacz roku przestępnego",
            "prompt": "Podaj rok:",
            "button": "Oblicz",
            "history": "Historia:",
            "error": "Wprowadź poprawny rok (liczbę całkowitą).",
            "yes": "To {verb} rok przestępny",
            "no": "To nie {verb} rok przestępny",
            "verbs": {"past": "był", "present": "jest", "future": "będzie"}
        },
        "matrixCalc": {
            "title": "Kalkulator Macierzy",
            "rows": "Wiersze:",
            "cols": "Kolumny:",
            "operation": "Operacja:",
            "compute": "Oblicz",
            "clear": "Wyczyść",
            "matrix_a": "Macierz A",
            "matrix_b": "Macierz B",
            "result": "Wynik",
            "accept": "Akceptuj",
            "solve": "Układ równań",
            "operations": {
                "add": "Dodawanie",
                "sub": "Odejmowanie",
                "mul": "Mnożenie",
                "det": "Wyznacznik",
                "inv": "Macierz odwrotna",
                "trans": "Transpozycja",
                "solve": "Układ równań"
            },
            "methods": {              
                "cramer": "Cramer",
                "gauss": "Eliminacja Gaussa",
                "gauss_jordan": "Gauss-Jordan",
                "inverse": "Macierz odwrotna"
            },
            "errors": {
                "same_dim": "Macierze muszą mieć te same wymiary do {op}.",
                "mul_dim": "Liczba kolumn A musi być równa liczbie wierszy B.",
                "square": "Macierz musi być kwadratowa, aby wykonać tę operację.",
                "singular": "Macierz osobliwa – brak odwrotności.",
                "invalid": "Niepoprawna liczba w (wiersz {r}, kolumna {c}).",
                "solve_dim": "Macierz B musi być wektorem (1 kolumna) dla układu równań."
            }
        },
    },
    "en": {
        "title": "Math Applications",
        "welcome": {
            "title": "Welcome to Math Applications",
            "subtitle": "Discover tools for mathematical calculations",
            "button": "Get Started"
        },
        "menu": {
            "applications": "Applications",
            "help": "Help",
            "about": "About",
            "instructions": "Instructions"
        },
        "leapYear": {
            "title": "Leap Year Investigator",
            "prompt": "Enter year:",
            "button": "Check",
            "history": "History:",
            "error": "Enter a valid integer year.",
            "yes": "It {verb} a leap year",
            "no": "It is not {verb} a leap year",
            "verbs": {"past": "was", "present": "is", "future": "will be"}
        },
        "matrixCalc": {
            "title": "Matrix Calculator",
            "rows": "Rows:",
            "cols": "Columns:",
            "operation": "Operation:",
            "compute": "Compute",
            "clear": "Clear",
            "matrix_a": "Matrix A",
            "matrix_b": "Matrix B",
            "result": "Result",
            "accept": "Accept",
            "solve": "Solve",
            "operations": {
                "add": "Addition",
                "sub": "Subtraction",
                "mul": "Multiplication",
                "det": "Determinant",
                "inv": "Inverse",
                "trans": "Transpose",
                "solve": "Solve"
            },
            "methods": {
                "cramer": "Cramer",
                "gauss": "Gaussian elimination",
                "gauss_jordan": "Gauss-Jordan",
                "inverse": "Inverse matrix"
            },
            "errors": {
                "same_dim": "Matrices must have the same dimensions for {op}.",
                "mul_dim": "Columns of A must equal rows of B.",
                "square": "Matrix must be square for this operation.",
                "singular": "Matrix is singular – cannot invert.",
                "invalid": "Invalid number at (row {r}, col {c}).",
                "solve_dim": "Matrix B must be a vector (1 column) for equation system."
            }
        },
    }
};

let currentLang = "pl";

const canvas = document.getElementById('mathBg');
const ctx = canvas.getContext('2d');

const symbols = ['π', '√', '∑', '∆', '∫', '∂', '∇', '+', '×', '[aᵢⱼ]', '-'];
const particles = [];
const maxParticles = 500;
const maxEffectDist = 150;
const maxWaveRadius = 255;
const waveDuration = 1000;

let mouse = { x: -9999, y: -9999 };
let waves = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < Math.min(Math.floor((window.innerWidth * window.innerHeight) / 500), maxParticles); i++) {
    const baseSize = 16 + Math.random() * 8;
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        baseSize,
        size: baseSize,
        color: '#444'
    });
}

window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('click', e => {
    if (!e.target.closest('.matrix-input, .size-input, .action-btn, .operation-btn, .accept-btn, .method-btn')) {
        waves.push({
            x: e.clientX,
            y: e.clientY,
            startTime: performance.now()
        });
    }
});

function animate(now = performance.now()) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    waves = waves.filter(wave => now - wave.startTime < waveDuration);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let p of particles) {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distSqMouse = dxMouse * dxMouse + dyMouse * dyMouse;
        const effectMouse = Math.max(0, 1 - distSqMouse / (maxEffectDist * maxEffectDist));

        let effectWave = 0;
        for (const wave of waves) {
            const progress = (now - wave.startTime) / waveDuration;
            const radius = progress * maxWaveRadius;

            const dx = p.x - wave.x;
            const dy = p.y - wave.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const diff = Math.abs(dist - radius);
            const thickness = 40;

            if (diff < thickness) {
                const strength = 1 - diff / thickness;
                if (strength > effectWave) effectWave = strength;
            }
        }

        const effect = Math.max(effectMouse, effectWave);
        p.size = p.baseSize + effect * p.baseSize * 1.2;
        if (effectWave > effectMouse) {
            p.color = '#E07A5F';
        } else {
            const gray = Math.floor(100 + (1 - effect) * 100);
            p.color = `rgb(${gray},${gray},${gray})`;
        }

        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.symbol, Math.round(p.x), Math.round(p.y));
    }

    updateFpsCounter(now);
    requestAnimationFrame(animate);
}

let lastFpsUpdate = 0;
let frames = 0;
function updateFpsCounter(now) {
    frames++;
    if (now - lastFpsUpdate >= 1000) {
        document.getElementById('fps-counter').textContent = `FPS: ${frames}`;
        frames = 0;
        lastFpsUpdate = now;
    }
}

requestAnimationFrame(animate);

document.querySelector('.start-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelector('.welcome-screen').classList.add('hidden');
    document.querySelector('.home-screen').style.display = 'flex';
    
    initLanguageMenu();
    initHomeMenu();
    initAppMenu();

    setTimeout(() => {
        document.querySelector('.welcome-screen').style.display = 'none';
    }, 500);
});

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', function(e) {
        e.stopPropagation();
        const app = this.dataset.app;
        document.querySelector('.home-screen').style.display = 'none';
        document.querySelector('.app-container').style.display = 'block';
        
        document.querySelectorAll('.app-content').forEach(content => {
            content.classList.remove('active');
        });
        
        document.getElementById(app + 'App').classList.add('active');
        if (app === 'matrixCalc') {
            initMatrixCalculatorButtonEvents();
        }
    });
});

function switchLanguage(code) {
    currentLang = code;
    updateUI();
    
    document.querySelectorAll('.lang-menu div').forEach((item, index) => {
        if (index === 0) item.textContent = currentLang === 'pl' ? 'Polski PL' : 'Polish PL';
        if (index === 1) item.textContent = currentLang === 'pl' ? 'English GB' : 'Angielski GB';
    });
    
    document.querySelectorAll('.lang-menu').forEach(menu => {
        menu.style.display = 'none';
    });
}

function updateUI() {
    document.title = translations[currentLang].title;

    const welcomeTitle = document.querySelector('.welcome-title');
    const welcomeSubtitle = document.querySelector('.welcome-subtitle');
    const startButton = document.querySelector('.start-btn');

    if (welcomeTitle) welcomeTitle.textContent = translations[currentLang].welcome.title;
    if (welcomeSubtitle) welcomeSubtitle.textContent = translations[currentLang].welcome.subtitle;
    if (startButton) startButton.textContent = translations[currentLang].welcome.button;
    
    const homeTitle = document.querySelector('.home-title');
    if (homeTitle) homeTitle.textContent = translations[currentLang].title;
    
    document.querySelectorAll('.tile-label').forEach((tile, index) => {
        if (index === 0) tile.textContent = translations[currentLang].leapYear.title;
        if (index === 1) tile.textContent = translations[currentLang].matrixCalc.title;
    });
    
    const homeAppMenuItem = document.getElementById('homeAppMenuItem');
    if (homeAppMenuItem) homeAppMenuItem.textContent = currentLang === 'pl' ? 'Aplikacje' : 'Applications';
    
    const homeHelpMenuItem = document.getElementById('homeHelpMenuItem');
    if (homeHelpMenuItem) homeHelpMenuItem.textContent = currentLang === 'pl' ? 'Pomoc' : 'Help';
    
    document.querySelectorAll('#homeAppSubmenu .submenu-item').forEach((item, index) => {
        if (index === 1) item.textContent = translations[currentLang].leapYear.title;
        if (index === 2) item.textContent = translations[currentLang].matrixCalc.title;
    });
    
    document.querySelectorAll('#homeHelpSubmenu .submenu-item').forEach((item, index) => {
        if (index === 1) item.textContent = currentLang === 'pl' ? 'O aplikacji' : 'About';
        if (index === 2) item.textContent = currentLang === 'pl' ? 'Instrukcja' : 'Instructions';
    });

    document.getElementById('title').textContent = translations[currentLang].title;
    
    document.getElementById('leapYearTitle').textContent = translations[currentLang].leapYear.title;
    document.getElementById('yearLabel').textContent = translations[currentLang].leapYear.prompt;
    document.getElementById('checkBtn').textContent = translations[currentLang].leapYear.button;
    document.getElementById('historyLabel').textContent = translations[currentLang].leapYear.history;
    translateHistory();

    document.getElementById('matrixCalcTitle').textContent = translations[currentLang].matrixCalc.title;
    document.getElementById('operationLabel').textContent = translations[currentLang].matrixCalc.operation;
    document.getElementById('operationBtn').textContent = translations[currentLang].matrixCalc.operations[currentOperation];
    document.getElementById('computeBtn').textContent = translations[currentLang].matrixCalc.compute;
    document.getElementById('clearBtn').textContent = translations[currentLang].matrixCalc.clear;
    document.getElementById('matrixATitle').textContent = translations[currentLang].matrixCalc.matrix_a;
    document.getElementById('matrixBTitle').textContent = translations[currentLang].matrixCalc.matrix_b;
    document.getElementById('rowsALabel').textContent = translations[currentLang].matrixCalc.rows;
    document.getElementById('colsALabel').textContent = translations[currentLang].matrixCalc.cols;
    document.getElementById('rowsBLabel').textContent = translations[currentLang].matrixCalc.rows;
    document.getElementById('colsBLabel').textContent = translations[currentLang].matrixCalc.cols;
    document.getElementById('acceptA').textContent = translations[currentLang].matrixCalc.accept;
    document.getElementById('acceptB').textContent = translations[currentLang].matrixCalc.accept;

    document.getElementById('appMenuItem').textContent = currentLang === 'pl' ? 'Aplikacje' : 'Applications';
    document.querySelectorAll('#appSubmenu .submenu-item').forEach((item, index) => {
        if (index === 0) item.textContent = translations[currentLang].leapYear.title;
        if (index === 1) item.textContent = translations[currentLang].matrixCalc.title;
    });
    
    document.getElementById('helpMenuItem').textContent = currentLang === 'pl' ? 'Pomoc' : 'Help';
    document.querySelectorAll('#helpSubmenu .submenu-item').forEach((item, index) => {
        if (index === 0) item.textContent = currentLang === 'pl' ? 'O aplikacji' : 'About';
        if (index === 1) item.textContent = currentLang === 'pl' ? 'Instrukcja' : 'Instructions';
    });
    
    document.querySelectorAll('.lang-menu div').forEach((item, index) => {
        if (index === 0) item.textContent = currentLang === 'pl' ? 'Polski PL' : 'Polish PL';
        if (index === 1) item.textContent = currentLang === 'pl' ? 'English GB' : 'Angielski GB';
    });
    
    const operationMenu = document.getElementById('operationMenu');
    if (operationMenu) {
        operationMenu.innerHTML = '';
        for (const [key, value] of Object.entries(translations[currentLang].matrixCalc.operations)) {
            const item = document.createElement('div');
            item.className = 'operation-menu-item';
            item.textContent = value;
            item.dataset.op = key;
            operationMenu.appendChild(item);
        }
    }
    
    const methodSelector = document.getElementById('methodSelector');
    if (methodSelector) {
        methodSelector.innerHTML = '';
        if (currentOperation === 'solve') {
            for (const [key, value] of Object.entries(translations[currentLang].matrixCalc.methods)) {
                const btn = document.createElement('button');
                btn.className = `method-btn ${key === currentMethod ? 'active' : ''}`;
                btn.textContent = value;
                btn.dataset.method = key;
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentMethod = key;
                    updateMethodButtons();
                });
                methodSelector.appendChild(btn);
            }
            methodSelector.style.display = 'flex';
        } else {
            methodSelector.style.display = 'none';
        }
    }
    
    if (history.length > 0) {
        const historyBox = document.getElementById('historyBox');
        if (historyBox) {
            historyBox.innerHTML = '';
            history.forEach(item => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'history-entry';
                entryDiv.textContent = item;
                historyBox.appendChild(entryDiv);
            });
        }
    }
}

function initLanguageMenu() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            document.querySelectorAll('.lang-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    document.querySelectorAll('.lang-menu div').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            switchLanguage(this.dataset.lang);
            document.querySelectorAll('.lang-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });
    });
}

function initHomeMenu() {
    const homeMenuBtn = document.querySelector('.home-menu-btn');
    const homeSideMenu = document.getElementById('homeSideMenu');
    const homeAppMenuItem = document.getElementById('homeAppMenuItem');
    const homeAppSubmenu = document.getElementById('homeAppSubmenu');
    const homeHelpMenuItem = document.getElementById('homeHelpMenuItem');
    const homeHelpSubmenu = document.getElementById('homeHelpSubmenu');
    const homeLangBtn = document.getElementById('homeLangBtn');
    const homeLangMenu = document.getElementById('homeLangMenu');

    homeMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        homeSideMenu.classList.toggle('open');
        homeMenuBtn.style.display = homeSideMenu.classList.contains('open') ? 'none' : 'block';
    });

    homeAppMenuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        homeAppSubmenu.classList.toggle('open');
        homeHelpSubmenu.classList.remove('open');
        homeAppMenuItem.classList.toggle('active');
        homeHelpMenuItem.classList.remove('active');
    });

    homeHelpMenuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        homeHelpSubmenu.classList.toggle('open');
        homeAppSubmenu.classList.remove('open');
        homeHelpMenuItem.classList.toggle('active');
        homeAppMenuItem.classList.remove('active');
    });

    document.getElementById('homeBackBtn1').addEventListener('click', (e) => {
        e.stopPropagation();
        homeAppSubmenu.classList.remove('open');
        homeAppMenuItem.classList.remove('active');
    });

    document.getElementById('homeBackBtn2').addEventListener('click', (e) => {
        e.stopPropagation();
        homeHelpSubmenu.classList.remove('open');
        homeHelpMenuItem.classList.remove('active');
    });

    homeLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.lang-menu').forEach(menu => {
            if (menu !== homeLangMenu) menu.style.display = 'none';
        });
        homeLangMenu.style.display = homeLangMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!homeSideMenu.contains(e.target) && e.target !== homeMenuBtn) {
            homeSideMenu.classList.remove('open');
            homeMenuBtn.style.display = 'block';
        }
        if (!homeLangMenu.contains(e.target) && e.target !== homeLangBtn) {
            homeLangMenu.style.display = 'none';
        }
    });

    homeLangMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target.dataset.lang) {
            switchLanguage(e.target.dataset.lang);
            homeLangMenu.style.display = 'none';
        }
    });

    document.querySelectorAll('#homeAppSubmenu .submenu-item[data-app]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const app = item.dataset.app;
            document.querySelector('.home-screen').style.display = 'none';
            document.querySelector('.app-container').style.display = 'block';
            document.querySelectorAll('.app-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(app + 'App').classList.add('active');
            
            homeSideMenu.classList.remove('open');
            homeAppSubmenu.classList.remove('open');
            homeHelpSubmenu.classList.remove('open');
            homeMenuBtn.style.display = 'block';
            
            if (app === 'matrixCalc') {
                initMatrixCalculatorButtonEvents();
            }
        });
    });
}

function initAppMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const sideMenu = document.getElementById('sideMenu');
    const appMenuItem = document.getElementById('appMenuItem');
    const appSubmenu = document.getElementById('appSubmenu');
    const helpMenuItem = document.getElementById('helpMenuItem');
    const helpSubmenu = document.getElementById('helpSubmenu');
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sideMenu.classList.toggle('open');
        menuBtn.style.display = sideMenu.classList.contains('open') ? 'none' : 'block';
    });

    appMenuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        appSubmenu.classList.toggle('open');
        helpSubmenu.classList.remove('open');
        appMenuItem.classList.toggle('active');
        helpMenuItem.classList.remove('active');
    });

    helpMenuItem.addEventListener('click', (e) => {
        e.stopPropagation();
        helpSubmenu.classList.toggle('open');
        appSubmenu.classList.remove('open');
        helpMenuItem.classList.toggle('active');
        appMenuItem.classList.remove('active');
    });

    document.getElementById('backBtn1').addEventListener('click', (e) => {
        e.stopPropagation();
        appSubmenu.classList.remove('open');
        appMenuItem.classList.remove('active');
    });

    document.getElementById('backBtn2').addEventListener('click', (e) => {
        e.stopPropagation();
        helpSubmenu.classList.remove('open');
        helpMenuItem.classList.remove('active');
    });

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.lang-menu').forEach(menu => {
            if (menu !== langMenu) menu.style.display = 'none';
        });
        langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && e.target !== menuBtn) {
            sideMenu.classList.remove('open');
            menuBtn.style.display = 'block';
        }
        if (!langMenu.contains(e.target) && e.target !== langBtn) {
            langMenu.style.display = 'none';
        }
    });

    langMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        if (e.target.dataset.lang) {
            switchLanguage(e.target.dataset.lang);
            langMenu.style.display = 'none';
        }
    });

    document.querySelectorAll('#appSubmenu .submenu-item[data-app]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const app = item.dataset.app;
            document.querySelectorAll('.app-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(app + 'App').classList.add('active');
            
            sideMenu.classList.remove('open');
            appSubmenu.classList.remove('open');
            helpSubmenu.classList.remove('open');
            menuBtn.style.display = 'block';
            
            if (app === 'matrixCalc') {
                initMatrixCalculatorButtonEvents();
            }
        });
    });

    document.querySelectorAll('#helpSubmenu .submenu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            sideMenu.classList.remove('open');
            appSubmenu.classList.remove('open');
            helpSubmenu.classList.remove('open');
            menuBtn.style.display = 'block';
        });
    });
}

let previousResult = "";
let history = [];
const MAX_HISTORY = 10;
const animationDelay = 500;

const yearInput = document.getElementById('yearInput');
const checkBtn = document.getElementById('checkBtn');
const resultContainer = document.getElementById('resultContainer');
const historyBox = document.getElementById('historyBox');

function isLeapYear(year) {
    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

function getVerb(year, lang) {
    const now = new Date().getFullYear();
    const tense = year < now ? "past" : year === now ? "present" : "future";
    return translations[lang].leapYear.verbs[tense];
}

function checkLeapYear() {
    const lang = translations[currentLang].leapYear;
    try {
        const year = parseInt(yearInput.value);
        if (isNaN(year)) {
            throw new Error(lang.error);
        }
        
        const verb = getVerb(year, currentLang);
        let result;
        if (isLeapYear(year)) {
            result = lang.yes.replace('{verb}', verb);
        } else {
            result = lang.no.replace('{verb}', verb);
        }
        
        animateTextChange(result, previousResult);
        updateHistory(year, result);
        previousResult = result;
    } catch (error) {
        alert(error.message);
    }
}

function animateTextChange(newText, oldText) {
    resultContainer.innerHTML = '';

    const newWords = newText.split(' ');
    const oldWords = oldText ? oldText.split(' ') : [];

    const diffIndices = [];
    for (let i = 0; i < newWords.length; i++) {
        if (i >= oldWords.length || newWords[i] !== oldWords[i]) {
            diffIndices.push(i);
        }
    }

    if (diffIndices.length === 0) {
        const span = document.createElement('span');
        span.className = 'result-word';
        span.textContent = newText;
        resultContainer.appendChild(span);
        return;
    }

    newWords.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'result-word';
    
        if (diffIndices.includes(i)) {
            span.style.color = 'var(--clr-anim)';
            animateWord(span, word);
        } else {
            span.textContent = word;
        }
    
        resultContainer.appendChild(span);
        if (i < newWords.length - 1) {
            resultContainer.appendChild(document.createTextNode(' '));
        }
    });
}

function animateWord(element, word, index = 0) {
    const totalDuration = 400;
    const speed = Math.max(50, totalDuration / word.length);

    if (index <= word.length) {
        element.textContent = word.substring(0, index);
        setTimeout(() => {
            animateWord(element, word, index + 1);
        }, speed);
    } else {
        element.style.color = 'black';
    }
}

function updateHistory(year, result) {
    const entry = `${year}: ${result}`;
    history.unshift(entry);
    
    if (history.length > MAX_HISTORY) {
        history.pop();
    }
    
    updateHistoryBox();
}

function translateHistory() {
    if (history.length === 0) return;

    const newHistory = [];
    history.forEach(entry => {
        const match = entry.match(/^(\d+):\s*(.*)$/);
        if (!match) return;
    
        const year = parseInt(match[1]);
        const originalResult = match[2];
    
        if (originalResult.includes(translations['pl'].leapYear.yes.split('{verb}')[0])) {
            const verb = getVerb(year, currentLang);
            const translated = translations[currentLang].leapYear.yes.replace('{verb}', verb);
            newHistory.push(`${year}: ${translated}`);
        } 
        else if (originalResult.includes(translations['pl'].leapYear.no.split('{verb}')[0])) {
            const verb = getVerb(year, currentLang);
            const translated = translations[currentLang].leapYear.no.replace('{verb}', verb);
            newHistory.push(`${year}: ${translated}`);
        } else {
            newHistory.push(entry);
        }
    });

    history = newHistory;
    updateHistoryBox();
}

function updateHistoryBox() {
    const historyBox = document.getElementById('historyBox');
    historyBox.innerHTML = '';
    history.forEach(item => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'history-entry';
        entryDiv.textContent = item;
        historyBox.appendChild(entryDiv);
    });
}

function initLeapYearEvents() {
    const newCheckBtn = checkBtn.cloneNode(true);
    checkBtn.parentNode.replaceChild(newCheckBtn, checkBtn);
    checkBtn = newCheckBtn;

    checkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        checkLeapYear();
    });

    yearInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.stopPropagation();
            checkLeapYear();
        }
    });

    yearInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.value = '';
        }
    });

    yearInput.addEventListener('blur', function() {
        if (this.value === '') {
            this.value = '';
        }
    });
}

// Implementacja Kalkulatora macierzy
let currentOperation = "add";
let currentMethod = "cramer";

const operationBtn = document.getElementById('operationBtn');
const operationMenu = document.getElementById('operationMenu');
const methodSelector = document.getElementById('methodSelector');
const computeBtn = document.getElementById('computeBtn');
const clearBtn = document.getElementById('clearBtn');
const matrixA = document.getElementById('matrixA');
const matrixB = document.getElementById('matrixB');
const matrixAGrid = document.getElementById('matrixAGrid');
const matrixBGrid = document.getElementById('matrixBGrid');
const sizeMenuA = document.getElementById('sizeMenuA');
const sizeMenuB = document.getElementById('sizeMenuB');
const rowsA = document.getElementById('rowsA');
const colsA = document.getElementById('colsA');
const rowsB = document.getElementById('rowsB');
const colsB = document.getElementById('colsB');
const acceptA = document.getElementById('acceptA');
const acceptB = document.getElementById('acceptB');
const resultBox = document.getElementById('resultBox');
const solutionBox = document.getElementById('solutionBox');
const matricesContainer = document.getElementById('matricesContainer');

function createMatrix(gridElement, rows, cols) {
    if (!gridElement) {
        throw new Error("Element macierzy nie istnieje!");
    }

    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-input';
            input.value = '0';
            input.dataset.row = i;
            input.dataset.col = j;
            input.inputmode = 'decimal';
            input.pattern = '[0-9]*';
            input.id = `matrix-input-${i}-${j}`;
            input.addEventListener('focus', function(e) {
                e.stopPropagation();
                if (this.value === '0') {
                    this.value = '';
                }
            });
            input.addEventListener('blur', function(e) {
                e.stopPropagation();
                if (this.value === '') {
                    this.value = '0';
                }
            });
            gridElement.appendChild(input);
        }
    }

    document.querySelectorAll('.size-input').forEach(input => {
        input.addEventListener('focus', function(e) {
            e.stopPropagation();
            if (this.value === this.defaultValue) {
                this.value = '';
            }
        });
        input.addEventListener('blur', function(e) {
            e.stopPropagation();
            if (this.value === '') {
                this.value = this.defaultValue;
            }   
        });
    });
}

function getMatrixValues(gridElement) {
    if (!gridElement) {
        throw new Error("Element macierzy nie istnieje!");
    }

    const inputs = gridElement.querySelectorAll('.matrix-input');
    if (inputs.length === 0) {
        throw new Error("Brak pól input w macierzy!");
    }

    const styleCols = gridElement.style.gridTemplateColumns;
    const cols = (styleCols.match(/repeat\((\d+)/) || [])[1] ? parseInt(styleCols.match(/repeat\((\d+)/)[1]) : 1;
    const rows = inputs.length / cols;

    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const input = gridElement.querySelector(`[data-row="${i}"][data-col="${j}"]`) || 
            document.getElementById(`matrix-input-${i}-${j}`);

            if (!input) {
                throw new Error(`Nie znaleziono inputa (wiersz ${i}, kolumna ${j}).`);
            }

            const value = parseFloat(input.value);
            if (isNaN(value)) {
                throw new Error(translations[currentLang].matrixCalc.errors.invalid
                    .replace('{r}', i + 1)
                    .replace('{c}', j + 1));
            }
            row.push(value);
        }
        matrix.push(row);
    }

    if (currentOperation === 'solve' && gridElement === matrixBGrid) {
        if (cols !== 1) {
            console.error("Macierz B ma więcej niż 1 kolumnę:", matrix);
            throw new Error(translations[currentLang].matrixCalc.errors.solve_dim);
        }
    }

    return matrix;
}

function updateMethodButtons() {
    const buttons = document.querySelectorAll('.method-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === currentMethod);
    });
}

function changeOperation(operation) {
    currentOperation = operation;
    operationBtn.textContent = translations[currentLang].matrixCalc.operations[operation];
    const solutionBox = document.getElementById('solutionBox');

    if (operation === 'solve') {
        solutionBox.classList.add('solution-visible');
        const cols = (matrixAGrid.style.gridTemplateColumns?.split(' ') || []).length || 2;
        const rows = matrixAGrid.children.length / cols || 2;
        createMatrix(matrixBGrid, rows, 1);
        document.getElementById('rowsB').value = rows;
        document.getElementById('colsB').value = 1;
        document.getElementById('colsB').disabled = true;
    } else {
        solutionBox.classList.remove('solution-visible');
    }

    adjustMatrixB();
    updateUI();
    centerMatrices();
}

function centerMatrices() {
    if (currentOperation === 'solve' || currentOperation === 'add' || currentOperation === 'sub' || currentOperation === 'mul') {
        matricesContainer.style.justifyContent = 'center';
    } else {
        matricesContainer.style.justifyContent = 'center';
        if (getComputedStyle(matrixB).display === 'none') {
            matricesContainer.style.justifyContent = 'center';
        }
    }
}

function adjustMatrixB() {
    const matrixBFrame = document.getElementById('matrixB');
    const matrixAGrid = document.getElementById('matrixAGrid');
    const matrixBGrid = document.getElementById('matrixBGrid');
    const colsBInput = document.getElementById('colsB');
    
    if (currentOperation === 'solve') {
        const cols = (matrixAGrid.style.gridTemplateColumns?.split(' ') || []).length || 2;
        const rows = matrixAGrid.children.length / cols || 2;
        createMatrix(matrixBGrid, rows, 1);
        document.getElementById('rowsB').value = rows;
        document.getElementById('colsB').value = 1;
        colsBInput.disabled = true;
        matrixBFrame.style.display = 'block';
        
    } else if (['add', 'sub', 'mul'].includes(currentOperation)) {
        const cols = (matrixAGrid.style.gridTemplateColumns?.split(' ') || []).length || 2;
        const rows = matrixAGrid.children.length / cols || 2;
        createMatrix(matrixBGrid, rows, cols);
        document.getElementById('rowsB').value = rows;
        document.getElementById('colsB').value = cols;
        colsBInput.disabled = false;
        matrixBFrame.style.display = 'block';
    } else {
        matrixBFrame.style.display = 'none';
    }
}

function displayResult(result) {
    const resultBox = document.getElementById('resultBox');
    resultBox.innerHTML = '';
    
    if (Array.isArray(result)) {
        const colWidth = 7;
        const lines = result.map(row => {
            if (Array.isArray(row)) {
                return row.map(val => {
                    const str = Number.isInteger(val) ? val.toString() : val.toFixed(2);
                    return str.padStart(colWidth, ' ');
                }).join(' ');
            } else {
                const str = Number.isInteger(row) ? row.toString() : row.toFixed(2);
                return str.padStart(colWidth, ' ');
            }
        });
        
        lines.forEach(line => {
            const div = document.createElement('div');
            div.textContent = line;
            resultBox.appendChild(div);
        });
    } else if (typeof result === 'number') {
        const str = Number.isInteger(result) ? result.toString() : result.toFixed(2);
        resultBox.textContent = str;
    } else {
        resultBox.textContent = result;
    }
}

function displaySolution(solution) {
    const solutionBox = document.getElementById('solutionBox');
    solutionBox.innerHTML = '';
    
    if (Array.isArray(solution)) {
        solution.forEach((val, i) => {
            const div = document.createElement('div');
            div.textContent = `x${i+1} = ${Number.isInteger(val) ? val : val.toFixed(2)}`;
            solutionBox.appendChild(div);
        });
    } else if (typeof solution === 'number') {
        solutionBox.textContent = `x = ${Number.isInteger(solution) ? solution : solution.toFixed(2)}`;
    }
}

function multiplyMatrices(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function calculateDeterminant(matrix) {
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < matrix[0].length; i++) {
        const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
        det += matrix[0][i] * Math.pow(-1, i) * calculateDeterminant(minor);
    }
    return det;
}

function invertMatrix(matrix) {
    const det = calculateDeterminant(matrix);
    if (Math.abs(det) < 1e-10) return null;
    
    const n = matrix.length;
    const inverse = [];
    
    for (let i = 0; i < n; i++) {
        inverse[i] = [];
        for (let j = 0; j < n; j++) {
            const minor = matrix.filter((_, k) => k !== i)
                              .map(row => row.filter((_, k) => k !== j));
            const minorDet = calculateDeterminant(minor);
            inverse[i][j] = Math.pow(-1, i + j) * minorDet / det;
        }
    }
    
    return transposeMatrix(inverse);
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function solveCramer(A, b) {
    const detA = calculateDeterminant(A);
    if (Math.abs(detA) < 1e-10) {
        throw new Error(translations[currentLang].matrixCalc.errors.singular);
    }
    
    const n = A.length;
    const solution = [];
    
    for (let i = 0; i < n; i++) {
        const Ai = A.map(row => [...row]);
        for (let j = 0; j < n; j++) {
            Ai[j][i] = b[j][0];
        }
        solution.push(calculateDeterminant(Ai) / detA);
    }
    
    return solution;
}

function solveGauss(A, b) {
    const n = A.length;
    const Ab = A.map((row, i) => [...row, b[i][0]]);
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(Ab[j][i]) > Math.abs(Ab[maxRow][i])) {
                maxRow = j;
            }
        }
        
        [Ab[i], Ab[maxRow]] = [Ab[maxRow], Ab[i]];
        
        if (Math.abs(Ab[i][i]) < 1e-10) {
            throw new Error(translations[currentLang].matrixCalc.errors.singular);
        }
        
        for (let j = i + 1; j < n; j++) {
            const factor = Ab[j][i] / Ab[i][i];
            for (let k = i; k < n + 1; k++) {
                Ab[j][k] -= factor * Ab[i][k];
            }
        }
    }
    
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = Ab[i][n];
        for (let j = i + 1; j < n; j++) {
            solution[i] -= Ab[i][j] * solution[j];
        }
        solution[i] /= Ab[i][i];
    }
    
    return solution;
}

function gaussJordan(A, b) {
    const n = A.length;
    const Ab = A.map((row, i) => [...row, b[i][0]]);
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(Ab[j][i]) > Math.abs(Ab[maxRow][i])) {
                maxRow = j;
            }
        }
        
        [Ab[i], Ab[maxRow]] = [Ab[maxRow], Ab[i]];
        
        if (Math.abs(Ab[i][i]) < 1e-10) {
            throw new Error(translations[currentLang].matrixCalc.errors.singular);
        }
        
        const pivot = Ab[i][i];
        for (let j = i; j < n + 1; j++) {
            Ab[i][j] /= pivot;
        }
        
        for (let j = 0; j < n; j++) {
            if (j !== i) {
                const factor = Ab[j][i];
                for (let k = i; k < n + 1; k++) {
                    Ab[j][k] -= factor * Ab[i][k];
                }
            }
        }
    }
    
    const rref = Ab.map(row => row.slice(0, n));
    const solution = Ab.map(row => row[n]);
    
    return [rref, solution];
}

function solveInverse(A, b) {
    const invA = invertMatrix(A);
    if (!invA) {
        throw new Error(translations[currentLang].matrixCalc.errors.singular);
    }
    
    const solution = multiplyMatrices(invA, b);
    return solution.map(row => row[0]);
}

function clearMatrices() {
    const inputs = document.querySelectorAll('.matrix-input');
    inputs.forEach(input => {
        input.value = '0';
    });
    resultBox.innerHTML = '';
    solutionBox.innerHTML = '';
    document.querySelector('.solution-container').classList.remove('show');
}

function compute() {
    try {
        const matrixAValues = getMatrixValues(matrixAGrid);
        
        if (['add', 'sub', 'mul', 'solve'].includes(currentOperation)) {
            const matrixBValues = getMatrixValues(matrixBGrid);
            
            if (currentOperation === 'add') {
                if (matrixAValues.length !== matrixBValues.length || 
                    matrixAValues[0].length !== matrixBValues[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.same_dim
                        .replace('{op}', translations[currentLang].matrixCalc.operations.add.toLowerCase()));
                }
                const result = matrixAValues.map((row, i) => 
                    row.map((val, j) => val + matrixBValues[i][j])
                );
                displayResult(result);
            } 
            else if (currentOperation === 'sub') {
                if (matrixAValues.length !== matrixBValues.length || 
                    matrixAValues[0].length !== matrixBValues[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.same_dim
                        .replace('{op}', translations[currentLang].matrixCalc.operations.sub.toLowerCase()));
                }
                const result = matrixAValues.map((row, i) => 
                    row.map((val, j) => val - matrixBValues[i][j])
                );
                displayResult(result);
            } 
            else if (currentOperation === 'mul') {
                if (matrixAValues[0].length !== matrixBValues.length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.mul_dim);
                }
                const result = multiplyMatrices(matrixAValues, matrixBValues);
                displayResult(result);
            } 
            else if (currentOperation === 'solve') {
                const isVector = matrixBValues.every(row => row.length === 1);

                if (matrixAValues.length !== matrixAValues[0].length) {
                    throw new Error(translations[currentLang].matrixCalc.errors.square);
                }
                
                if (!isVector) {
                    console.error('Nieprawidłowy format macierzy B:', matrixBValues);
                    throw new Error(translations[currentLang].matrixCalc.errors.solve_dim);
                }
                
                let solution;
                if (currentMethod === 'cramer') {
                    solution = solveCramer(matrixAValues, matrixBValues);
                    displayResult(solution.map(val => [val]));
                } else if (currentMethod === 'gauss') {
                    solution = solveGauss(matrixAValues, matrixBValues);
                    displayResult(solution.map(val => [val]));
                } else if (currentMethod === 'gauss_jordan') {
                    const [rref, sol] = gaussJordan(matrixAValues, matrixBValues);
                    displayResult(rref);
                    solution = sol;
                } else if (currentMethod === 'inverse') {
                    solution = solveInverse(matrixAValues, matrixBValues);
                    displayResult(solution.map(val => [val]));
                }
                
                displaySolution(solution);
            }
        } 
        else if (currentOperation === 'det') {
            if (matrixAValues.length !== matrixAValues[0].length) {
                throw new Error(translations[currentLang].matrixCalc.errors.square);
            }
            const determinant = calculateDeterminant(matrixAValues);
            displayResult(determinant);
        } 
        else if (currentOperation === 'inv') {
            if (matrixAValues.length !== matrixAValues[0].length) {
                throw new Error(translations[currentLang].matrixCalc.errors.square);
            }
            const inverse = invertMatrix(matrixAValues);
            if (!inverse) {
                throw new Error(translations[currentLang].matrixCalc.errors.singular);
            }
            displayResult(inverse);
        } 
        else if (currentOperation === 'trans') {
            const transposed = transposeMatrix(matrixAValues);
            displayResult(transposed);
        }
        
    } catch (error) {
        alert(error.message);
    }
}

function initMatrixCalculatorEvents() {
    const newOperationBtn = operationBtn.cloneNode(true);
    operationBtn.parentNode.replaceChild(newOperationBtn, operationBtn);
    operationBtn = newOperationBtn;

    operationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        operationMenu.style.display = operationMenu.style.display === 'block' ? 'none' : 'block';
    });

    operationMenu.querySelectorAll('.operation-menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            changeOperation(this.dataset.op);
            operationMenu.style.display = 'none';
        });
    });

    matrixA.addEventListener('click', function(e) {
        if (!e.target.classList.contains('matrix-input')) {
            toggleSizeMenu(matrixA, sizeMenuA);
        }
    });

    matrixB.addEventListener('click', function(e) {
        if (!e.target.classList.contains('matrix-input') && getComputedStyle(matrixB).display !== 'none') {
            toggleSizeMenu(matrixB, sizeMenuB);
            if (currentOperation === 'solve') {
                document.getElementById('colsB').value = 1;
                document.getElementById('colsB').disabled = true;
            } else {
                document.getElementById('colsB').disabled = false;
            }
        }
    });

    const newAcceptA = acceptA.cloneNode(true);
    acceptA.parentNode.replaceChild(newAcceptA, acceptA);
    acceptA = newAcceptA;

    acceptA.addEventListener('click', function(e) {
        e.stopPropagation();
        const rows = parseInt(rowsA.value);
        const cols = parseInt(colsA.value);
        if (rows > 0 && cols > 0) {
            createMatrix(matrixAGrid, rows, cols);
            if (currentOperation === 'solve') {
                createMatrix(matrixBGrid, rows, 1);
                document.getElementById('rowsB').value = rows;
                document.getElementById('colsB').value = 1;
                document.getElementById('colsB').disabled = true;
            }
            sizeMenuA.style.display = 'none';
        } else {
            alert('Wiersze i kolumny muszą być większe od 0.');
        }
    });

    const newAcceptB = acceptB.cloneNode(true);
    acceptB.parentNode.replaceChild(newAcceptB, acceptB);
    acceptB = newAcceptB;

    acceptB.addEventListener('click', function(e) {
        e.stopPropagation();
        const rows = parseInt(rowsB.value);
        let cols = parseInt(colsB.value);
        if (currentOperation === 'solve') {
            cols = 1;
            document.getElementById('colsB').value = 1;
        }
        if (rows > 0 && cols > 0) {
            createMatrix(matrixBGrid, rows, cols);
            sizeMenuB.style.display = 'none';
        } else {
            alert('Wiersze i kolumny muszą być większe od 0.');
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.operation-selector')) {
            operationMenu.style.display = 'none';
        }
        if (!e.target.closest('.matrix-frame') && !e.target.closest('.size-menu')) {
            sizeMenuA.style.display = 'none';
            sizeMenuB.style.display = 'none';
        }
    });

    sizeMenuA.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    sizeMenuB.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function initMatrixCalculatorButtonEvents() {
    const newComputeBtn = computeBtn.cloneNode(true);
    computeBtn.parentNode.replaceChild(newComputeBtn, computeBtn);
    computeBtn = newComputeBtn;

    const newClearBtn = clearBtn.cloneNode(true);
    clearBtn.parentNode.replaceChild(newClearBtn, clearBtn);
    clearBtn = newClearBtn;

    computeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        compute();
    });

    clearBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        clearMatrices();
    });
}

function toggleSizeMenu(matrix, menu) {
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        return;
    }
    
    document.querySelectorAll('.size-menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });
    
    const rect = matrix.getBoundingClientRect();
    menu.style.left = `${rect.left + window.scrollX}px`;
    
    if (window.innerWidth <= 600) {
        menu.style.top = 'auto';
        menu.style.bottom = '20px';
        menu.style.left = '50%';
        menu.style.transform = 'translateX(-50%)';
    } else {
        menu.style.top = `${rect.bottom + window.scrollY}px`;
        menu.style.bottom = 'auto';
        menu.style.transform = 'none';
    }
    
    menu.style.display = 'block';
}

function updateMethodButtons() {
    const buttons = document.querySelectorAll('.method-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.method === currentMethod);
    });
}

createMatrix(matrixAGrid, 2, 2);
createMatrix(matrixBGrid, 2, 2);

document.addEventListener('DOMContentLoaded', () => {
    initLanguageMenu();
    initHomeMenu();
    initAppMenu();
    initLeapYearEvents();
    initMatrixCalculatorEvents();
    initMatrixCalculatorButtonEvents();
    updateUI();
    centerMatrices();
});