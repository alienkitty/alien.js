// 2023-03-14 8:12pm
class EventEmitter{constructor(){this.callbacks={}}on(t,e){this.callbacks[t]||(this.callbacks[t]=[]),this.callbacks[t].push(e)}off(t,e){if(this.callbacks[t])if(e){const s=this.callbacks[t].indexOf(e);~s&&this.callbacks[t].splice(s,1)}else delete this.callbacks[t]}emit(t,e={}){if(!this.callbacks[t])return;const s=this.callbacks[t].slice();for(let t=0,i=s.length;t<i;t++)s[t].call(this,e)}destroy(){for(const t in this)this[t]=null;return null}}class Loader{constructor(t=[],e){this.assets=t,this.callback=e,this.events=new EventEmitter,this.total=0,this.loaded=0,this.progress=0,this.path="",this.crossOrigin,this.fetchOptions,this.cache=!1,this.files={},this.promise=new Promise((t=>this.resolve=t)),t.forEach((t=>this.load(t)))}load(){}loadAsync(t){return new Promise((e=>this.load(t,e)))}increment(){this.progress=++this.loaded/this.total,this.events.emit("progress",{progress:this.progress}),this.loaded===this.total&&this.complete()}complete(){this.resolve(),this.events.emit("complete"),this.callback&&this.callback()}add(t=1){this.total+=t}trigger(t=1){for(let e=0;e<t;e++)this.increment()}ready(){return this.total?this.promise:Promise.resolve()}getPath(t){return this.path+t}setPath(t){return this.path=t,this}setCrossOrigin(t){return this.crossOrigin=t,this}setFetchOptions(t){return this.fetchOptions=t,this}destroy(){this.events.destroy();for(const t in this)this[t]=null;return null}}const DEG2RAD=Math.PI/180;function degToRad(t){return t*DEG2RAD}function clamp(t,e,s){return Math.max(e,Math.min(s,t))}function shuffle(t){return t.sort((()=>Math.random()-.5))}function basename(t,e){const s=t.split("/").pop().split("?")[0];return e?s:s.split(".")[0]}class BufferLoader extends Loader{constructor(t,e){super(t,e),this.cache=!0}load(t,e){const s=this.files[t];let i;i=s?Promise.resolve(s):fetch(this.getPath(t),this.fetchOptions).then((t=>t.arrayBuffer())),i.then((s=>{this.cache&&(this.files[t]=s),this.increment(),e&&e(s)})).catch((t=>{this.increment(),e&&e(t)})),this.total++}}class MultiLoader extends Loader{constructor(){super(),this.loaders=[],this.weights=[]}load(t,e=1){t.events.on("progress",this.onProgress),t.events.on("complete",this.onComplete),this.loaders.push(t),this.weights.push(e),this.total+=e}onProgress=()=>{let t=this.loaded;for(let e=0,s=this.loaders.length;e<s;e++)t+=this.weights[e]*this.loaders[e].progress;const e=t/this.total;e<1&&this.events.emit("progress",{progress:e})};onComplete=()=>{this.increment()};destroy=()=>{for(let t=this.loaders.length-1;t>=0;t--)this.loaders[t]&&this.loaders[t].destroy&&this.loaders[t].destroy();return super.destroy()}}var RequestFrame,CancelFrame;if("undefined"!=typeof window)RequestFrame=window.requestAnimationFrame,CancelFrame=window.cancelAnimationFrame;else{const t=performance.now(),e=1e3/60;RequestFrame=s=>setTimeout((()=>{s(performance.now()-t)}),e),CancelFrame=clearTimeout}class Ticker{constructor(){this.callbacks=[],this.last=performance.now(),this.time=0,this.delta=0,this.frame=0,this.isAnimating=!1}onTick=t=>{this.isAnimating&&(this.requestId=RequestFrame(this.onTick)),this.delta=Math.min(150,t-this.last),this.last=t,this.time=.001*t,this.frame++;for(let e=this.callbacks.length-1;e>=0;e--){const s=this.callbacks[e];if(s)if(s.fps){const e=t-s.last;if(e<1e3/s.fps)continue;s.last=t,s.frame++,s(this.time,e,s.frame)}else s(this.time,this.delta,this.frame)}};add(t,e){e&&(t.fps=e,t.last=performance.now(),t.frame=0),this.callbacks.unshift(t)}remove(t){const e=this.callbacks.indexOf(t);~e&&this.callbacks.splice(e,1)}start(){this.isAnimating||(this.isAnimating=!0,this.requestId=RequestFrame(this.onTick))}stop(){this.isAnimating&&(this.isAnimating=!1,CancelFrame(this.requestId))}setRequestFrame(t){RequestFrame=t}setCancelFrame(t){CancelFrame=t}}const ticker=new Ticker,NEWTON_ITERATIONS=4,NEWTON_MIN_SLOPE=.001,SUBDIVISION_PRECISION=1e-7,SUBDIVISION_MAX_ITERATIONS=10,kSplineTableSize=11,kSampleStepSize=1/(kSplineTableSize-1);function A(t,e){return 1-3*e+3*t}function B(t,e){return 3*e-6*t}function C(t){return 3*t}function calcBezier(t,e,s){return((A(e,s)*t+B(e,s))*t+C(e))*t}function getSlope(t,e,s){return 3*A(e,s)*t*t+2*B(e,s)*t+C(e)}function binarySubdivide(t,e,s,i,n){let r,a,o=0;do{a=e+(s-e)/2,r=calcBezier(a,i,n)-t,r>0?s=a:e=a}while(Math.abs(r)>SUBDIVISION_PRECISION&&++o<SUBDIVISION_MAX_ITERATIONS);return a}function newtonRaphsonIterate(t,e,s,i){for(let n=0;n<NEWTON_ITERATIONS;n++){const n=getSlope(e,s,i);if(0===n)return e;e-=(calcBezier(e,s,i)-t)/n}return e}function LinearEasing(t){return t}function bezier(t,e,s,i){if(!(0<=t&&t<=1&&0<=s&&s<=1))throw new Error("Bezier x values must be in [0, 1] range");if(t===e&&s===i)return LinearEasing;const n=new Float32Array(kSplineTableSize);for(let e=0;e<kSplineTableSize;e++)n[e]=calcBezier(e*kSampleStepSize,t,s);return function(r){return 0===r||1===r?r:calcBezier(function(e){let i=0,r=1;const a=kSplineTableSize-1;for(;r!==a&&n[r]<=e;r++)i+=kSampleStepSize;r--;const o=i+(e-n[r])/(n[r+1]-n[r])*kSampleStepSize,h=getSlope(o,t,s);return h>=NEWTON_MIN_SLOPE?newtonRaphsonIterate(e,o,t,s):0===h?o:binarySubdivide(e,i,i+kSampleStepSize,t,s)}(r),e,i)}}class Easing{static linear(t){return t}static easeInQuad(t){return t*t}static easeOutQuad(t){return t*(2-t)}static easeInOutQuad(t){return(t*=2)<1?.5*t*t:-.5*(--t*(t-2)-1)}static easeInCubic(t){return t*t*t}static easeOutCubic(t){return--t*t*t+1}static easeInOutCubic(t){return(t*=2)<1?.5*t*t*t:.5*((t-=2)*t*t+2)}static easeInQuart(t){return t*t*t*t}static easeOutQuart(t){return 1- --t*t*t*t}static easeInOutQuart(t){return(t*=2)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2)}static easeInQuint(t){return t*t*t*t*t}static easeOutQuint(t){return--t*t*t*t*t+1}static easeInOutQuint(t){return(t*=2)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)}static easeInSine(t){return 1-Math.sin((1-t)*Math.PI/2)}static easeOutSine(t){return Math.sin(t*Math.PI/2)}static easeInOutSine(t){return.5*(1-Math.sin(Math.PI*(.5-t)))}static easeInExpo(t){return 0===t?0:Math.pow(1024,t-1)}static easeOutExpo(t){return 1===t?1:1-Math.pow(2,-10*t)}static easeInOutExpo(t){return 0===t||1===t?t:(t*=2)<1?.5*Math.pow(1024,t-1):.5*(2-Math.pow(2,-10*(t-1)))}static easeInCirc(t){return 1-Math.sqrt(1-t*t)}static easeOutCirc(t){return Math.sqrt(1- --t*t)}static easeInOutCirc(t){return(t*=2)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)}static easeInBack(t){const e=1.70158;return 1===t?1:t*t*((e+1)*t-e)}static easeOutBack(t){const e=1.70158;return 0===t?0:--t*t*((e+1)*t+e)+1}static easeInOutBack(t){const e=2.5949095;return(t*=2)<1?t*t*((e+1)*t-e)*.5:.5*((t-=2)*t*((e+1)*t+e)+2)}static easeInElastic(t,e=1,s=.3){if(0===t||1===t)return t;const i=2*Math.PI,n=s/i*Math.asin(1/e);return-e*Math.pow(2,10*--t)*Math.sin((t-n)*i/s)}static easeOutElastic(t,e=1,s=.3){if(0===t||1===t)return t;const i=2*Math.PI,n=s/i*Math.asin(1/e);return e*Math.pow(2,-10*t)*Math.sin((t-n)*i/s)+1}static easeInOutElastic(t,e=1,s=.3*1.5){if(0===t||1===t)return t;const i=2*Math.PI,n=s/i*Math.asin(1/e);return(t*=2)<1?e*Math.pow(2,10*--t)*Math.sin((t-n)*i/s)*-.5:e*Math.pow(2,-10*--t)*Math.sin((t-n)*i/s)*.5+1}static easeInBounce(t){return 1-this.easeOutBounce(1-t)}static easeOutBounce(t){const e=7.5625,s=2.75;return t<1/s?e*t*t:t<2/s?e*(t-=1.5/s)*t+.75:t<2.5/s?e*(t-=2.25/s)*t+.9375:e*(t-=2.625/s)*t+.984375}static easeInOutBounce(t){return t<.5?.5*this.easeInBounce(2*t):.5*this.easeOutBounce(2*t-1)+.5}static addBezier(t,e,s,i,n){this[t]=bezier(e,s,i,n)}}const Tweens=[];class Tween{constructor(t,e,s,i,n=0,r,a){"number"!=typeof n&&(a=r,r=n,n=0),this.object=t,this.duration=s,this.elapsed=0,this.ease="function"==typeof i?i:Easing[i]||Easing.easeOutCubic,this.delay=n,this.complete=r,this.update=a,this.isAnimating=!1,this.from={},this.to=Object.assign({},e),this.spring=this.to.spring,this.damping=this.to.damping,delete this.to.spring,delete this.to.damping;for(const e in this.to)"number"==typeof this.to[e]&&"number"==typeof t[e]&&(this.from[e]=t[e]);this.start()}onUpdate=(t,e)=>{this.elapsed+=e;const s=Math.max(0,Math.min(1,(this.elapsed-this.delay)/this.duration)),i=this.ease(s,this.spring,this.damping);for(const t in this.from)this.object[t]=this.from[t]+(this.to[t]-this.from[t])*i;this.update&&this.update(),1===s&&(clearTween(this),this.complete&&this.complete())};start(){this.isAnimating||(this.isAnimating=!0,ticker.add(this.onUpdate))}stop(){this.isAnimating&&(this.isAnimating=!1,ticker.remove(this.onUpdate))}}function delayedCall(t,e){const s=new Tween(e,null,t,"linear",0,e);return Tweens.push(s),s}function wait(t=0){return new Promise((e=>delayedCall(t,e)))}function tween(t,e,s,i,n=0,r,a){"number"!=typeof n&&(a=r,r=n,n=0);const o=new Promise((r=>{const o=new Tween(t,e,s,i,n,r,a);Tweens.push(o)}));return r&&o.then(r),o}function clearTween(t){if(t instanceof Tween){t.stop();const e=Tweens.indexOf(t);~e&&Tweens.splice(e,1)}else for(let e=Tweens.length-1;e>=0;e--)Tweens[e].object===t&&clearTween(Tweens[e])}const Transforms=["x","y","z","skewX","skewY","rotation","rotationX","rotationY","rotationZ","scale","scaleX","scaleY","scaleZ"],Filters=["blur","brightness","contrast","grayscale","hue","invert","saturate","sepia"],Numeric=["opacity","zIndex","fontWeight","strokeWidth","strokeDashoffset","stopOpacity"],Lacuna1=["opacity","brightness","contrast","saturate","scale","stopOpacity"];class Interface{constructor(t,e="div",s){this.events=new EventEmitter,this.children=[],this.timeouts=[],this.style={},this.isTransform=!1,this.isFilter=!1,"object"==typeof t&&null!==t?this.element=t:null!==e&&(this.name=t,this.type=e,this.element="svg"===e?document.createElementNS("http://www.w3.org/2000/svg",s||"svg"):document.createElement(e),"string"==typeof t&&(t.startsWith(".")?this.element.className=t.slice(1):this.element.id=t))}add(t){if(this.children)return this.children.push(t),t.parent=this,t.element?this.element.appendChild(t.element):t.nodeName&&this.element.appendChild(t),t}remove(t){if(!this.children)return;t.element?t.element.parentNode.removeChild(t.element):t.nodeName&&t.parentNode.removeChild(t);const e=this.children.indexOf(t);~e&&this.children.splice(e,1)}clone(){if(this.element)return new Interface(this.element.cloneNode(!0))}empty(){if(this.element){for(let t=this.children.length-1;t>=0;t--)this.children[t]&&this.children[t].destroy&&this.children[t].destroy();return this.children.length=0,this.element.innerHTML="",this}}attr(t){if(this.element){for(const e in t)this.element.setAttribute(e,t[e]);return this}}css(t){if(!this.element)return;const e=this.style;for(const s in t){if(~Transforms.indexOf(s)){e[s]=t[s],this.isTransform=!0;continue}if(~Filters.indexOf(s)){e[s]=t[s],this.isFilter=!0;continue}let i;~Numeric.indexOf(s)?(i=t[s],e[s]=i):i="string"!=typeof t[s]?t[s]+"px":t[s],this.element.style[s]=i}if(this.isTransform){let t="";if(void 0!==e.x||void 0!==e.y||void 0!==e.z){t+=`translate3d(${void 0!==e.x?e.x:0}px, ${void 0!==e.y?e.y:0}px, ${void 0!==e.z?e.z:0}px)`}void 0!==e.skewX&&(t+=`skewX(${e.skewX}deg)`),void 0!==e.skewY&&(t+=`skewY(${e.skewY}deg)`),void 0!==e.rotation&&(t+=`rotate(${e.rotation}deg)`),void 0!==e.rotationX&&(t+=`rotateX(${e.rotationX}deg)`),void 0!==e.rotationY&&(t+=`rotateY(${e.rotationY}deg)`),void 0!==e.rotationZ&&(t+=`rotateZ(${e.rotationZ}deg)`),void 0!==e.scale&&(t+=`scale(${e.scale})`),void 0!==e.scaleX&&(t+=`scaleX(${e.scaleX})`),void 0!==e.scaleY&&(t+=`scaleY(${e.scaleY})`),void 0!==e.scaleZ&&(t+=`scaleZ(${e.scaleZ})`),this.element.style.transform=t}if(this.isFilter){let t="";void 0!==e.blur&&(t+=`blur(${e.blur}px)`),void 0!==e.brightness&&(t+=`brightness(${e.brightness})`),void 0!==e.contrast&&(t+=`contrast(${e.contrast})`),void 0!==e.grayscale&&(t+=`grayscale(${e.grayscale})`),void 0!==e.hue&&(t+=`hue-rotate(${e.hue}deg)`),void 0!==e.invert&&(t+=`invert(${e.invert})`),void 0!==e.saturate&&(t+=`saturate(${e.saturate})`),void 0!==e.sepia&&(t+=`sepia(${e.sepia})`),this.element.style.filter=t}return this}tween(t,e,s,i=0,n,r){if(!this.element)return;"number"!=typeof i&&(r=n,n=i,i=0);const a=getComputedStyle(this.element);for(const e in t){let t;void 0!==this.style[e]?t=this.style[e]:~Transforms.indexOf(e)||~Filters.indexOf(e)||~Numeric.indexOf(e)?t=~Lacuna1.indexOf(e)?1:0:"string"==typeof a[e]&&(t=parseFloat(a[e])),isNaN(t)||(this.style[e]=t)}return tween(this.style,t,e,s,i,n,(()=>{this.css(this.style),r&&r()}))}clearTween(){return clearTween(this.style),this}delayedCall(t,e){if(!this.timeouts)return;const s=delayedCall(t,(()=>{this.clearTimeout(s,!0),e&&e()}));return this.timeouts.push(s),s}clearTimeout(t,e){if(!this.timeouts)return;e||clearTween(t);const s=this.timeouts.indexOf(t);~s&&this.timeouts.splice(s,1)}clearTimeouts(){if(this.timeouts)for(let t=this.timeouts.length-1;t>=0;t--)this.clearTimeout(this.timeouts[t])}text(t){if(this.element)return void 0===t?this.element.textContent:(this.element.textContent=t,this)}html(t){if(this.element)return void 0===t?this.element.innerHTML:(this.element.innerHTML=t,this)}hide(){return this.css({display:"none"})}show(){return this.css({display:""})}invisible(){return this.css({visibility:"hidden"})}visible(){return this.css({visibility:""})}line(t=this.progress||0){const e=this.start||0,s=this.offset||0,i=this.element.getTotalLength(),n=i*t,r={strokeDasharray:`${n},${i-n}`,strokeDashoffset:-i*(e+s)};return this.css(r)}destroy(){if(this.children){this.parent&&this.parent.remove&&this.parent.remove(this),this.clearTimeouts(),this.clearTween(),this.events.destroy();for(let t=this.children.length-1;t>=0;t--)this.children[t]&&this.children[t].destroy&&this.children[t].destroy();for(const t in this)this[t]=null;return null}}}var Stage;if("undefined"!=typeof window){function addListeners(){window.addEventListener("popstate",onPopState),ticker.start()}function onPopState(t){Stage.path=location.pathname,Stage.events.emit("state_change",t)}(Stage=new Interface(null,null)).init=(t=document.body)=>{Stage.element=t,Stage.root=document.querySelector(":root"),Stage.rootStyle=getComputedStyle(Stage.root),addListeners(),onPopState()},Stage.setPath=t=>{t!==location.pathname&&(history.pushState(null,null,t),onPopState())},Stage.setTitle=t=>{document.title=t}}class Global{static NUM_POINTERS=22;static USERS=[];static SOUND=!0;static DETAILS_OPEN=!1;static NICKNAME=""}class Socket extends EventEmitter{constructor(){super(),this.views=[],this.views[2]=new DataView(new ArrayBuffer(12)),this.views[3]=new DataView(new ArrayBuffer(11)),this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.connected=!1}init(){this.server="wss://multiuser-fluid.glitch.me",this.connect()}addListeners(){this.socket.addEventListener("close",this.onClose),this.socket.addEventListener("message",this.onMessage),this.on("users",this.onUsers),this.on("heartbeat",this.onHeartbeat)}ip2long(t){let e=0;return t.split(".").forEach((t=>{e<<=8,e+=parseInt(t,10)})),e>>>0}long2ip(t){return(t>>>24)+"."+(t>>16&255)+"."+(t>>8&255)+"."+(255&t)}onClose=()=>{this.connected=!1};onMessage=({data:t})=>{switch((t=new DataView(t)).getUint8(0)){case 0:{const e=[],s=17;let i=1;for(let n=0,r=(t.byteLength-1)/s;n<r;n++){const n=t.getUint8(i).toString(),r=this.decoder.decode(t.buffer.slice(i+1,i+11)).replace(/\0/g,""),a=this.long2ip(t.getUint32(i+11)),o=t.getUint16(i+15);e.push({id:n,nickname:r,remoteAddress:a,latency:o}),i+=s}this.emit("users",e);break}case 1:this.emit("heartbeat",t);break;case 3:{const e=t.getUint8(1).toString(),s=!!t.getUint8(2),i=t.getFloat32(3),n=t.getFloat32(7);this.emit("motion",{id:e,isDown:s,x:i,y:n});break}}};onUsers=t=>{Global.USERS=t,Stage.events.emit("update",t)};onHeartbeat=t=>{this.connected||(this.connected=!0,this.id=t.getUint8(1).toString(),this.nickname(Global.NICKNAME)),this.send(t)};nickname=t=>{const e=this.views[2];e.setUint8(0,2);const s=this.encoder.encode(t);for(let t=0;t<10;t++)e.setUint8(2+t,s[t]);this.send(e)};motion=({isDown:t,x:e,y:s})=>{const i=this.views[3];i.setUint8(0,3),i.setUint8(2,t?1:0),i.setFloat32(3,e),i.setFloat32(7,s),this.send(i)};send=t=>{this.connected&&this.socket.send(t.buffer)};connect=()=>{this.socket&&this.close(),this.socket=new WebSocket(this.server,["permessage-deflate"]),this.socket.binaryType="arraybuffer",this.addListeners()};close=()=>{this.socket.close()}}class Data{static init(){this.Socket=new Socket}static getUser=t=>Global.USERS.find((e=>e.id===t))}class ProgressCanvas extends Interface{constructor(){super(null,"canvas");this.width=32,this.height=32,this.x=16,this.y=16,this.radius=12.8,this.startAngle=degToRad(-90),this.progress=0,this.needsUpdate=!1,this.initCanvas()}initCanvas(){this.context=this.element.getContext("2d")}addListeners(){ticker.add(this.onUpdate)}removeListeners(){ticker.remove(this.onUpdate)}onUpdate=()=>{this.needsUpdate&&this.update()};onProgress=({progress:t})=>{clearTween(this),this.needsUpdate=!0,tween(this,{progress:t},500,"easeOutCubic",(()=>{this.needsUpdate=!1,this.progress>=1&&this.onComplete()}))};onComplete=()=>{this.removeListeners(),this.events.emit("complete")};resize=()=>{this.element.width=Math.round(2*this.width),this.element.height=Math.round(2*this.height),this.element.style.width=this.width+"px",this.element.style.height=this.height+"px",this.context.scale(2,2),this.context.lineWidth=1.5,this.context.strokeStyle=Stage.rootStyle.getPropertyValue("--ui-color").trim(),this.update()};update=()=>{this.context.clearRect(0,0,this.element.width,this.element.height),this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,this.startAngle,this.startAngle+degToRad(360*this.progress)),this.context.stroke()};animateIn=()=>{this.addListeners(),this.resize()};animateOut=()=>{this.tween({scale:1.1,opacity:0},400,"easeInCubic")};destroy=()=>(this.removeListeners(),clearTween(this),super.destroy())}class PreloaderView extends Interface{constructor(){super(".preloader"),this.initHTML(),this.initView(),this.addListeners()}initHTML(){this.css({position:"absolute",left:0,top:0,width:"100%",height:"100%",backgroundColor:"var(--bg-color)",zIndex:100,pointerEvents:"none"})}initView(){this.view=new ProgressCanvas,this.view.css({position:"absolute",left:"50%",top:"50%",marginLeft:-this.view.width/2,marginTop:-this.view.height/2}),this.add(this.view)}addListeners(){this.view.events.on("complete",this.onComplete)}removeListeners(){this.view.events.off("complete",this.onComplete)}onProgress=t=>{this.view.onProgress(t)};onComplete=()=>{this.events.emit("complete")};animateIn=()=>{this.view.animateIn()};animateOut=()=>(this.view.animateOut(),this.tween({opacity:0},250,"easeOutSine",500));destroy=()=>(this.removeListeners(),super.destroy())}class Preloader{static init(){Data.init(),Data.Socket.init(),this.initStage(),this.initView(),this.initLoader(),this.addListeners()}static initStage(){Stage.init()}static initView(){this.view=new PreloaderView,Stage.add(this.view)}static async initLoader(){this.view.animateIn();const t=new BufferLoader(["assets/sounds/bass_drum.mp3","assets/sounds/deep_spacy_loop.mp3","assets/sounds/water_loop.mp3"]);this.loader=new MultiLoader,this.loader.load(t),this.loader.add(2);const{App:e}=await import("./app.js");this.loader.trigger(1),this.app=e,await this.app.init(t),this.loader.trigger(1)}static addListeners(){this.loader.events.on("progress",this.view.onProgress),this.view.events.on("complete",this.onComplete)}static removeListeners(){this.loader.events.off("progress",this.view.onProgress),this.view.events.off("complete",this.onComplete)}static onComplete=async()=>{this.removeListeners(),this.loader=this.loader.destroy(),await this.view.animateOut(),this.view=this.view.destroy(),this.app.start()}}export{Data,Global,Interface,Preloader,Stage,basename,clamp,clearTween,shuffle,ticker,tween,wait};
