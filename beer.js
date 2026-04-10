// beer.js - Jarra de cerveza para el cumpleaños 🍺
const Beer = (function() {
    let globalScale = 1;

    function drawBeer(ctx, pulse = 0) {
        if (!ctx || !ctx.canvas) return;

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const scale = (1 + pulse * 0.08) * globalScale;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);

        // Sombra
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;

        // Vaso
        const glassGrad = ctx.createLinearGradient(-80, -120, 60, 120);
        glassGrad.addColorStop(0, "#f5c542");
        glassGrad.addColorStop(0.5, "#e6a817");
        glassGrad.addColorStop(1, "#c98900");
        
        ctx.beginPath();
        ctx.moveTo(-80, -120);
        ctx.lineTo(80, -120);
        ctx.lineTo(60, 120);
        ctx.lineTo(-60, 120);
        ctx.closePath();
        
        ctx.fillStyle = glassGrad;
        ctx.fill();
        
        // Brillo
        ctx.beginPath();
        ctx.moveTo(-70, -110);
        ctx.lineTo(-50, -110);
        ctx.lineTo(-40, 100);
        ctx.lineTo(-55, 100);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fill();

        // Espuma
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        for (let i = 0; i < 5; i++) {
            const foamGrad = ctx.createRadialGradient(
                -60 + i * 30, -135, 5,
                -60 + i * 30, -130, 25
            );
            foamGrad.addColorStop(0, "#ffffff");
            foamGrad.addColorStop(1, "#f0f0f0");
            
            ctx.beginPath();
            ctx.arc(-60 + i * 30, -130, 22 + Math.sin(Date.now() * 0.005 + i) * 2, 0, Math.PI * 2);
            ctx.fillStyle = foamGrad;
            ctx.fill();
        }

        // Líquido
        ctx.beginPath();
        ctx.moveTo(-70, -100);
        ctx.lineTo(70, -100);
        ctx.lineTo(52, 100);
        ctx.lineTo(-52, 100);
        ctx.closePath();
        ctx.fillStyle = "rgba(244, 180, 0, 0.6)";
        ctx.fill();

        // Burbujas
        const now = Date.now();
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        
        for (let i = 0; i < 12; i++) {
            const speed = 0.03 + (i * 0.01);
            const yOffset = (now * speed + i * 30) % 220;
            const xPos = -50 + (i % 8) * 12;
            const size = 2 + (i % 3);
            
            ctx.beginPath();
            ctx.arc(xPos, -100 + yOffset, size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    function setGlobalScale(scale) {
        globalScale = Math.max(0.8, Math.min(1.2, scale));
    }

    return {
        drawBeer,
        setGlobalScale
    };
})();