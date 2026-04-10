// beer.js - Jarra de cerveza optimizada para móvil 🍺📱
const Beer = (function() {
    let globalScale = 1;

    function drawBeer(ctx, pulse = 0) {
        if (!ctx || !ctx.canvas) return;

        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        
        // Escala responsiva basada en el tamaño del canvas
        const responsiveScale = Math.min(ctx.canvas.width, ctx.canvas.height) / 600;
        const scale = globalScale * responsiveScale;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);

        // Sombra (más ligera en móvil para rendimiento)
        ctx.shadowColor = "rgba(0,0,0,0.2)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

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
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 1;
        
        for (let i = 0; i < 5; i++) {
            const foamGrad = ctx.createRadialGradient(
                -60 + i * 30, -135, 5,
                -60 + i * 30, -130, 25
            );
            foamGrad.addColorStop(0, "#ffffff");
            foamGrad.addColorStop(1, "#f0f0f0");
            
            ctx.beginPath();
            ctx.arc(-60 + i * 30, -130 + Math.sin(Date.now() * 0.003 + i) * 1, 22, 0, Math.PI * 2);
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

        // 🫧 BURBUJAS ANIMADAS (optimizadas para móvil)
        const now = Date.now();
        
        // Menos burbujas pero más grandes para mejor visibilidad en móvil
        for (let i = 0; i < 10; i++) {
            const speed = 0.03 + (i * 0.01);
            const yOffset = (now * speed + i * 35) % 220;
            const xPos = -50 + (i % 7) * 14;
            const size = 3 + (i % 3);
            const opacity = 0.6 + Math.sin(now * 0.005 + i) * 0.3;
            
            ctx.beginPath();
            ctx.arc(xPos, -100 + yOffset, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
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