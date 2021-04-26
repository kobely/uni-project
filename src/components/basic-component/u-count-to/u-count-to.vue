<template>
    <view
        class="u-count-num"
        :style="{
			fontSize: fontSize + 'rpx',
			fontWeight: bold ? 'bold' : 'normal',
			color: color
		}"
    >
        {{ displayValue }}
    </view>
</template>

<script>
/**
 * countTo 数字滚动
 * @description 该组件一般用于需要滚动数字到某一个值的场景，目标要求是一个递增的值。
 * @property {String Number} start-val 开始值
 * @property {String Number} end-val 结束值
 * @property {String Number} duration 滚动过程所需的时间，单位ms（默认2000）
 * @property {Boolean} autoplay 是否自动开始滚动（默认true）
 * @property {String Number} decimals 要显示的小数位数，见官网说明（默认0）
 * @property {Boolean} use-easing 滚动结束时，是否缓动结尾，见官网说明（默认true）
 * @property {String} separator 千位分隔符，见官网说明
 * @property {String} color 字体颜色（默认#303133）
 * @property {String Number} font-size 字体大小，单位rpx（默认50）
 * @property {Boolean} bold 字体是否加粗（默认false）
 * @event {Function} end 数值滚动到目标值时触发
 * @example <u-count-to ref="uCountTo" :end-val="endVal" :autoplay="autoplay"></u-count-to>
 */
export default {
    name: 'u-count-to',
    props: {
        startVal: {
            type: [Number, String],
            default: 0
        },
        endVal: {
            type: [Number, String],
            default: 0,
            required: true
        },
        duration: {
            type: [Number, String],
            default: 2000
        },
        autoplay: {
            type: Boolean,
            default: true
        },
        decimals: {
            type: [Number, String],
            default: 0
        },
        useEasing: {
            type: Boolean,
            default: true
        },
        decimal: {
            type: [Number, String],
            default: '.'
        },
        color: {
            type: String,
            default: '#303133'
        },
        fontSize: {
            type: [Number, String],
            default: 50
        },
        bold: {
            type: Boolean,
            default: false
        },
        separator: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            localStartVal: this.startVal,
            displayValue: this.formatNumber(this.startVal),
            printVal: null,
            paused: false,
            localDuration: Number(this.duration),
            startTime: null,
            timestamp: null,
            remaining: null,
            rAF: null,
            lastTime: 0
        };
    },
    computed: {
        countDown() {
            return this.startVal > this.endVal;
        }
    },
    watch: {
        startVal() {
            this.autoplay && this.start();
        },
        endVal() {
            this.autoplay && this.start();
        }
    },
    mounted() {
        this.autoplay && this.start();
    },
    methods: {
        easingFn(t, b, c, d) {
            return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
        },
        requestAnimationFrame(callback) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - this.lastTime));
            const id = setTimeout(() => {
                callback(currTime + timeToCall);
            }, timeToCall);
            this.lastTime = currTime + timeToCall;
            return id;
        },
        cancelAnimationFrame(id) {
            clearTimeout(id);
        },
        start() {
            this.localStartVal = this.startVal;
            this.startTime = null;
            this.localDuration = this.duration;
            this.paused = false;
            this.rAF = this.requestAnimationFrame(this.count);
        },
        reStart() {
            if (this.paused) {
                this.resume();
                this.paused = false;
            } else {
                this.stop();
                this.paused = true;
            }
        },
        stop() {
            this.cancelAnimationFrame(this.rAF);
        },
        resume() {
            this.startTime = null;
            this.localDuration = this.remaining;
            this.localStartVal = this.printVal;
            this.requestAnimationFrame(this.count);
        },
        reset() {
            this.startTime = null;
            this.cancelAnimationFrame(this.rAF);
            this.displayValue = this.formatNumber(this.startVal);
        },
        count(timestamp) {
            if (!this.startTime) this.startTime = timestamp;
            this.timestamp = timestamp;
            const progress = timestamp - this.startTime;
            this.remaining = this.localDuration - progress;
            if (this.useEasing) {
                if (this.countDown) {
                    this.printVal = this.localStartVal - this.easingFn(progress, 0, this.localStartVal - this.endVal, this.localDuration);
                } else {
                    this.printVal = this.easingFn(progress, this.localStartVal, this.endVal - this.localStartVal, this.localDuration);
                }
            } else {
                if (this.countDown) {
                    this.printVal = this.localStartVal - (this.localStartVal - this.endVal) * (progress / this.localDuration);
                } else {
                    this.printVal = this.localStartVal + (this.endVal - this.localStartVal) * (progress / this.localDuration);
                }
            }
            if (this.countDown) {
                this.printVal = this.printVal < this.endVal ? this.endVal : this.printVal;
            } else {
                this.printVal = this.printVal > this.endVal ? this.endVal : this.printVal;
            }
            this.displayValue = this.formatNumber(this.printVal);
            if (progress < this.localDuration) {
                this.rAF = this.requestAnimationFrame(this.count);
            } else {
                this.$emit('end');
            }
        },
        isNumber(val) {
            return !isNaN(parseFloat(val));
        },
        formatNumber(num) {
            num = Number(num);
            num = num.toFixed(Number(this.decimals));
            num += '';
            const x = num.split('.');
            let x1 = x[0];
            const x2 = x.length > 1 ? this.decimal + x[1] : '';
            const rgx = /(\d+)(\d{3})/;
            if (this.separator && !this.isNumber(this.separator)) {
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + this.separator + '$2');
                }
            }
            return x1 + x2;
        },
        destroyed() {
            this.cancelAnimationFrame(this.rAF);
        }
    }
};
</script>

<style lang="scss" scoped>

.u-count-num {
    /* #ifndef APP-NVUE */
    display: inline-flex;
    /* #endif */
    text-align: center;
}
</style>
