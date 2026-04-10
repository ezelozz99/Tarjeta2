// flores.js - Gestión de flores animadas (para el cumpleaños de Vian 🎂)
const Flowers = (function() {
    let flowers = [];
    let maxFlowers = 65;
    
    const COLOR_PALETTE = [330, 20, 45, 10, 300, 350, 15, 280, 40];
    
    function generateSingleFlower(x, y, customColor = null) {
        const size = 8 + Math.random() * 12;
        const petalHue = customColor || COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        const petalColor = `hsl(${petalHue}, 85%, 70%)`;
        const centerColor = `hsl(${petalHue + 10}, 90%, 60%)`;
        
        return {
            x: x,
            y: y,
            size: size,
            petalColor: petalColor,
            centerColor: centerColor,
            angle: Math.random() * Math.PI * 2,
            speedRot: 0.005 + Math.random() * 0.02,
            life: 1,
            phase: Math.random() * Math.PI * 2,
            wiggle: 0.3 + Math.random() * 0.8,
            scale: 0.7 + Math.random() * 0.6,
            opacity: 0.7 + Math.random() * 0.3,
            createdAt: Date.now()
        };
    }
    
    function generateFlowers(count = 32, heartPoints = []) {
        const newFlowers = [];
        
        for (let i = 0; i < count; i++) {
            let x, y;
            
            if (Math.random() < 0.7 && heartPoints && heartPoints.length > 0) {
                const idx = Math.floor(Math.random() * heartPoints.length);
                const base = heartPoints[idx];
                const angleOffset = Math.random() * Math.PI * 2;
                const radiusVar = 10 + Math.random() * 25;
                x = base.x + Math.cos(angleOffset) * radiusVar;
                y = base.y + Math.sin(angleOffset) * radiusVar;
            } else {
                const angleRad = Math.random() * Math.PI * 2;
                const rad = 80 + Math.random() * 100;
                const centerX = window.Heart?.centerX || 300;
                const centerY = window.Heart?.centerY || 300;
                
                x = centerX + Math.cos(angleRad) * rad * (0.8 + Math.random() * 0.8);
                y = centerY + Math.sin(angleRad) * rad * 0.8 + (Math.random() - 0.5) * 40;
            }
            
            x = Math.min(Math.max(x, 30), 570);
            y = Math.min(Math.max(y, 30), 570);
            
            newFlowers.push(generateSingleFlower(x, y));
        }
        return newFlowers;
    }
    
    function drawFlower(ctx, flower) {
        ctx.save();
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.translate(flower.x, flower.y);
        ctx.rotate(flower.angle);
        ctx.scale(flower.scale, flower.scale);
        
        const petalCount = 5;
        const petalRadius = flower.size;
        const centerRadius = flower.size * 0.4;
        
        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const px = Math.cos(angle) * petalRadius * 0.9;
            const py = Math.sin(angle) * petalRadius * 0.9;
            
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, petalRadius * 0.7, petalRadius * 0.45, 0, 0, Math.PI * 2);
            ctx.fillStyle = flower.petalColor;
            ctx.globalAlpha = flower.life * flower.opacity * 0.95;
            ctx.fill();
            ctx.restore();
        }
        
        const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, centerRadius);
        centerGrad.addColorStop(0, flower.centerColor);
        centerGrad.addColorStop(1, `hsl(${parseInt(flower.centerColor.match(/\d+/)?.[0] || 0)}, 85%, 45%)`);
        
        ctx.beginPath();
        ctx.arc(0, 0, centerRadius, 0, Math.PI * 2);
        ctx.fillStyle = centerGrad;
        ctx.globalAlpha = flower.life;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, 0, centerRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#FFE484";
        ctx.fill();
        
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    
    function updateFlowers(timeAnim) {
        for (let f of flowers) {
            f.angle += f.speedRot;
            f.x += Math.sin(timeAnim * 0.002 + f.phase) * 0.1;
            f.y += Math.cos(timeAnim * 0.0017 + f.phase * 1.3) * 0.08;
            f.scale = 0.8 + Math.sin(timeAnim * 0.003 + f.phase) * 0.1;
            f.x = Math.min(Math.max(f.x, 20), 580);
            f.y = Math.min(Math.max(f.y, 20), 580);
        }
    }
    
    function addFlower(x, y, customColor = null) {
        const newFlower = generateSingleFlower(x, y, customColor);
        newFlower.scale = 0.3;
        flowers.push(newFlower);
        
        let growStep = 0;
        const growInterval = setInterval(() => {
            growStep += 0.05;
            newFlower.scale = Math.min(0.3 + growStep, 0.7 + Math.random() * 0.6);
            if (growStep >= 1) clearInterval(growInterval);
        }, 50);
        
        if (flowers.length > maxFlowers) {
            flowers.shift();
        }
        
        return newFlower;
    }
    
    function resetFlowers(heartPoints = null) {
        flowers = [];
        const mainFlowers = generateFlowers(28, heartPoints);
        const extraFlowers = generateFlowers(12, heartPoints);
        flowers.push(...mainFlowers, ...extraFlowers);
        
        if (flowers.length > maxFlowers) {
            flowers = flowers.slice(0, maxFlowers);
        }
    }
    
    function clearFlowers() {
        flowers = [];
    }
    
    function getFlowerCount() {
        return flowers.length;
    }
    
    function drawAll(ctx) {
        if (!ctx || flowers.length === 0) return;
        
        const sortedFlowers = [...flowers].sort((a, b) => a.size - b.size);
        
        for (const flower of sortedFlowers) {
            drawFlower(ctx, flower);
        }
    }
    
    return {
        generateFlowers,
        resetFlowers,
        addFlower,
        updateFlowers,
        drawAll,
        clearFlowers,
        getFlowerCount
    };
})();