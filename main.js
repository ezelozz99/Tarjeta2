// main.js - Control principal optimizado para móvil 📱
const App = (function() {
    let canvas, ctx;
    let animationId;
    let timeAnim = 0;
    let width = 600, height = 600;
    let particles = [];
    
    window.Heart = {
        centerX: 300,
        centerY: 300,
        points: []
    };

    function init() {
        canvas = document.getElementById('heartCanvas');
        if (!canvas) {
            console.error('❌ No se encontró el canvas');
            return;
        }
        
        ctx = canvas.getContext('2d');
        
        // Forzar renderizado nítido en móvil
        ctx.imageSmoothingEnabled = true;
        
        resizeCanvas();
        initParticles();
        updateHeartCenter();
        generateHeartPoints();
        
        if (typeof Flowers !== 'undefined') {
            Flowers.resetFlowers(Heart.points);
            console.log('✅ Flores listas! 🌸');
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            resizeCanvas();
            updateHeartCenter();
            generateHeartPoints();
            initParticles();
            if (typeof Flowers !== 'undefined') {
                Flowers.resetFlowers(Heart.points);
            }
            drawFullScene();
        });
        
        // Eventos táctiles mejorados para móvil
        canvas.addEventListener('click', handleCanvasClick);
        canvas.addEventListener('touchstart', handleCanvasTouch, { 
            passive: false,
            capture: true 
        });
        
        // Prevenir el scroll al tocar el canvas
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        const resetBtn = document.getElementById('resetButton');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetGame();
            });
            resetBtn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                resetGame();
            });
        }
        
        console.log('🌸 ¡Toca en cualquier lugar para añadir flores! (Optimizado para móvil) 🎉');
    }
    
    function handleCanvasClick(e) {
        addFlowerAtClick(e);
    }
    
    function handleCanvasTouch(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches[0];
        if (touch) {
            addFlowerAtTouch(touch);
        }
    }
    
    function addFlowerAtTouch(touch) {
        const rect = canvas.getBoundingClientRect();
        
        // Calcular coordenadas relativas al canvas
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let canvasX = (touch.clientX - rect.left) * scaleX;
        let canvasY = (touch.clientY - rect.top) * scaleY;
        
        canvasX = Math.min(Math.max(canvasX, 25), width - 25);
        canvasY = Math.min(Math.max(canvasY, 25), height - 25);
        
        if (typeof Flowers !== 'undefined') {
            Flowers.addFlower(canvasX, canvasY);
            console.log('🌸 Flor añadida en:', Math.round(canvasX), Math.round(canvasY));
        }
        
        showClickEffect(canvasX, canvasY);
        
        // Feedback háptico si está disponible
        if (navigator.vibrate) navigator.vibrate(30);
    }
    
    function addFlowerAtClick(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let canvasX = (e.clientX - rect.left) * scaleX;
        let canvasY = (e.clientY - rect.top) * scaleY;
        
        canvasX = Math.min(Math.max(canvasX, 25), width - 25);
        canvasY = Math.min(Math.max(canvasY, 25), height - 25);
        
        if (typeof Flowers !== 'undefined') {
            Flowers.addFlower(canvasX, canvasY);
            console.log('🌸 Flor añadida en:', Math.round(canvasX), Math.round(canvasY));
        }
        
        showClickEffect(canvasX, canvasY);
        
        if (navigator.vibrate) navigator.vibrate(30);
    }
    
    function showClickEffect(x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 200, 100, 0.5)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 200, 0.7)';
        ctx.fill();
        ctx.restore();
        
        setTimeout(() => drawFullScene(), 150);
    }
    
    function updateHeartCenter() {
        Heart.centerX = width / 2;
        Heart.centerY = height / 2;
    }
    
    function generateHeartPoints() {
        Heart.points = [];
        const centerX = Heart.centerX;
        const centerY = Heart.centerY;
        const scale = Math.min(width, height) / 600;
        
        for (let t = 0; t <= Math.PI * 2; t += 0.05) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            const px = centerX + x * 12 * scale;
            const py = centerY - y * 12 * scale;
            Heart.points.push({ x: px, y: py });
        }
    }
    
    function initParticles() {
        particles = [];
        // Menos partículas en móvil para mejor rendimiento
        const particleCount = window.innerWidth < 600 ? 25 : 40;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 1 + Math.random() * 2,
                alpha: 0.1 + Math.random() * 0.2,
                speedX: (Math.random() - 0.5) * 0.08,
                speedY: (Math.random() - 0.5) * 0.08
            });
        }
    }
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        const maxSize = Math.min(window.innerWidth * 0.85, window.innerHeight * 0.6, 500);
        const dpr = window.devicePixelRatio || 1;
        
        // Ajustar tamaño del canvas
        canvas.style.width = `${maxSize}px`;
        canvas.style.height = `${maxSize}px`;
        
        // Tamaño real del canvas (para resolución)
        canvas.width = maxSize * dpr;
        canvas.height = maxSize * dpr;
        
        // Resetear transformación
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        
        width = maxSize;
        height = maxSize;
        
        console.log(`Canvas redimensionado: ${width}x${height}`);
    }
    
    function drawFullScene() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, width, height);
        
        // Fondo degradado
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#2b1d0e");
        grad.addColorStop(0.5, "#3d2a14");
        grad.addColorStop(1, "#5a3e1b");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        // 🌸 Flores
        if (typeof Flowers !== 'undefined') {
            Flowers.drawAll(ctx);
        }
        
        // 🍺 Cerveza
        if (typeof Beer !== 'undefined') {
            Beer.setGlobalScale(1);
            Beer.drawBeer(ctx, 0);
        }
        
        drawParticles();
        drawVignette();
    }
    
    function drawVignette() {
        const grad = ctx.createRadialGradient(width/2, height/2, width*0.3, width/2, height/2, width*0.7);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.25)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }
    
    function drawParticles() {
        ctx.save();
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > width) p.speedX *= -1;
            if (p.y < 0 || p.y > height) p.speedY *= -1;
            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 150, ${p.alpha})`;
            ctx.fill();
        });
        ctx.restore();
    }
    
    function resetGame() {
        if (typeof Flowers !== 'undefined') {
            Flowers.clearFlowers();
            Flowers.resetFlowers(Heart.points);
            console.log('🔄 Flores reiniciadas');
        }
        
        canvas.style.transform = 'scale(0.95)';
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
        }, 150);
        
        if (navigator.vibrate) navigator.vibrate(50);
    }
    
    function animate() {
        if (typeof Flowers !== 'undefined') {
            Flowers.updateFlowers(timeAnim);
        }
        drawFullScene();
        timeAnim = (timeAnim + 1) % 1000;
        animationId = requestAnimationFrame(animate);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    return { init };
})();
