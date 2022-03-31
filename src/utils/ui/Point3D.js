/**
 * @author pschroen / https://ufo.ai/
 */

import { Group, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector2 } from 'three';

import { Device } from '../../config/Device.js';
import { Events } from '../../config/Events.js';
import { Styles } from '../../config/Styles.js';
import { Interface } from '../Interface.js';
import { Line } from './Line.js';
import { Reticle } from './Reticle.js';
import { Tracker } from './Tracker.js';
import { Point } from './Point.js';

import { clearTween, delayedCall } from '../../tween/Tween.js';
import { getScreenSpaceBox } from '../world/Utils3D.js';

export class Point3D extends Group {
    static init(scene, camera, {
        element = document.body,
        stage = document.body,
        styles = Styles,
        debug = false
    } = {}) {
        this.scene = scene;
        this.camera = camera;
        this.element = element;
        this.ui = element instanceof Interface ? element : new Interface(element);
        this.stage = stage instanceof Interface ? stage : new Interface(stage);
        this.events = this.stage.events;
        this.styles = styles;
        this.debug = debug;

        this.objects = [];
        this.panels = [];
        this.raycaster = new Raycaster();
        this.mouse = new Vector2(-1, -1);
        this.delta = new Vector2();
        this.hover = null;
        this.click = null;
        this.lastTime = null;
        this.lastMouse = new Vector2();
        this.raycastInterval = 1 / 10; // 10 frames per second
        this.lastRaycast = 0;
        this.halfScreen = new Vector2();

        this.initCanvas();

        this.addListeners();
        this.onResize();
    }

    static initCanvas() {
        this.canvas = new Interface(null, 'canvas');
        this.context = this.canvas.element.getContext('2d');
        this.ui.add(this.canvas);
    }

    static addListeners() {
        this.events.on(Events.INVERT, this.onInvert);
        window.addEventListener('resize', this.onResize);
        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    static removeListeners() {
        this.events.off(Events.INVERT, this.onInvert);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
    }

    /**
     * Event handlers
     */

    static onInvert = () => {
        this.invert();
    };

    static onResize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = window.devicePixelRatio;

        this.halfScreen.set(this.width / 2, this.height / 2);

        this.canvas.element.width = Math.round(this.width * this.dpr);
        this.canvas.element.height = Math.round(this.height * this.dpr);
        this.canvas.element.style.width = this.width + 'px';
        this.canvas.element.style.height = this.height + 'px';
        this.context.scale(this.dpr, this.dpr);

        this.panels.forEach(panel => panel.resize());
    };

    static onPointerDown = e => {
        this.onPointerMove(e);

        if (this.hover) {
            this.click = this.hover;
            this.lastTime = performance.now();
            this.lastMouse.copy(this.mouse);
        }
    };

    static onPointerMove = e => {
        if (e) {
            this.mouse.x = (e.clientX / this.width) * 2 - 1;
            this.mouse.y = 1 - (e.clientY / this.height) * 2;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersection = this.raycaster.intersectObjects(this.objects);

        if (intersection.length) {
            const panel = this.panels[this.objects.indexOf(intersection[0].object)];

            if (!this.hover) {
                this.hover = panel;
                this.hover.onHover({ type: 'over' });
                this.stage.css({ cursor: 'pointer' });
            } else if (this.hover !== panel) {
                this.hover.onHover({ type: 'out' });
                this.hover = panel;
                this.hover.onHover({ type: 'over' });
                this.stage.css({ cursor: 'pointer' });
            }
        } else if (this.hover) {
            this.hover.onHover({ type: 'out' });
            this.hover = null;
            this.stage.css({ cursor: '' });
        }
    };

    static onPointerUp = e => {
        if (!this.click) {
            return;
        }

        this.onPointerMove(e);

        if (performance.now() - this.lastTime > 750 || this.delta.subVectors(this.mouse, this.lastMouse).length() > 50) {
            this.click = null;
            return;
        }

        if (this.click === this.hover) {
            this.click.onClick();
        }

        this.click = null;
    };

    /**
     * Public methods
     */

    static getSelected = () => {
        return this.panels.filter(panel => panel.selected).map(panel => panel.object);
    };

    static setIndexes = () => {
        this.panels.forEach((panel, i) => panel.setIndex(i));
    };

    static invert = () => {
        this.panels.forEach(panel => panel.resize());
    };

    static update = time => {
        this.context.clearRect(0, 0, this.canvas.element.width, this.canvas.element.height);

        this.panels.forEach(panel => panel.update());

        if (!Device.mobile && time - this.lastRaycast > this.raycastInterval) {
            this.onPointerMove();
            this.lastRaycast = time;
        }
    };

    static add = (...panels) => {
        panels.forEach(panel => {
            this.objects.push(panel.object);
            this.panels.push(panel);
        });

        this.setIndexes();
    };

    static remove = (...panels) => {
        panels.forEach(panel => {
            const index = this.panels.indexOf(panel);

            if (~index) {
                this.objects.splice(index, 1);
                this.panels.splice(index, 1);
            }

            if (panel === this.hover) {
                this.hover.onHover({ type: 'out' });
                this.hover = null;
                this.stage.css({ cursor: '' });
            }
        });

        this.setIndexes();
    };

    static destroy = () => {
        this.removeListeners();

        for (const prop in this) {
            this[prop] = null;
        }

        return null;
    };

    constructor(object, {
        name = object.name,
        type = object.type
    } = {}) {
        super();

        this.object = object;
        this.name = name;
        this.type = type;
        this.camera = Point3D.camera;
        this.halfScreen = Point3D.halfScreen;

        this.center = new Vector2();
        this.size = new Vector2();
        this.box = null;
        this.selected = false;
        this.animatedIn = false;

        this.initMesh();
        this.initViews();
    }

    initMesh() {
        this.object.geometry.computeBoundingSphere();
        const geometry = new SphereGeometry(this.object.geometry.boundingSphere.radius, 32, 32);

        let material;

        if (Point3D.debug) {
            material = new MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            });
        } else {
            material = new MeshBasicMaterial({ visible: false });
        }

        this.mesh = new Mesh(geometry, material);
        this.mesh.scale.copy(this.object.scale);
        this.add(this.mesh);
    }

    initViews() {
        this.line = new Line(Point3D.canvas.element, Point3D.context);
        Point3D.ui.add(this.line);

        this.reticle = new Reticle({ styles: Point3D.styles });
        Point3D.ui.add(this.reticle);

        this.tracker = new Tracker({ styles: Point3D.styles });
        Point3D.ui.add(this.tracker);

        this.point = new Point(this, this.tracker, { styles: Point3D.styles });
        this.point.setData({
            name: this.name,
            type: this.type
        });
        Point3D.ui.add(this.point);
    }

    /**
     * Event handlers
     */

    onHover = ({ type }) => {
        clearTween(this.timeout);

        if (this.selected) {
            if (type === 'over') {
                this.tracker.show();
            } else {
                this.tracker.hide();
            }

            return;
        }

        if (type === 'over') {
            if (!this.animatedIn) {
                this.resize();
                this.line.animateIn();
                this.reticle.animateIn();
                this.point.animateIn();
            }

            this.animatedIn = true;
        } else {
            this.timeout = delayedCall(2000, () => {
                this.line.animateOut();
                this.reticle.animateOut();
                this.tracker.animateOut();
                this.point.animateOut();

                this.animatedIn = false;
            });
        }
    };

    onClick = () => {
        this.selected = !this.selected;

        if (this.selected) {
            this.line.animateOut(true);
            this.reticle.animateOut();
            this.tracker.animateIn();
            this.point.open();

            Point3D.events.emit(Events.SELECT, { selected: Point3D.getSelected() });
        } else {
            this.line.animateIn(true);
            this.reticle.animateIn();
            this.tracker.unlock();
            this.tracker.animateOut();
            this.point.close();

            Point3D.events.emit(Events.SELECT, { selected: Point3D.getSelected() });
        }
    };

    /**
     * Public methods
     */

    setIndex = index => {
        this.index = index;

        const targetNumber = index + 1;

        this.tracker.number.setData({ targetNumber });
        this.point.text.number.setData({ targetNumber });
    };

    addPanel = item => {
        this.point.text.panel.add(item);
    };

    resize = () => {
        this.box = null;

        this.line.resize();
    };

    update = () => {
        this.line.startPoint(this.tracker.target);
        this.line.endPoint(this.point.originPosition);
        this.line.update();
        this.reticle.update();
        this.tracker.update();
        this.point.update();
    };

    updateMatrixWorld = force => {
        super.updateMatrixWorld(force);

        this.box = getScreenSpaceBox(this.mesh, this.camera);

        const boxCenter = this.box.getCenter(this.center).multiply(this.halfScreen);
        const boxSize = this.box.getSize(this.size).multiply(this.halfScreen);
        const centerX = this.halfScreen.x + boxCenter.x;
        const centerY = this.halfScreen.y - boxCenter.y;
        const width = Math.round(boxSize.x);
        const height = Math.round(boxSize.y);
        const halfWidth = Math.round(width / 2);
        const halfHeight = Math.round(height / 2);

        this.reticle.target.set(centerX, centerY);
        this.tracker.target.set(centerX, centerY);
        this.point.target.set(centerX + halfWidth, centerY - halfHeight);

        this.tracker.css({
            width,
            height,
            marginLeft: -halfWidth,
            marginTop: -halfHeight
        });
    };

    destroy = () => {
        this.line.animateOut(() => {
            this.point = this.point.destroy();
            this.tracker = this.tracker.destroy();
            this.reticle = this.reticle.destroy();
            this.line = this.line.destroy();
        });
    };
}
