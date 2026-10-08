/* 2026-10-08 art preview. Camera projects positions; sprites use square pixels. */
(() => {
    const X = .926, Y = .605, offset = 4;
    // World geometry follows the art's base footprints; strategy rules are unchanged.
    bases.second.y = 144;
    const artPositions={CF:105,LF:132,RF:132,SS:166,'2B':166};
    for(const [key,y] of Object.entries(artPositions))if(fielders[key])fielders[key].y=y;
    const stadiumImage = new Image();
    stadiumImage.src = 'assets/stadium-day.png';
    stadiumImage.onload = () => drawStadium();
    const playerAtlas = new Image();
    let spriteBounds=[];
    playerAtlas.src='assets/players-atlas.png';
    playerAtlas.onload=()=>{
        const sheet=document.createElement('canvas');sheet.width=playerAtlas.naturalWidth;sheet.height=playerAtlas.naturalHeight;
        const pixels=sheet.getContext('2d');pixels.drawImage(playerAtlas,0,0);
        const data=pixels.getImageData(0,0,sheet.width,sheet.height).data;
        for(let cell=0;cell<2;cell++){
            const start=Math.floor(cell*sheet.width/2),end=Math.floor((cell+1)*sheet.width/2);
            let x0=end,y0=sheet.height,x1=start,y1=0;
            for(let y=0;y<sheet.height;y++)for(let x=start;x<end;x++)if(data[(y*sheet.width+x)*4+3]>160){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
            spriteBounds.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1});
        }
        drawStadium();
    };
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
        // Four stepped terraces follow the perimeter, rather than crossing the grass.
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
        // Unbranded park: no advertising boards or slogans.
        // Basepaths are projected independently from the player artwork.
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
        // Deterministic dirt grain; no animated visual noise.
        for(let n=0;n<240;n++){const x=(n*73)%400,y=75+(n*37)%150;const dx=Math.abs(x-200),dy=Math.abs(y-150);if(dx/130+dy/78<1&&dx/75+dy/48>1)pixel(x,y,1,1,'#c85e35');}
    }
    drawPixelPlayer = function(c,cx,cy,opts={}) {
        const scale=.8; // One shared sprite size for fielders, runners and batter.
        c.save();c.translate(cx,cy);c.scale(scale/X,scale/Y);
        const blue=!opts.isFielder, cap=blue?'#176fbe':'#3e862c',light=blue?'#54baf0':'#b2d44c';
        const p=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
        c.fillStyle='#12331c66';c.beginPath();c.ellipse(0,8,9,3,0,0,Math.PI*2);c.fill();
        const running=opts.state==='run';
        const resting=!running && !['slide','out','safe'].includes(opts.state);
        const phase=Date.now()/1000+cx*.071+cy*.043;
        // Different phases keep the team from moving in lockstep.
        const idleBob=resting?Math.round(Math.sin(phase*2)*.65):0;
        const idleLean=resting?Math.round(Math.sin(phase*1.3)*.65):0;
        c.translate(idleLean,idleBob);
        const stride=running?Math.sin((opts.frame||0)*2.1)*3:(resting?Math.round(Math.sin(phase*1.6)*.7):0);
        if(spriteBounds.length===2){
            const b=spriteBounds[opts.isFielder?1:0],height=36,width=height*b.w/b.h;
            if(running){c.translate(0,-Math.abs(stride)*.6);c.rotate(stride*.022);}
            if(opts.state==='slide')c.rotate(-.9);
            c.imageSmoothingEnabled=false;
            if(running){
                // Articulated strides: torso and legs retain their original pixel ratio.
                const split=Math.floor(b.h*.64),upper=height*split/b.h,lower=height-upper;
                c.drawImage(playerAtlas,b.x,b.y,b.w,split,-width/2,11-height,width,upper);
                const half=Math.floor(b.w/2),leftWidth=width*half/b.w,rightWidth=width-leftWidth;
                const step=stride*.55;
                c.drawImage(playerAtlas,b.x,b.y+split,half,b.h-split,-width/2-step*.25,11-lower+step,leftWidth,lower);
                c.drawImage(playerAtlas,b.x+half,b.y+split,b.w-half,b.h-split,-width/2+leftWidth+step*.25,11-lower-step,rightWidth,lower);
            }else{
                c.drawImage(playerAtlas,b.x,b.y,b.w,b.h,-width/2,11-height,width,height);
            }
            c.restore();return;
        }
        // Outlined 24px sprite: helmet, face, uniform, glove and articulated legs.
        p(-7,-18,13,3,'#102438');p(-9,-15,17,9,'#102438');p(-8,-15,15,6,cap);p(-5,-16,8,2,light);p(-8,-9,18,3,cap);
        p(-5,-7,11,8,'#182433');p(-4,-7,9,6,'#efbd88');p(3,-6,3,3,'#ffd5a0');p(3,-5,1,2,'#172c34');p(-5,-3,3,2,'#b77c50');
        p(-6,0,12,8,'#122c3a');p(-5,0,10,6,light);p(-3,1,5,2,blue?'#e4f3ee':'#eff5b7');p(-5,6,10,2,'#183249');
        p(-6,8,5,4+Math.round(stride),'#f7eee0');p(1,8,5,4-Math.round(stride),'#d2e1da');
        p(-7,11+Math.round(stride),6,3,'#183049');p(1,11-Math.round(stride),7,3,'#183049');
        p(-9,1,4,6,cap);p(-10,5,4,3,'#edbd8f');p(5,0,4,5,light);
        if(opts.isFielder){p(7,2,6,6,'#573921');p(8,2,4,4,'#ae763a');p(9,3,1,3,'#e6ac5a');}else{p(6,4,4,3,'#efbd88');}
        c.restore();
    };
    drawFielders = function(scale) {
        const q=generatedQuestions[currentQuestionIdx];
        for(const [key,p] of Object.entries(Object.keys(fieldersState).length?fieldersState:fielders))drawPixelPlayer(ctx,p.x*scale,p.y*scale,{scale:scale*.72,isFielder:true,isHandling:key===q?.fielderKey,state:p.state||'idle',frame:Math.floor(Date.now()/130)%3});
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

