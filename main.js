// main.js - Control principal para el cumpleaños de Vian 🎂
const App = (function() {
    let canvas, ctx;
    let animationId;
    let timeAnim = 0;
    let heartbeat = 0;
    let heartbeatDirection = 1;
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
        });
        
        canvas.addEventListener('click', handleCanvasClick);
        canvas.addEventListener('touchstart', handleCanvasTouch, { passive: false });
        
        const resetBtn = document.getElementById('resetButton');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetGame();
            });
        }
        
        console.log('🍺 ¡Feliz Cumpleaños Vian! 🎉');
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
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 1 + Math.random() * 3,
                alpha: 0.1 + Math.random() * 0.3,
                speedX: (Math.random() - 0.5) * 0.1,
                speedY: (Math.random() - 0.5) * 0.1
            });
        }
    }
    
    function resizeCanvas() {
        const maxSize = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 600);
        const dpr = window.devicePixelRatio || 1;
        
        canvas.style.width = `${maxSize}px`;
        canvas.style.height = `${maxSize}px`;
        canvas.width = maxSize * dpr;
        canvas.height = maxSize * dpr;
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        
        width = maxSize;
        height = maxSize;
    }
    
    function updateHeartbeat() {
        heartbeat += 0.035 * heartbeatDirection;
        
        if (heartbeat >= 1) {
            heartbeatDirection = -1;
            heartbeat = 1;
            canvas.style.transform = 'scale(1.02)';
            setTimeout(() => {
                canvas.style.transform = 'scale(1)';
            }, 100);
        }
        if (heartbeat <= 0) {
            heartbeatDirection = 1;
            heartbeat = 0;
        }
        
        const t = heartbeat * Math.PI;
        return Math.sin(t) * 0.85 + Math.sin(t * 2) * 0.05;
    }
    
    function drawFullScene() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, width, height);
        
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#2b1d0e");
        grad.addColorStop(0.5, "#3d2a14");
        grad.addColorStop(1, "#5a3e1b");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        
        if (typeof Flowers !== 'undefined') {
            Flowers.drawAll(ctx);
        }
        
        const pulse = updateHeartbeat();
        if (typeof Beer !== 'undefined') {
            Beer.setGlobalScale(1 + pulse * 0.03);
            Beer.drawBeer(ctx, pulse);
        }
        
        drawParticles();
        drawVignette();
    }
    
    function drawVignette() {
        const grad = ctx.createRadialGradient(width/2, height/2, width*0.3, width/2, height/2, width*0.8);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.3)");
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
            ctx.fillStyle = `rgba(255, 215, 150, ${p.alpha * (0.5 + Math.sin(Date.now() * 0.001 + p.x) * 0.3)})`;
            ctx.fill();
        });
        ctx.restore();
    }
    
    function handleCanvasClick(e) {
        addFlowerAtClick(e);
        if (navigator.vibrate) navigator.vibrate(50);
    }
    
    function handleCanvasTouch(e) {
        e.preventDefault();
        addFlowerAtClick(e);
        if (navigator.vibrate) navigator.vibrate(50);
    }
    
    function addFlowerAtClick(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        let canvasX = (clientX - rect.left) * scaleX;
        let canvasY = (clientY - rect.top) * scaleY;
        canvasX = Math.min(Math.max(canvasX, 25), width - 25);
        canvasY = Math.min(Math.max(canvasY, 25), height - 25);
        
        if (typeof Flowers !== 'undefined') {
            Flowers.addFlower(canvasX, canvasY);
        }
        
        heartbeat = 1;
        heartbeatDirection = -1;
        showClickEffect(canvasX, canvasY);
    }
    
    function showClickEffect(x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 200, 100, 0.4)';
        ctx.fill();
        ctx.restore();
        setTimeout(() => drawFullScene(), 150);
    }
    
    function resetGame() {
        heartbeat = 1;
        heartbeatDirection = -1;
        if (typeof Flowers !== 'undefined') {
            Flowers.clearFlowers();
            Flowers.resetFlowers(Heart.points);
        }
        canvas.style.transform = 'scale(0.95)';
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
        }, 150);
        if (navigator.vibrate) navigator.vibrate(100);
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