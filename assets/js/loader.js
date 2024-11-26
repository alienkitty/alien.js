// 2024-11-25 9:15pm
class EventEmitter{constructor(){this.callbacks={}}on(e,t){this.callbacks[e]||(this.callbacks[e]=[]),this.callbacks[e].push(t)}off(e,t){if(this.callbacks[e])if(t){const s=this.callbacks[e].indexOf(t);~s&&this.callbacks[e].splice(s,1)}else delete this.callbacks[e]}emit(e,...t){if(!this.callbacks[e])return;const s=this.callbacks[e].slice();for(let e=0,i=s.length;e<i;e++)s[e].call(this,...t)}destroy(){for(const e in this)this[e]=null;return null}}class Loader{constructor(){this.events=new EventEmitter,this.total=0,this.loaded=0,this.progress=0,this.path="",this.crossOrigin="anonymous",this.fetchOptions,this.cache=!1,this.files={},this.promise=new Promise((e=>this.resolve=e))}load(){}loadAsync(e){return new Promise((t=>this.load(e,t)))}loadAll(e){return e.map((e=>this.load(e)))}loadAllAsync(e){return Promise.all(e.map((e=>this.loadAsync(e))))}increment(){this.progress=++this.loaded/this.total,this.events.emit("progress",{progress:this.progress}),this.loaded===this.total&&this.complete()}complete(){this.resolve(),this.events.emit("complete")}add(e=1){this.total+=e}trigger(e=1){for(let t=0;t<e;t++)this.increment()}ready(){return this.total?this.promise:Promise.resolve()}filter(e){return Object.keys(this.files).filter(e).reduce(((e,t)=>(e[t]=this.files[t],e)),{})}getPath(e){return this.path+e}setPath(e){return this.path=e,this}setCrossOrigin(e){return this.crossOrigin=e,this}setFetchOptions(e){return this.fetchOptions=e,this}destroy(){this.events.destroy();for(const e in this)this[e]=null;return null}}const PI=Math.PI,TwoPI=2*Math.PI,PI90=Math.PI/2,PI60=Math.PI/3,Third=2*Math.PI/3;function degToRad(e){return e*Math.PI/180}function radToDeg(e){return 180*e/Math.PI}function clamp(e,t,s){return Math.max(t,Math.min(s,e))}function euclideanModulo(e,t){return(e%t+t)%t}function lerp(e,t,s){return(1-s)*e+s*t}function shuffle(e){return e.sort((()=>Math.random()-.5))}function randInt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function guid(){return(Date.now()+randInt(0,99999)).toString()}function brightness(e){return.3*e.r+.59*e.g+.11*e.b}function basename(e,t){const s=e.split("/").pop().split("?")[0];return t?s:s.split(".")[0]}class BufferLoader extends Loader{constructor(){super(),this.cache=!0}load(e,t){const s=this.files[e];let i;i=s?Promise.resolve(s):fetch(this.getPath(e),this.fetchOptions).then((e=>e.arrayBuffer())),i.then((s=>{this.cache&&(this.files[e]=s),this.increment(),t&&t(s)})).catch((e=>{this.increment(),t&&t(e)})),this.total++}}class MultiLoader extends Loader{constructor(){super(),this.loaders=[],this.weights=[]}load(e,t=1){e.events.on("progress",this.onProgress),e.events.on("complete",this.onComplete),this.loaders.push(e),this.weights.push(t),this.total+=t}onProgress=()=>{let e=this.loaded;for(let t=0,s=this.loaders.length;t<s;t++)e+=this.weights[t]*this.loaders[t].progress;const t=e/this.total;t<1&&this.events.emit("progress",{progress:t})};onComplete=()=>{this.increment()};destroy(){for(let e=this.loaders.length-1;e>=0;e--)this.loaders[e]&&this.loaders[e].destroy&&this.loaders[e].destroy();return super.destroy()}}var RequestFrame,CancelFrame;if("undefined"!=typeof window)RequestFrame=window.requestAnimationFrame,CancelFrame=window.cancelAnimationFrame;else{const e=performance.now(),t=1e3/60;RequestFrame=s=>setTimeout((()=>{s(performance.now()-e)}),t),CancelFrame=clearTimeout}class Ticker{constructor(){this.callbacks=[],this.last=performance.now(),this.time=0,this.delta=0,this.frame=0,this.isAnimating=!1}onTick=e=>{this.isAnimating&&(this.requestId=RequestFrame(this.onTick)),this.delta=e-this.last,this.last=e,this.time=.001*e,this.frame++;for(let t=this.callbacks.length-1;t>=0;t--){const s=this.callbacks[t];if(s)if(s.fps){const t=e-s.last;if(t<1e3/s.fps)continue;s.last=e,s.frame++,s(this.time,t,s.frame)}else s(this.time,this.delta,this.frame)}};add(e,t){t&&(e.fps=t,e.last=performance.now(),e.frame=0),this.callbacks.unshift(e)}remove(e){const t=this.callbacks.indexOf(e);~t&&this.callbacks.splice(t,1)}start(){this.isAnimating||(this.isAnimating=!0,this.requestId=RequestFrame(this.onTick))}stop(){this.isAnimating&&(this.isAnimating=!1,CancelFrame(this.requestId))}setRequestFrame(e){RequestFrame=e}setCancelFrame(e){CancelFrame=e}}const ticker=new Ticker,NEWTON_ITERATIONS=4,NEWTON_MIN_SLOPE=.001,SUBDIVISION_PRECISION=1e-7,SUBDIVISION_MAX_ITERATIONS=10,kSplineTableSize=11,kSampleStepSize=.1;function A(e,t){return 1-3*t+3*e}function B(e,t){return 3*t-6*e}function C(e){return 3*e}function calcBezier(e,t,s){return((A(t,s)*e+B(t,s))*e+C(t))*e}function getSlope(e,t,s){return 3*A(t,s)*e*e+2*B(t,s)*e+C(t)}function binarySubdivide(e,t,s,i,n){let r,a,o=0;do{a=t+(s-t)/2,r=calcBezier(a,i,n)-e,r>0?s=a:t=a}while(Math.abs(r)>1e-7&&++o<10);return a}function newtonRaphsonIterate(e,t,s,i){for(let n=0;n<4;n++){const n=getSlope(t,s,i);if(0===n)return t;t-=(calcBezier(t,s,i)-e)/n}return t}function LinearEasing(e){return e}function bezier(e,t,s,i){if(!(0<=e&&e<=1&&0<=s&&s<=1))throw new Error("Bezier x values must be in [0, 1] range");if(e===t&&s===i)return LinearEasing;const n=new Float32Array(11);for(let t=0;t<11;t++)n[t]=calcBezier(.1*t,e,s);return function(r){return 0===r||1===r?r:calcBezier(function(t){let i=0,r=1;for(;10!==r&&n[r]<=t;r++)i+=.1;r--;const a=i+(t-n[r])/(n[r+1]-n[r])*.1,o=getSlope(a,e,s);return o>=.001?newtonRaphsonIterate(t,a,e,s):0===o?a:binarySubdivide(t,i,i+.1,e,s)}(r),t,i)}}class Easing{static linear(e){return e}static easeInQuad(e){return e*e}static easeOutQuad(e){return e*(2-e)}static easeInOutQuad(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)}static easeInCubic(e){return e*e*e}static easeOutCubic(e){return--e*e*e+1}static easeInOutCubic(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)}static easeInQuart(e){return e*e*e*e}static easeOutQuart(e){return 1- --e*e*e*e}static easeInOutQuart(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)}static easeInQuint(e){return e*e*e*e*e}static easeOutQuint(e){return--e*e*e*e*e+1}static easeInOutQuint(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)}static easeInSine(e){return 1-Math.sin((1-e)*Math.PI/2)}static easeOutSine(e){return Math.sin(e*Math.PI/2)}static easeInOutSine(e){return.5*(1-Math.sin(Math.PI*(.5-e)))}static easeInExpo(e){return 0===e?0:Math.pow(1024,e-1)}static easeOutExpo(e){return 1===e?1:1-Math.pow(2,-10*e)}static easeInOutExpo(e){return 0===e||1===e?e:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(2-Math.pow(2,-10*(e-1)))}static easeInCirc(e){return 1-Math.sqrt(1-e*e)}static easeOutCirc(e){return Math.sqrt(1- --e*e)}static easeInOutCirc(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)}static easeInBack(e){const t=1.70158;return 1===e?1:e*e*((t+1)*e-t)}static easeOutBack(e){const t=1.70158;return 0===e?0:--e*e*((t+1)*e+t)+1}static easeInOutBack(e){const t=2.5949095;return(e*=2)<1?e*e*((t+1)*e-t)*.5:.5*((e-=2)*e*((t+1)*e+t)+2)}static easeInElastic(e,t=1,s=.3){if(0===e||1===e)return e;const i=2*Math.PI,n=s/i*Math.asin(1/t);return-t*Math.pow(2,10*--e)*Math.sin((e-n)*i/s)}static easeOutElastic(e,t=1,s=.3){if(0===e||1===e)return e;const i=2*Math.PI,n=s/i*Math.asin(1/t);return t*Math.pow(2,-10*e)*Math.sin((e-n)*i/s)+1}static easeInOutElastic(e,t=1,s=.3*1.5){if(0===e||1===e)return e;const i=2*Math.PI,n=s/i*Math.asin(1/t);return(e*=2)<1?t*Math.pow(2,10*--e)*Math.sin((e-n)*i/s)*-.5:t*Math.pow(2,-10*--e)*Math.sin((e-n)*i/s)*.5+1}static easeInBounce(e){return 1-this.easeOutBounce(1-e)}static easeOutBounce(e){const t=7.5625,s=2.75;return e<1/s?t*e*e:e<2/s?t*(e-=1.5/s)*e+.75:e<2.5/s?t*(e-=2.25/s)*e+.9375:t*(e-=2.625/s)*e+.984375}static easeInOutBounce(e){return e<.5?.5*this.easeInBounce(2*e):.5*this.easeOutBounce(2*e-1)+.5}static addBezier(e,t,s,i,n){this[e]=bezier(t,s,i,n)}}const Tweens=[];class Tween{constructor(e,t,s,i,n=0,r,a){"number"!=typeof n&&(a=r,r=n,n=0),this.object=e,this.duration=s,this.elapsed=0,this.ease="function"==typeof i?i:Easing[i]||Easing.easeOutCubic,this.delay=n,this.complete=r,this.update=a,this.isAnimating=!1,this.from={},this.to=Object.assign({},t),this.spring=this.to.spring,this.damping=this.to.damping,delete this.to.spring,delete this.to.damping;for(const t in this.to)"number"==typeof this.to[t]&&"number"==typeof e[t]&&(this.from[t]=e[t]);this.start()}onUpdate=(e,t)=>{this.elapsed+=t;const s=Math.max(0,Math.min(1,(this.elapsed-this.delay)/this.duration)),i=this.ease(s,this.spring,this.damping);for(const e in this.from)this.object[e]=this.from[e]+(this.to[e]-this.from[e])*i;this.update&&this.update(),1===s&&(clearTween(this),this.complete&&this.complete())};start(){this.isAnimating||(this.isAnimating=!0,ticker.add(this.onUpdate))}stop(){this.isAnimating&&(this.isAnimating=!1,ticker.remove(this.onUpdate))}}function delayedCall(e,t){const s=new Tween(t,null,e,"linear",0,t);return Tweens.push(s),s}function wait(e=0){return new Promise((t=>delayedCall(e,t)))}function defer(e){return new Promise((e=>delayedCall(0,e)))}function tween(e,t,s,i,n=0,r,a){"number"!=typeof n&&(a=r,r=n,n=0);const o=new Promise((r=>{const o=new Tween(e,t,s,i,n,r,a);Tweens.push(o)}));return r&&o.then(r),o}function clearTween(e){if(e instanceof Tween){e.stop();const t=Tweens.indexOf(e);~t&&Tweens.splice(t,1)}else for(let t=Tweens.length-1;t>=0;t--)Tweens[t].object===e&&clearTween(Tweens[t])}const Transforms=["x","y","z","skewX","skewY","rotation","rotationX","rotationY","rotationZ","scale","scaleX","scaleY","scaleZ"],Filters=["blur","brightness","contrast","grayscale","hue","invert","saturate","sepia"],Numeric=["opacity","zIndex","fontWeight","strokeWidth","strokeDashoffset","stopOpacity","flexGrow"],Lacuna1=["opacity","scale","brightness","contrast","saturate","stopOpacity"];class Interface{constructor(e,t="div",s){this.events=new EventEmitter,this.children=[],this.style={},this.isTransform=!1,this.isFilter=!1,"object"==typeof e&&null!==e?this.element=e:null!==t&&(this.element="svg"===t?document.createElementNS("http://www.w3.org/2000/svg",s||t):document.createElement(t),"string"==typeof e&&(e.startsWith(".")?this.element.className=e.slice(1):e.startsWith("#")&&(this.element.id=e.slice(1))))}add(e){if(this.children)return this.children.push(e),e.parent=this,e.element?this.element.appendChild(e.element):e.nodeName&&this.element.appendChild(e),e}addBefore(e,t){if(this.children)return this.children.push(e),e.parent=this,e.element?t.element?this.element.insertBefore(e.element,t.element):t.nodeName&&this.element.insertBefore(e.element,t):e.nodeName&&(t.element?this.element.insertBefore(e,t.element):t.nodeName&&this.element.insertBefore(e,t)),e}remove(e){if(!this.children)return;e.element&&e.element.parentNode?e.element.parentNode.removeChild(e.element):e.nodeName&&e.parentNode&&e.parentNode.removeChild(e);const t=this.children.indexOf(e);~t&&this.children.splice(t,1)}replace(e,t){if(!this.children)return;const s=this.children.indexOf(e);~s&&(this.children[s]=t,t.parent=this),e.element&&e.element.parentNode?t.element?e.element.parentNode.replaceChild(t.element,e.element):t.nodeName&&e.element.parentNode.replaceChild(t,e.element):e.nodeName&&e.parentNode&&(t.element?e.parentNode.replaceChild(t.element,e):t.nodeName&&e.parentNode.replaceChild(t,e))}clone(e){if(this.element)return new Interface(this.element.cloneNode(e))}empty(){if(this.element){for(let e=this.children.length-1;e>=0;e--)this.children[e]&&this.children[e].destroy&&this.children[e].destroy();return this.children.length=0,this.element.innerHTML="",this}}attr(e){if(this.element){for(const t in e)this.element.setAttribute(t,e[t]);return this}}css(e){if(!this.element)return;const t=this.style;for(const s in e)~Transforms.indexOf(s)?(t[s]=e[s],this.isTransform=!0):~Filters.indexOf(s)?(t[s]=e[s],this.isFilter=!0):~Numeric.indexOf(s)?(t[s]=e[s],this.element.style[s]=e[s]):("number"==typeof e[s]&&(t[s]=e[s]),this.element.style[s]="string"!=typeof e[s]?`${e[s]}px`:e[s]);if(this.isTransform){let e="";if(void 0!==t.x||void 0!==t.y||void 0!==t.z){e+=`translate3d(${void 0!==t.x?t.x:0}px, ${void 0!==t.y?t.y:0}px, ${void 0!==t.z?t.z:0}px)`}void 0!==t.skewX&&(e+=`skewX(${t.skewX}deg)`),void 0!==t.skewY&&(e+=`skewY(${t.skewY}deg)`),void 0!==t.rotation&&(e+=`rotate(${t.rotation}deg)`),void 0!==t.rotationX&&(e+=`rotateX(${t.rotationX}deg)`),void 0!==t.rotationY&&(e+=`rotateY(${t.rotationY}deg)`),void 0!==t.rotationZ&&(e+=`rotateZ(${t.rotationZ}deg)`),void 0!==t.scale&&(e+=`scale(${t.scale})`),void 0!==t.scaleX&&(e+=`scaleX(${t.scaleX})`),void 0!==t.scaleY&&(e+=`scaleY(${t.scaleY})`),void 0!==t.scaleZ&&(e+=`scaleZ(${t.scaleZ})`),this.element.style.transform=e}if(this.isFilter){let e="";void 0!==t.blur&&(e+=`blur(${t.blur}px)`),void 0!==t.brightness&&(e+=`brightness(${t.brightness})`),void 0!==t.contrast&&(e+=`contrast(${t.contrast})`),void 0!==t.grayscale&&(e+=`grayscale(${t.grayscale})`),void 0!==t.hue&&(e+=`hue-rotate(${t.hue}deg)`),void 0!==t.invert&&(e+=`invert(${t.invert})`),void 0!==t.saturate&&(e+=`saturate(${t.saturate})`),void 0!==t.sepia&&(e+=`sepia(${t.sepia})`),this.element.style.filter=e}return this}text(e){if(this.element)return void 0===e?this.element.textContent:(this.element.textContent=e,this)}html(e){if(this.element)return void 0===e?this.element.innerHTML:(this.element.innerHTML=e,this)}hide(){return this.css({display:"none"})}show(){return this.css({display:""})}invisible(){return this.css({visibility:"hidden"})}visible(){return this.css({visibility:""})}inView(){if(!this.element)return;const e=this.element.getBoundingClientRect(),t=Math.max(document.documentElement.clientHeight,window.innerHeight);return!(e.bottom<0||e.top-t>=0)}atPoint(e){if(!this.element)return;const t=this.element.getBoundingClientRect();return e.y>t.top&&e.x>t.left&&e.y<t.bottom&&e.x<t.right}intersects(e){if(!this.element)return;const t=this.element.getBoundingClientRect();let s;return e.element?s=e.element.getBoundingClientRect():e.nodeName&&(s=e.getBoundingClientRect()),t.bottom>s.top&&t.right>s.left&&t.top<s.bottom&&t.left<s.right}drawLine(e=this.progress||0){if(!this.element)return;const t=this.start||0,s=this.offset||0,i=this.element.getTotalLength(),n=i*e,r={strokeDasharray:`${n},${i-n}`,strokeDashoffset:-i*(t+s)};return this.css(r)}tween(e,t,s,i=0,n,r){if("number"!=typeof i&&(r=n,n=i,i=0),ticker.isAnimating||ticker.start(),!this.element)return;const a=getComputedStyle(this.element);for(const t in e)void 0===this.style[t]&&(~Transforms.indexOf(t)||~Filters.indexOf(t)||~Numeric.indexOf(t)?this.style[t]=~Lacuna1.indexOf(t)?1:0:"string"==typeof a[t]&&(this.style[t]=parseFloat(a[t]))),isNaN(this.style[t])&&delete this.style[t];return tween(this.style,e,t,s,i,n,(()=>{this.css(this.style),r&&r()}))}clearTween(){return clearTween(this.style),this}destroy(){if(this.children){this.parent&&this.parent.remove&&this.parent.remove(this),this.clearTween(),this.events.destroy();for(let e=this.children.length-1;e>=0;e--)this.children[e]&&this.children[e].destroy&&this.children[e].destroy();for(const e in this)this[e]=null;return null}}}const Stage=new Interface(null,null);Stage.init=(e=document.body)=>{Stage.element=e,Stage.root=document.querySelector(":root"),Stage.rootStyle=getComputedStyle(Stage.root),ticker.start()};class ProgressCanvas extends Interface{constructor({size:e=32}={}){super(null,"canvas"),this.width=e,this.height=e,this.x=e/2,this.y=e/2,this.radius=.4*e,this.startAngle=degToRad(-90),this.progress=0,this.needsUpdate=!1,this.initCanvas(),this.addListeners(),this.resize()}initCanvas(){this.context=this.element.getContext("2d")}addListeners(){ticker.add(this.onUpdate)}removeListeners(){ticker.remove(this.onUpdate)}onUpdate=()=>{this.needsUpdate&&this.update()};onProgress=({progress:e})=>{clearTween(this),this.needsUpdate=!0,tween(this,{progress:e},500,"easeOutCubic",(()=>{this.needsUpdate=!1,this.progress>=1&&this.onComplete()}))};onComplete=()=>{this.removeListeners(),this.events.emit("complete")};resize(){this.element.width=Math.round(2*this.width),this.element.height=Math.round(2*this.height),this.element.style.width=`${this.width}px`,this.element.style.height=`${this.height}px`,this.context.scale(2,2),this.context.lineWidth=1.5,this.context.strokeStyle=Stage.rootStyle.getPropertyValue("--ui-color").trim(),this.update()}update(){this.context.clearRect(0,0,this.element.width,this.element.height),this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,this.startAngle,this.startAngle+degToRad(360*this.progress)),this.context.stroke()}animateIn(){this.clearTween().css({scale:1,opacity:0}).tween({opacity:1},400,"easeOutCubic")}animateOut(e){this.clearTween().tween({scale:1.1,opacity:0},400,"easeInCubic",e)}destroy(){return this.removeListeners(),clearTween(this),super.destroy()}}const breakpoint=1e3,numPointers=22,store={users:[],sound:!0,id:null,nickname:"",observer:!1};class Socket extends EventEmitter{constructor(){super(),this.views=[],this.views[2]=new DataView(new ArrayBuffer(12)),this.views[3]=new DataView(new ArrayBuffer(11)),this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.connected=!1,this.promise=new Promise((e=>this.resolve=e))}init(){this.server="wss://multiuser-fluid.glitch.me",this.connect()}addListeners(){this.socket.addEventListener("close",this.onClose),this.socket.addEventListener("message",this.onMessage),this.on("users",this.onUsers),this.on("heartbeat",this.onHeartbeat)}removeListeners(){this.socket.removeEventListener("close",this.onClose),this.socket.removeEventListener("message",this.onMessage),this.off("users",this.onUsers),this.off("heartbeat",this.onHeartbeat)}ip2long(e){let t=0;return e.split(".").forEach((e=>{t<<=8,t+=parseInt(e,10)})),t>>>0}long2ip(e){return(e>>>24)+"."+(e>>16&255)+"."+(e>>8&255)+"."+(255&e)}onClose=()=>{this.connected=!1};onMessage=({data:e})=>{switch((e=new DataView(e)).getUint8(0)){case 0:{const t=[],s=17;let i=1;for(let n=0,r=(e.byteLength-1)/s;n<r;n++){const n=e.getUint8(i).toString(),r=this.decoder.decode(e.buffer.slice(i+1,i+11)).replace(/\0/g,""),a=this.long2ip(e.getUint32(i+11)),o=e.getUint16(i+15);t.push({id:n,nickname:r,remoteAddress:a,latency:o}),i+=s}this.emit("users",{users:t});break}case 1:{const t=e.getUint8(1).toString(),s=Number(e.getBigInt64(2));this.emit("heartbeat",{id:t,time:s}),this.send(e);break}case 3:{const t=e.getUint8(1).toString(),s=!!e.getUint8(2),i=e.getFloat32(3),n=e.getFloat32(7);this.emit("motion",{id:t,isDown:s,x:i,y:n});break}}};onUsers=({users:e})=>{store.users=e,Stage.events.emit("update",e)};onHeartbeat=({id:e})=>{this.connected||(this.connected=!0,store.id=e,22===Number(e)&&(store.observer=!0),this.nickname(store.nickname),this.resolve())};nickname=e=>{const t=this.views[2];t.setUint8(0,2);const s=this.encoder.encode(e);for(let e=0;e<10;e++)t.setUint8(2+e,s[e]);this.send(t)};motion=({isDown:e,x:t,y:s})=>{const i=this.views[3];i.setUint8(0,3),i.setUint8(2,e?1:0),i.setFloat32(3,t),i.setFloat32(7,s),this.send(i)};send=e=>{this.connected&&this.socket.send(e.buffer)};connect=()=>{this.socket&&this.close(),this.socket=new WebSocket(this.server,["permessage-deflate"]),this.socket.binaryType="arraybuffer",this.addListeners()};close=()=>{this.removeListeners(),this.socket.close()};ready=()=>this.promise}class Data{static init(){this.Socket=new Socket}static getUser=e=>store.users.find((t=>t.id===e));static getUserData=e=>{const t=this.getUser(e);if(t)return{id:t.id,nickname:t.nickname||(22===Number(t.id)?"Observer":t.id),latency:t.latency}};static getReticleData=e=>{const t=this.getUser(e);if(t)return{primary:t.nickname||t.id,secondary:`${t.latency}ms`}}}class PreloaderView extends Interface{constructor(){super(".preloader"),this.init(),this.initView(),this.addListeners()}init(){this.css({position:"fixed",left:0,top:0,width:"100%",height:"100%",backgroundColor:"var(--bg-color)",zIndex:100,pointerEvents:"none"})}initView(){this.view=new ProgressCanvas,this.view.css({position:"absolute",left:"50%",top:"50%",marginLeft:-this.view.width/2,marginTop:-this.view.height/2}),this.add(this.view)}addListeners(){this.view.events.on("complete",this.onComplete)}removeListeners(){this.view.events.off("complete",this.onComplete)}onProgress=e=>{this.view.onProgress(e)};onComplete=()=>{this.events.emit("complete")};animateIn=()=>{this.view.animateIn()};animateOut=()=>(this.view.animateOut(),this.tween({opacity:0},250,"easeOutSine",500));destroy=()=>(this.removeListeners(),super.destroy())}class Preloader{static init(){Data.init(),Data.Socket.init(),this.initStage(),this.initView(),this.initLoader(),this.addListeners()}static initStage(){Stage.init()}static initView(){this.view=new PreloaderView,Stage.add(this.view)}static async initLoader(){this.view.animateIn();const e=new BufferLoader;e.loadAll(["assets/sounds/bass_drum.mp3","assets/sounds/deep_spacy_loop.mp3","assets/sounds/water_loop.mp3"]),this.loader=new MultiLoader,this.loader.load(e),this.loader.add(2);const{App:t}=await import("./app.js");this.loader.trigger(1),this.app=t,await this.app.init(e),this.loader.trigger(1)}static addListeners(){this.loader.events.on("progress",this.view.onProgress),this.view.events.on("complete",this.onComplete)}static removeListeners(){this.loader.events.off("progress",this.view.onProgress),this.view.events.off("complete",this.onComplete)}static onComplete=async()=>{this.removeListeners(),this.loader=this.loader.destroy(),this.app.start(),await this.view.animateOut(),this.view=this.view.destroy(),this.app.animateIn()}}export{Data,Easing,Interface,PI,PI60,PI90,Preloader,Stage,Third,TwoPI,basename,breakpoint,brightness,clamp,clearTween,defer,delayedCall,euclideanModulo,guid,lerp,numPointers,radToDeg,shuffle,store,ticker,tween,wait};
