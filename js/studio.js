Vue.component('control-line', {
    props: ['x1', 'y1', 'x2', 'y2'],
    template: '<line class="control-line" :x1="x1" :y1="y1" :x2="x2" :y2="y2" />',
});

Vue.component('control-point', {
    props: ['x', 'y', 'index'],
    template: '<circle class="control-point" :cx="x" :cy="y" v-on:mousedown="select" :r="5" />',
    methods: {
        select: function(evt) {
            this.$parent.selected = this.index;
            this.$parent.startY = this.y - evt.clientY;
        },
    },
});

Vue.component('attribute-control', {
    props: ['height', 'numFrames', 'selectedFrame'],
    data() {
        return {
            selected: false,
            startY: null,
            controlPoints: [
                { x: 1, y: 50 },
                { x: 60, y: 50 },
            ],
        };
    },
    template: `
        <svg
            class="attribute-control"
            :height="height"
            :viewBox="viewbox"
            v-on:mousemove="drag"
            v-on:mouseup="deselect"
        >
            <line
                class="frame-line"
                :x1="getX(selectedFrame)"
                :x2="getX(selectedFrame)"
                y1="1"
                :y2="height - 1"
            />
            <line
                v-for="i in controlPoints.length - 1"
                class="control-line"
                :x1="getX(controlPoints[i - 1].x)"
                :x2="getX(controlPoints[i].x)"
                :y1="controlPoints[i - 1].y"
                :y2="controlPoints[i].y"
            />
            <control-point
                v-for="(controlPoint, index) in controlPoints"
                :key="index"
                :x="getX(controlPoint.x)"
                :y="controlPoint.y"
                :index="index"
            />
        </svg>
    `,
    computed: {
        viewbox: function() {
            return `0 0 1000 ${this.height}`;
        }
    },
    methods: {
        getX: function(x) {
            return this.$parent.getX(x);
        },
        drag: function(evt) {
            if (this.selected !== false) {
                const controlPoint = this.controlPoints[this.selected];
                controlPoint.y = this.startY + evt.clientY;
            }
        },
        deselect: function() {
            this.selected = false;
        }
    },
});

Vue.component('frame-tracker', {
    props: ['numFrames', 'selectedFrame'],
    data: function() {
        return {
            selected: false,
            selectorX: 10,
        }
    },
    template: `
        <svg class="frame-tracker" ref="svg" viewBox="0 0 1000 20" v-on:mousemove="drag" v-on:mouseup="deselect">
            <rect class="background" width="1000" height="20" />
            <text v-for="frame in frames" :x="getX(frame)" y="9">
                {{frame}}
            </text>
            <line class="tick-mark" v-for="i in numFrames" :x1="getX(i)" :x2="getX(i)" y1="15" y2="20" />
            <circle class="control-point" :cx="selectorX" :cy="9" v-on:mousedown="select" :r="7" />
            <text :x="selectorX" y="9">
                {{selectedFrame}}
            </text>
        </svg>
    `,
    computed: {
        frames: function() {
            const dFrames = 10;
            const frames = [1];
            for (let i = dFrames; i <= this.numFrames; i += dFrames) {
                frames.push(i);
            }
            return frames; 
        },
    },
    methods: {
        getX: function(frame) {
            return this.$parent.getX(frame);
        },
        select: function(evt) {
            this.selected = true;
            this.selectorX = this.selectorX;
            const CTM = this.$refs.svg.getScreenCTM();
            this.startX = this.selectorX - (evt.clientX - CTM.e) / CTM.a;
        },
        drag: function(evt) {
            if (this.selected) {
                const CTM = this.$refs.svg.getScreenCTM();
                this.selectorX = this.startX + (evt.clientX - CTM.e) / CTM.a;
                const frame = this.$parent.getFrame(this.selectorX);
                if (frame !== this.selectedFrame) {
                    this.$parent.setFrame(frame);
                }
            }
        },
        deselect: function() {
            this.selected = false;
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        numFrames: 60,
        selectedFrame: 1,
        height: 100,
        padding: 10,
    },
    methods: {
        // Map frames in range 1 to numFrames to x  position in range 0 - 1000 with some padding
        getX: function(frame) {
            const dx = (1000 - this.padding * 2) / (this.numFrames - 1);
            return this.padding + (frame - 1) * dx;
        },
        getFrame: function(x) {
            const dx = (1000 - this.padding * 2) / (this.numFrames - 1);
            return Math.round((x - this.padding) / dx) + 1;
        },
        setFrame: function(frame) {
            this.selectedFrame = frame;
        }
    }
})