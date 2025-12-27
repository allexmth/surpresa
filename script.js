/* --- ESTADO DA APLICAÇÃO --- */
const state = { selectedTypes: [], finalColors: [], wrapperColor: '' };

const colorPalettes = {
    'Vermelha': ['#d90429', '#ef233c', '#ff5c6a'],
    'Branca': ['#f8f9fa', '#e9ecef', '#dee2e6'],
    'Rosa': ['#ff0a54', '#ff477e', '#ff7096'],
    'Champanhe': ['#ffdec1', '#ffc8a2', '#e0b194'],
    'Azul': ['#4361ee', '#4895ef', '#56cfe1']
};

/* --- FUNÇÕES LÓGICAS --- */

function selectRose(element) {
    const type = element.getAttribute('data-type');
    if (state.selectedTypes.includes(type)) {
        state.selectedTypes = state.selectedTypes.filter(t => t !== type);
        element.classList.remove('selected');
    } else {
        if (state.selectedTypes.length < 3) {
            state.selectedTypes.push(type);
            element.classList.add('selected');
        }
    }
    document.getElementById('btn-step-1').disabled = state.selectedTypes.length === 0;
}

function goToStep(stepNumber) {
    if (stepNumber === 'final') {
        document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
        document.getElementById('step-final').classList.add('active');
        return;
    }
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    const currentStep = document.getElementById(`step-${stepNumber}`);
    if(currentStep) currentStep.classList.add('active');
    if (stepNumber === 2) renderStep2();
}

function renderStep2() {
    const container = document.getElementById('dynamic-color-selection');
    container.innerHTML = ''; state.finalColors = [];
    
    state.selectedTypes.forEach(type => {
        const title = document.createElement('h3');
        title.style.margin = "10px 0 5px 0"; title.style.fontSize = "1.2rem"; title.style.color = "#888";
        title.innerText = `Tom para ${type}`;
        container.appendChild(title);
        
        const paletteDiv = document.createElement('div');
        paletteDiv.className = 'color-picker-container';
        
        colorPalettes[type].forEach((color, index) => {
            const circle = document.createElement('div');
            circle.className = 'color-circle'; circle.style.backgroundColor = color;
            if (index === 0) { circle.classList.add('selected'); state.finalColors.push(color); }
            
            circle.onclick = function() {
                Array.from(paletteDiv.children).forEach(c => c.classList.remove('selected'));
                circle.classList.add('selected'); paletteDiv.setAttribute('data-selected-color', color);
            };
            
            paletteDiv.setAttribute('data-selected-color', colorPalettes[type][0]);
            paletteDiv.appendChild(circle);
        });
        container.appendChild(paletteDiv);
    });
}

function selectWrapper(color, el) {
    state.wrapperColor = color;
    document.querySelectorAll('#wrapper-colors .color-circle').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('btn-step-3').disabled = false;
}

function goToFinal() {
    const paletteDivs = document.querySelectorAll('#dynamic-color-selection .color-picker-container');
    state.finalColors = Array.from(paletteDivs).map(div => div.getAttribute('data-selected-color'));
    goToStep('final');
    
    const bouquetContainer = document.getElementById('bouquet-display');
    const wrapper = document.getElementById('final-wrapper');
    wrapper.style.borderTopColor = state.wrapperColor;
    
    const totalFlowers = 15;
    for (let i = 0; i < totalFlowers; i++) {
        createFlower(bouquetContainer, state.finalColors[i % state.finalColors.length], i, totalFlowers);
    }
}

function createFlower(container, color, index, total) {
    // 1. Criar o CAULE
    const stem = document.createElement('div');
    stem.className = 'stem';
    const height = 120 + Math.random() * 100;
    stem.style.height = `${height}px`;

    const angle = (index / (total - 1)) * 100 - 50;
    const randomAngleAdjust = (Math.random() - 0.5) * 15;
    stem.style.transform = `rotate(${angle + randomAngleAdjust}deg)`;
    stem.style.zIndex = Math.floor(height); // Z-index baixo (atrás do papel)

    // 2. Criar o WRAPPER (Animação)
    const wrapper = document.createElement('div');
    wrapper.className = 'flower-wrapper flower-anim';
    wrapper.style.animationDelay = `${index * 0.1}s`;

    // 3. Criar a FLOR (Visual)
    const flower = document.createElement('div');
    flower.className = 'flower';
    
    const encodedColor = color.replace('#', '%23');
    const heartSVG = `<svg viewBox="0 0 32 29.6" xmlns="http://www.w3.org/2000/svg"><path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2 c6.1-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z" fill="${encodedColor}"/></svg>`;
    flower.style.backgroundImage = `url('data:image/svg+xml;utf8,${heartSVG.replace(/\s+/g, ' ').trim()}')`;

    const flowerRotation = (Math.random() - 0.5) * 40;
    flower.style.setProperty('--flower-rot', `${flowerRotation}deg`);

    // Montar hierarquia
    wrapper.appendChild(flower);
    stem.appendChild(wrapper);
    
    // Inserir no container
    container.insertBefore(stem, container.firstChild);
}