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
        <div class="attribute-control-row">
            <div class="studio-label">x:</div>
            <svg class="attribute-control" :height="height" v-on:mousemove="drag" v-on:mouseup="deselect">
                <line
                    v-for="i in controlPoints.length - 1"
                    class="control-line"
                    :x1="controlPoints[i - 1].x * 10"
                    :y1="controlPoints[i - 1].y"
                    :x2="controlPoints[i].x * 10"
                    :y2="controlPoints[i].y"
                />
                <control-point
                    v-for="(controlPoint, index) in controlPoints"
                    :key="index"
                    :x="controlPoint.x * 10"
                    :y="controlPoint.y"
                    :index="index"
                />
            </svg>
        </div>
    `,
    methods: {
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

const app = new Vue({
    el: '#app',
    data: {
        numFrames: 100,
        height: 100,
    },
})