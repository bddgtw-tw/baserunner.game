/* 2026-10-08 Kunio-kun Style B sprite engine; bright sunny daytime theme */
(() => {
    const X = .926, Y = .605, offset = 18; // offset increased to 18 to give outfielders ample breathing room from top
    // World geometry follows the art's base footprints; strategy rules are unchanged.
    bases.second.y = 144;
    const artPositions={CF:118,LF:140,RF:140,SS:170,'2B':170};
    for(const [key,y] of Object.entries(artPositions))if(fielders[key])fielders[key].y=y;
    const stadiumImage = new Image();
    stadiumImage.src = 'assets/stadium-day.png';
    stadiumImage.onload = () => drawStadium();

    const ellipse = (x,y,rx,ry,color) => { ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill(); };
    const polygon = (points,color) => {ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
    const pos = p => [p.x,offset+p.y*Y];
    const pixel = (x,y,w,h,c) => {ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
    function background() {
        if(stadiumImage.complete && stadiumImage.naturalWidth) {
            const fit=Math.min(400/stadiumImage.naturalWidth,260/stadiumImage.naturalHeight);
            const w=stadiumImage.naturalWidth*fit,h=stadiumImage.naturalHeight*fit;
            ctx.drawImage(stadiumImage,(400-w)/2,(260-h)/2,w,h);
            if(nightMode){ctx.fillStyle='#08284766';ctx.fillRect(0,0,400,260);}
            return;
        }
        pixel(0,0,400,260,nightMode?'#132936':'#79dbe7');
        ellipse(200,151,216,143,'#132637');
        for(let row=0;row<9;row++) {
            const rx=208-row*4, ry=137-row*4;
            ctx.strokeStyle=row%2?'#53788b':'#29495f';ctx.lineWidth=4;
            ctx.beginPath();ctx.ellipse(200,151,rx,ry,0,0,Math.PI*2);ctx.stroke();
            for(let n=0;n<90;n++) {
                const a=n*Math.PI*2/90+(row%2)*.025;
                const x=200+Math.cos(a)*rx, y=151+Math.sin(a)*ry;
                if(y>247)continue;
                const colors=['#f2bf35','#df5e42','#5eb9e1','#6fbe64','#f6efe2'];
                pixel(x-2,y-2,4,5,'#142539');pixel(x-2,y+2,4,4,colors[(n+row*3)%5]);
                pixel(x-1,y-1,3,3,'#e6af7b');pixel(x-2,y-3,4,2,colors[(n*3+row)%5]);
            }
        }
        ellipse(200,146,186,107,'#183925');
        ellipse(200,148,182,104,'#ef713e');
        ellipse(200,148,174,96,nightMode?'#25652f':'#38b82a');
        ctx.save();ctx.beginPath();ctx.ellipse(200,148,174,96,0,0,Math.PI*2);ctx.clip();
        for(let x=12;x<390;x+=24)pixel(x,40,12,210,nightMode?'#2c7235':'#4bcb30');
        ctx.restore();
        const h=pos(bases.home),f=pos(bases.first),s=pos(bases.second),t=pos(bases.third);
        polygon([[h[0],h[1]+11],[f[0]+14,f[1]],[s[0],s[1]-13],[t[0]-14,t[1]]],'#f07840');
        polygon([[200,198],[274,150],[200,106],[126,150]],nightMode?'#2d7132':'#47bd30');
        ctx.save();polygon([[200,198],[274,150],[200,106],[126,150]],'#42ba2e');ctx.clip();
        for(let x=120;x<280;x+=24)pixel(x,100,12,105,'#56cc35');ctx.restore();
        ctx.strokeStyle='#fff8e5';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(25,105);ctx.lineTo(...h);ctx.lineTo(375,105);ctx.stroke();
        ellipse(200,150,17,9,'#ed7844');pixel(195,147,10,2,'#fff5d7');
        for(const b of [h,f,s,t])polygon([[b[0],b[1]-3],[b[0]+4,b[1]],[b[0],b[1]+3],[b[0]-4,b[1]]],'#fff9e5');
        ctx.strokeStyle='#fff7e1';ctx.lineWidth=1;ctx.strokeRect(184,216,10,13);ctx.strokeRect(206,216,10,13);
        for(const x of [24,375]){pixel(x,68,2,40,'#e7c732');pixel(x-1,67,4,2,'#fff399');}
        for(let n=0;n<240;n++){const x=(n*73)%400,y=75+(n*37)%150;const dx=Math.abs(x-200),dy=Math.abs(y-150);if(dx/130+dy/78<1&&dx/75+dy/48>1)pixel(x,y,1,1,'#c85e35');}
    }

    /**
     * 風格 B：【熱血高校・硬派平頭粗曠像素風】(Kunio-kun Arcade Sprite Engine)
     * 特色：粗黑邊框、方下巴、粗眉毛、堅毅咬牙/流汗表情、扎實厚重四肢、絕不美型
     */
    drawPixelPlayer = function(c,cx,cy,opts={}) {
        const scale=.85;
        c.save();c.translate(cx,cy);c.scale(scale/X,scale/Y);
        const blue=!opts.isFielder;
        const jerseyColor = blue ? '#2563eb' : (opts.isHandling ? '#d97706' : '#1e3a8a');
        const capColor    = blue ? '#1d4ed8' : (opts.isHandling ? '#b45309' : '#0f172a');
        const hairColor   = '#111827'; // 平頭黑色粗髮
        const skinColor   = '#fbcfe8'; // 健美暖膚色
        const skinShadow  = '#f472b6';
        const outline     = '#090d16'; // 經典熱血硬派粗黑邊框

        const p=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h);};

        // 腳底深色投影
        c.fillStyle='rgba(15,23,42,0.35)';
        c.beginPath();c.ellipse(0,9,10,3.5,0,0,Math.PI*2);c.fill();

        const running=opts.state==='run';
        const sliding=opts.state==='slide';
        const resting=!running && !['slide','out','safe'].includes(opts.state);
        const phase=Date.now()/1000+cx*.071+cy*.043;
        const idleBob=resting?Math.round(Math.sin(phase*2)*.65):0;
        const stride=running?Math.sin((opts.frame||0)*2.1)*3.2:(resting?Math.round(Math.sin(phase*1.5)*.6):0);

        c.translate(0,idleBob);

        if(sliding) {
            // 熱血高校經典滑壘橫臥動作
            c.rotate(-0.85);
            c.translate(-4, -6);
        }

        // --- 1. 粗曠熱血帽子與黑髮鬢角 (Flat-Top Cap & Sideburns) ---
        p(-8,-22,16,4,outline);
        p(-7,-21,14,3,capColor);
        p(4,-20,6,3,outline); // 往前微凸帽簷邊框
        p(4,-19,5,2,capColor); // 帽簷

        // 平頭黑髮從帽子邊緣露出 (Square hairline)
        p(-8,-18,3,4,hairColor);
        p(-9,-16,2,3,outline);

        // --- 2. 硬派方臉與方下巴 (Square Jaw & Robust Face) ---
        p(-7,-18,14,9,outline); // 臉部粗黑輪廓
        p(-6,-17,12,7,'#fcd34d'); // 臉部本體 (健康的陽光膚色)
        p(-5,-16,10,6,'#fde68a'); // 臉部高光
        p(-7,-12,13,3,'#f59e0b'); // 方下巴陰影

        // --- 3. 熱血特徵：極粗劍眉與堅毅雙眼 (Bushy Eyebrows & Determined Eyes) ---
        // 粗黑眉毛 (Bold Angry/Determined Brows)
        p(-4,-15,4,2,outline);
        p(1,-15,4,2,outline);

        // 堅毅小黑眼球
        p(-3,-13,2,2,outline);
        p(2,-13,2,2,outline);
        p(-3,-13,1,1,'#ffffff'); // 眼神銳利亮點
        p(2,-13,1,1,'#ffffff');

        // 咬牙切齒的下巴嘴巴 (Gritted Teeth or Shouting)
        if(opts.state==='out') {
            // 出局：倒八字憤怒懊悔眼
            p(-4,-12,3,1,'#ef4444');
            p(1,-12,3,1,'#ef4444');
        } else {
            // 熱血咬牙線條 (White teeth with outline)
            p(-2,-10,5,2,outline);
            p(-1,-10,3,1,'#ffffff'); // 露出白牙咬牙切齒
        }

        // 熱血奮戰汗滴 (Sweat Drop)
        p(-7,-16,2,2,'#38bdf8');

        // --- 4. 壯碩軀幹與球衣 (Muscular Torso & Jersey) ---
        p(-8,-9,16,10,outline);      // 身體大邊框
        p(-7,-8,14,8,jerseyColor);   // 球衣本體
        p(-1,-8,2,8,'#ffffff');      // 球衣中央白色條紋 (N/條紋)
        p(-7,0,14,2,'#0f172a');       // 粗黑皮帶

        // --- 5. 粗壯手臂與厚重手套 (Chunky Limbs & Mitt) ---
        if(opts.isFielder) {
            // 守備員手套：深褐厚實棒球手套
            p(7,-8,7,7,outline);
            p(8,-7,5,5,opts.isHandling ? '#f59e0b' : '#92400e');
            p(9,-6,3,3,'#b45309');
            // 左手插腰/向前握拳
            p(-9,-7,4,4,outline);
            p(-8,-6,2,2,'#fcd34d');
        } else {
            // 跑者擺臂：雙手握拳大步前衝
            const armOff = Math.round(stride * 0.8);
            p(-10,-6 + armOff,4,4,outline);
            p(-9,-5 + armOff,2,2,'#fcd34d'); // 左拳
            p(7,-6 - armOff,4,4,outline);
            p(8,-5 - armOff,2,2,'#fcd34d');  // 右拳
        }

        // --- 6. 扎實雙腿與厚底釘鞋 (Thick Legs & Heavy Cleats) ---
        const legStep = Math.round(stride);
        // 左腿 (白色球褲 + 厚實黑色釘鞋)
        p(-7,2,5,6 + legStep,outline);
        p(-6,2,3,4 + legStep,'#f8fafc');
        p(-8,6 + legStep,6,3,'#1e293b'); // 釘鞋底

        // 右腿
        p(2,2,5,6 - legStep,outline);
        p(3,2,3,4 - legStep,'#f8fafc');
        p(1,6 - legStep,6,3,'#1e293b');

        c.restore();
    };

    drawFielders = function(scale) {
        const q=generatedQuestions[currentQuestionIdx];
        for(const [key,p] of Object.entries(Object.keys(fieldersState).length?fieldersState:fielders)) {
            drawPixelPlayer(ctx,p.x*scale,p.y*scale,{
                scale:scale*.78,
                isFielder:true,
                isHandling:key===q?.fielderKey,
                state:p.state||'idle',
                frame:Math.floor(Date.now()/120)%3
            });
        }
    };
    function drawCatcherShout(scale) {
        if (!catcherShoutText) return;
        const cPos = fielders["C"];
        if (!cPos) return;
        const pS = scale * 0.95;
        const popY = Math.sin(Date.now() / 400) * 1.5 * scale;
        const bx = 254 * scale;
        const by = (cPos.y - 19) * scale + popY;

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.font = `900 ${10.5 * scale}px 'Noto Sans TC', sans-serif`;
        const textMetrics = ctx.measureText(catcherShoutText);
        const padX = 8 * scale;
        const bW = Math.max(58 * scale, textMetrics.width + padX * 2);
        const bH = 20 * scale;
        const left = bx - bW / 2;
        const top = by - bH / 2;

        const cBorder = "#121829";
        const cFill   = "#fcfbfa";
        const cShad   = "#d8d7e3";
        const cHi     = "#ffffff";

        ctx.fillStyle = cFill;
        ctx.fillRect(left + 2 * pS, top, bW - 4 * pS, bH);
        ctx.fillRect(left, top + 2 * pS, bW, bH - 4 * pS);
        ctx.fillRect(left + 1 * pS, top + 1 * pS, bW - 2 * pS, bH - 2 * pS);

        ctx.fillStyle = cHi;
        ctx.fillRect(left + 2 * pS, top + 1 * pS, bW - 4 * pS, 1 * pS);
        ctx.fillRect(left + 1 * pS, top + 2 * pS, 1 * pS, bH - 4 * pS);

        ctx.fillStyle = cShad;
        ctx.fillRect(left + 2 * pS, top + bH - 2 * pS, bW - 4 * pS, 1 * pS);
        ctx.fillRect(left + bW - 2 * pS, top + 2 * pS, 1 * pS, bH - 4 * pS);
        ctx.fillRect(left + bW - 3 * pS, top + bH - 3 * pS, 1 * pS, 1 * pS);

        ctx.fillStyle = cBorder;
        ctx.fillRect(left + 2 * pS, top - 1 * pS, bW - 4 * pS, 1 * pS);
        ctx.fillRect(left + 2 * pS, top + bH, bW - 4 * pS, 1 * pS);
        ctx.fillRect(left - 1 * pS, top + 2 * pS, 1 * pS, bH - 4 * pS);
        ctx.fillRect(left + bW, top + 2 * pS, 1 * pS, bH - 4 * pS);

        ctx.fillRect(left + 1 * pS, top, 1 * pS, 1 * pS);
        ctx.fillRect(left, top + 1 * pS, 1 * pS, 1 * pS);
        ctx.fillRect(left + bW - 2 * pS, top, 1 * pS, 1 * pS);
        ctx.fillRect(left + bW - 1 * pS, top + 1 * pS, 1 * pS, 1 * pS);
        ctx.fillRect(left + 1 * pS, top + bH - 1 * pS, 1 * pS, 1 * pS);
        ctx.fillRect(left, top + bH - 2 * pS, 1 * pS, 1 * pS);
        ctx.fillRect(left + bW - 2 * pS, top + bH - 1 * pS, 1 * pS, 1 * pS);
        ctx.fillRect(left + bW - 1 * pS, top + bH - 2 * pS, 1 * pS, 1 * pS);

        const tailY = by;
        ctx.fillStyle = cFill;
        ctx.fillRect(left - 1 * pS, tailY - 3 * pS, 2 * pS, 6 * pS);

        ctx.beginPath();
        ctx.moveTo(left, tailY - 3 * pS);
        ctx.lineTo(left, tailY + 3 * pS);
        ctx.lineTo(left - 6 * pS, tailY - 0.5 * pS);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = cShad;
        ctx.lineWidth = 1 * pS;
        ctx.beginPath();
        ctx.moveTo(left, tailY + 2 * pS);
        ctx.lineTo(left - 5 * pS, tailY);
        ctx.stroke();

        ctx.strokeStyle = cBorder;
        ctx.lineWidth = 1.2 * pS;
        ctx.beginPath();
        ctx.moveTo(left, tailY - 3.5 * pS);
        ctx.lineTo(left - 6.5 * pS, tailY - 0.5 * pS);
        ctx.lineTo(left, tailY + 3.5 * pS);
        ctx.stroke();

        const bubbleType = ballAnim?.type;
        ctx.fillStyle = (bubbleType === "line_drive") ? "#dc2626" : (bubbleType === "fly_ball" ? "#1d4ed8" : "#1f2937");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`📢 ${catcherShoutText}`, bx, by + 0.5 * pS);

        ctx.restore();
    }
    drawStadium = function() {
        const scale=canvas.width/400;
        ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,400,260);background();
        ctx.setTransform(scale*X,0,0,scale*Y,14.8*scale,offset*scale);
        drawPixelBatter(ctx,1);drawFielders(1);drawTacticalVisual(1);
        if(typeof catcherShoutText !== 'undefined' && catcherShoutText) drawCatcherShout(1);
        if(ballAnim.active)drawBallFlight(1);if(throwAnim.active)drawThrowBall(1);
        updateAndDrawParticles(ctx,1);drawRunners(1);
        ctx.setTransform(1,0,0,1,0,0);
        if(outcomeBanner?.active)drawOutcomeBanner(ctx,canvas.width,canvas.height,scale*.8);
    };
    resizeCanvas = function(){const width=Math.floor(canvas.parentElement.clientWidth);if(!width)return;canvas.width=800;canvas.height=520;canvas.style.width=width+'px';canvas.style.height=(width*.65)+'px';ctx.imageSmoothingEnabled=false;drawStadium();};
    window.addEventListener('resize',resizeCanvas);
    resizeCanvas();
})();

