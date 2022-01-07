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
    props: ['height', 'numFrames'],
    data() {
        return {
            selected: false,
            startY: null,
            controlPoints: [
                { x: 1, y: 50 },
                { x: 100, y: 50 },
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
                v-for="i in controlPoints.length - 1"
                class="control-line"
                :x1="getX(controlPoints[i - 1].x)"
                :y1="controlPoints[i - 1].y"
                :x2="getX(controlPoints[i].x)"
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
            return `0 0 1010 ${this.height}`;
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
    props: ['numFrames'],
    data: function() {
        return {
            // numFrames: 100,
        }
    },
    template: `
        <svg class="frame-tracker" viewBox="0 0 1010 20">
            <rect class="background" width="1010" height="20" />
            <text v-for="frame in frames" :x="getX(frame)" y="13">
                {{frame}}
            </text>
            <line class="tick-mark" v-for="i in numFrames" :x1="getX(i)" :x2="getX(i)" y1="15" y2="20" />
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
        }
    }
});

const app = new Vue({
    el: '#app',
    data: {
        numFrames: 60,
        height: 100,
    },
    methods: {
        getX: function(x) {
            // Map frames 1 to numFrames to range 0 - 1000 with some padding
            const padding = 10;
            const dx = (1000 - padding * 2) / (this.numFrames - 1);
            return padding + (x - 1) * dx;
        }
    }
})