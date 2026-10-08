/* Approved SFC character atlas and sunny stadium presentation. */
(() => {
    const X = .926, Y = .605, offset = 4; // field projection; sprites cancel this nonuniform scale
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

    // Approved atlas: same source-to-world scale for ALL poses and both teams.
    // Undo only the field's perspective transform; character pixels remain square.
    const characterImage = new Image();
    characterImage.src = 'assets/characters-approved.png';
    characterImage.onload = () => drawStadium();
    const poses = [
        [38,35,373,454], [519,42,434,455], [1027,104,473,373],
        [30,525,413,455], [516,566,474,416], [1071,532,447,455]
    ];
    drawPixelPlayer = function(c,cx,cy,opts={}) {
        if (!characterImage.complete || !characterImage.naturalWidth) return;
        const moving=opts.state==='run' || opts.state==='moving';
        let index=opts.isFielder ? 3 : 0;
        if (opts.isFielder && moving) index=4;
        if (opts.isFielder && opts.state==='throw') index=5;
        if (!opts.isFielder && moving) index=1;
        if (!opts.isFielder && opts.state==='slide') index=2;
        const [sx,sy,sw,sh]=poses[index];
        const unit=28/455;
        const w=sw*unit,h=sh*unit;
        const phase=Date.now()/1000+cx*.071+cy*.043;
        const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const bob=reduceMotion?0:moving ? Math.round(Math.sin(phase*14)) : Math.round(Math.sin(phase*2)*.6);
        c.save();c.translate(cx,cy);c.scale(1/X,1/Y);c.imageSmoothingEnabled=false;
        c.fillStyle='rgba(20,65,44,.24)';c.beginPath();c.ellipse(0,2,w*.38,2.5,0,0,Math.PI*2);c.fill();
        if (opts.facingLeft) c.scale(-1,1);
        c.drawImage(characterImage,sx,sy,sw,sh,-w/2,-h+2+bob,w,h);
        if(opts.state==='out'){c.fillStyle='#dc4545';c.fillRect(-5,-h-3,10,2);}
        c.restore();
    };
    drawPixelBatter = function(c,scale) {
        drawPixelPlayer(c,181*scale,(bases.home.y-8)*scale,{state:'idle'});
        c.save();c.translate(181*scale,(bases.home.y-8)*scale);c.scale(1/X,1/Y);
        c.fillStyle='#b76e39';c.fillRect(-15,-31,2,18);c.fillStyle='#efc68c';c.fillRect(-15,-31,2,9);c.restore();
    };
    drawFielders = function(scale) {
        const q=generatedQuestions[currentQuestionIdx];
        for(const [key,p] of Object.entries(Object.keys(fieldersState).length?fieldersState:fielders)) {
            const moving=p.isMoving || p.state==='run';
            const throwing=throwAnim.active && key===q?.fielderKey;
            drawPixelPlayer(ctx,p.x*scale,p.y*scale,{
                isFielder:true,state:throwing?'throw':moving?'run':p.state||'idle'
            });
        }
    };
    drawRunners = function(scale) {
        for (const runner of fieldRunners) {
            const moving=runner.animProgress>0 && runner.animProgress<1;
            const state=runner.taggedOut?'out':moving?(runner.animProgress>.85?'slide':'run'):'idle';
            const x=(runner.x ?? runner.startX)*scale;
            const y=(runner.y ?? runner.startY)*scale;
            drawPixelPlayer(ctx,x,y,{state,isPlayer:runner.isPlayer,facingLeft:moving&&runner.targetX<runner.startX});
            ctx.save();ctx.translate(x,y);ctx.scale(1/X,1/Y);
            if (runner.isPlayer) {
                ctx.fillStyle='#f4c442';ctx.strokeStyle='#8a6920';ctx.lineWidth=.7;
                ctx.beginPath();ctx.moveTo(-4,-33);ctx.lineTo(4,-33);ctx.lineTo(0,-29);ctx.closePath();ctx.fill();ctx.stroke();
                ctx.strokeStyle='#f6cf56';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,2,10,3,0,0,Math.PI*2);ctx.stroke();
            }
            const label=runner.taggedOut?(runner.outLabel||'OUT'):runner.statusLabel;
            if(label){
                ctx.font='700 7px "Noto Sans TC",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
                const width=ctx.measureText(label).width+8;
                ctx.fillStyle=runner.taggedOut?'#ffe6e0':'#ffffffe8';ctx.fillRect(-width/2,-45,width,10);
                ctx.fillStyle=runner.taggedOut?'#ad3933':'#2b6445';ctx.fillText(label,0,-40);
            }
            ctx.restore();
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

