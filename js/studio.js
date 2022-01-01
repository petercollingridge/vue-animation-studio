Vue.component('control-point', {
    props: ['position'],
    template: '<circle class="control-point" :cx="computedX" :cy="computedY" v-on:mousedown="select" :r="5" />',
    data() {
        return {
            x: undefined,
            y: undefined,
        };
    },
    computed: {
        computedX() {
            if (this.x !== undefined) {
                return this.x;
            } else {
                return this.position.x;
            }
        },
        computedY() {
            if (this.y !== undefined) {
                return this.y;
            } else {
                return this.position.y;
            }
        },
    },
    methods: {
        select: function(evt) {
            this.$parent.selected = this;   
            this.startX = this.computedX - evt.clientX;
            this.startY = this.computedY - evt.clientY;
        },
        drag: function(dx, dy) {
            this.x = this.startX + dx;
            this.y = this.startY + dy;  
        }
    },
});

const app = new Vue({
    el: '#app',
    data: {
        numFrames: 100,
    },
    methods: {
        drag: function(evt) {
            if (this.selected) {
                this.selected.drag(evt.clientX, evt.clientY);
            }
        },
        deselect: function() {
            this.selected = false;
        }
    }
})