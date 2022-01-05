Vue.component('control-point', {
    props: ['initialX', 'initialY', 'constrain'],
    template: '<circle class="control-point" :cx="computedX" :cy="computedY" v-on:mousedown="select" :r="5" />',
    data() {
        return {
            x: undefined,
            y: undefined,
        };
    },
    computed: {
        computedX() {
            return (this.x !== undefined) ? this.x : this.initialX;
        },
        computedY() {
            return (this.y !== undefined) ? this.y : this.initialY;
        },
    },
    methods: {
        select: function(evt) {
            this.$parent.selected = this;
            this.startX = this.computedX - evt.clientX;
            this.startY = this.computedY - evt.clientY;
        },
        drag: function(dx, dy) {
            if (this.constrain !== 'x') {
                this.x = this.startX + dx;
            }
            if (this.constrain !== 'y') {
                this.y = this.startY + dy;
            }
        }
    },
});

Vue.component('attribute-control', {
    props: ['height', 'numFrames'],
    data() {
        return {
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
                <control-point
                    v-for="controlPoint in controlPoints"
                    :initial-x="controlPoint.x * 10"
                    :initial-y="controlPoint.y"
                    constrain="x"
                />
            </svg>
        </div>
    `,
    methods: {
        drag: function(evt) {
            if (this.selected) {
                this.selected.drag(evt.clientX, evt.clientY);
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