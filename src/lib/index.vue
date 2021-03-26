<template >
  <div :class="{[uniqueId]:true,'v-momentum-scroll_Default':true}"
       ref="wrapper"
       @touchstart.prevent="onStart"
       @touchmove.prevent="onMove"
       @touchend.prevent="onEnd"
       @touchcancel.prevent="onEnd"
       @mousedown.prevent="onStart"
       @mousemove.prevent="onMove"
       @mouseup.prevent="onEnd"
       @mousecancel.prevent="onEnd"
       @mouseleave.prevent="onEnd"
       @transitionend="onTransitionEnd">
    <div ref="scroller"
         :style="scrollerStyle">
      <slot></slot>
    </div>
  </div>
</template>>


<script>
// base on 前端也要懂物理 —— 惯性滚动篇 https://my.oschina.net/o2team/blog/4307027
import ResizeObserver from "resize-observer-polyfill";
const durationMap = {
  noBounce: 2500,
  weekBounce: 800,
  strongBounce: 400,
};
const bezierMap = {
  noBounce: "cubic-bezier(.17, .89, .45, 1)",
  weekBounce: "cubic-bezier(.25, .46, .45, .94)",
  strongBounce: "cubic-bezier(.25, .46, .45, .94)",
};
const NO_BOUNCE = "noBounce";
const WEEK_BOUNCE = "weekBounce";
const STRONG_BOUNCE = "strongBounce";
function noop() {}
export default {
  computed: {
    scrollerStyle() {
      return {
        transform: `translate3d(0, ${this.offsetY}px, 0)`,
        "transition-duration": `${this.duration}ms`,
        "transition-timing-function": this.bezier,
      };
    },
  },
  props: {
    hitBorder: {
      type: Function,
      require: false,
    },
  },
  data() {
    return {
      uniqueId:
        "v-momentum-scroll_id_" + (~~(Math.random() * (1 << 24))).toString(16),
      wrapper: null,
      scroller: null,
      minY: 0,
      maxY: 0,
      wrapperHeight: 0,
      offsetY: 0,
      duration: 0,
      bezier: "linear",
      startY: 0,
      pointY: 0,
      startTime: 0, // 惯性滑动范围内的 startTime
      momentumStartY: 0, // 惯性滑动范围内的 startY
      momentumTimeThreshold: 300, // 惯性滑动的启动 时间阈值
      momentumYThreshold: 15, // 惯性滑动的启动 距离阈值
      isStarted: false, // start锁
      absMaxY: 0,
      speed: 0,
      type: NO_BOUNCE,
      constantScrolling: false,
      bounceCallback: null,
    };
  },
  mounted() {
    this.wrapper = this.$refs.wrapper;
    this.scroller = this.$refs.scroller;
    // 计算准确的渲染区域范围
    const observeContainer = (entries) => {
      entries.forEach((entry) => {
        const cr = entry.contentRect;
        this.wrapperHeight = cr.height;
        const {
          height: scrollHeight,
        } = this.$refs.scroller.getBoundingClientRect();
        this.minY = this.wrapperHeight - scrollHeight;
      });
    };
    const observer = new ResizeObserver(observeContainer);
    observer.observe(this.$refs.wrapper);
    this.$once("hook:beforeDestroy", () => {
      observer.disconnect();
    });
  },
  methods: {
    onStart(e) {
      const point = e.touches ? e.touches[0] : e;
      this.isStarted = true;
      this.duration = 0;
      this.stop();
      this.pointY = point.pageY;
      this.momentumStartY = this.startY = this.offsetY;
      this.startTime = new Date().getTime();
    },
    onMove(e) {
      if (!this.isStarted) return;
      const point = e.touches ? e.touches[0] : e;
      const deltaY = point.pageY - this.pointY;
      // 浮点数坐标会影响渲染速度
      let offsetY = Math.round(this.startY + deltaY);
      // 超出边界时增加阻力
      if (offsetY < this.minY || offsetY > this.maxY) {
        offsetY = Math.round(this.startY + deltaY / 3);
      }
      this.offsetY = offsetY;
      const now = new Date().getTime();
      // 记录在触发惯性滑动条件下的偏移值和时间
      if (now - this.startTime > this.momentumTimeThreshold) {
        this.momentumStartY = this.offsetY;
        this.startTime = now;
      }
    },
    onEnd() {
      if (!this.isStarted) return;
      this.isStarted = false;
      this.type = NO_BOUNCE;
      if (this.isNeedReset()) return;
      const absDeltaY = Math.abs(this.offsetY - this.momentumStartY);
      const duration = new Date().getTime() - this.startTime;
      // 启动惯性滑动
      if (
        duration < this.momentumTimeThreshold &&
        absDeltaY > this.momentumYThreshold
      ) {
        const momentum = this.momentum(
          this.offsetY,
          this.momentumStartY,
          duration
        );
        this.offsetY = Math.round(momentum.destination);
        this.absMaxY = this.offsetY;
        this.duration = momentum.duration;
        this.bezier = momentum.bezier;
      }
    },
    onTransitionEnd() {
      if (this.bounceCallback) {
        this.bounceCallback();
        this.bounceCallback = null;
      }
      this.isNeedReset();
    },
    momentum(current, start, duration) {
      let type = NO_BOUNCE;
      // 惯性滑动加速度
      const deceleration = 0.003;
      // 回弹阻力
      const bounceRate = 10;
      // 强弱回弹的分割值
      const bounceThreshold = 300;
      // 回弹的最大限度
      const maxOverflowY = this.wrapperHeight / 6;
      let overflowY;

      const distance = current - start;
      const speed = (2 * Math.abs(distance)) / duration;
      this.speed = speed;
      let destination =
        current + (speed / deceleration) * (distance < 0 ? -1 : 1);
      if (destination < this.minY) {
        overflowY = this.minY - destination;
        type = overflowY > bounceThreshold ? STRONG_BOUNCE : WEEK_BOUNCE;
        destination = Math.max(
          this.minY - maxOverflowY,
          this.minY - overflowY / bounceRate
        );
      } else if (destination > this.maxY) {
        overflowY = destination - this.maxY;
        type = overflowY > bounceThreshold ? STRONG_BOUNCE : WEEK_BOUNCE;
        destination = Math.min(
          this.maxY + maxOverflowY,
          this.maxY + overflowY / bounceRate
        );
      }
      this.type = type;
      console.log("🚀 ~ file: index.vue ~ line 188 ~ momentum ~ type", type);
      console.log(
        "🚀 ~ file: index.vue ~ line 193 ~ momentum ~ destination",
        destination
      );
      return {
        destination,
        duration: durationMap[type],
        bezier: bezierMap[type],
      };
    },
    //超出边界时需要重置位置
    isNeedReset() {
      let offsetY;
      if (this.offsetY < this.minY) {
        // 触底
        let el =
          this.hitBorder &&
          this.hitBorder({
            direction: "bottom",
            type: this.type,
            offsetY: -this.offsetY,
          });
        if (!el) {
          offsetY = this.minY;
        } else {
          this.bounceTo(el);
          return true;
        }
      } else if (this.offsetY > this.maxY) {
        // 触顶
        let el =
          this.hitBorder &&
          this.hitBorder({ direction: "top", type: this.type });
        if (!el) {
          offsetY = this.maxY;
        } else {
          this.bounceTo(el);
          return true;
        }
      }
      if (typeof offsetY !== "undefined") {
        this.offsetY = offsetY;
        this.duration = 500;
        this.bezier = "cubic-bezier(.165, .84, .44, 1)";
        return true;
      }
      return false;
    },
    stop() {
      this.bounceCallback = null;
      // 获取当前 translate 的位置
      const matrix = window
        .getComputedStyle(this.scroller)
        .getPropertyValue("transform");
      this.offsetY = Math.round(+matrix.split(")")[0].split(", ")[5]);
    },
    bounceTo(el, callback) {
      let offsetY = this.getOffsetTop(el);
      if (!offsetY) return;
      if (offsetY < this.minY) offsetY = this.minY;

      if (offsetY) {
        if (callback) this.bounceCallback = callback;
        let type = NO_BOUNCE;
        this.offsetY = offsetY;
        this.duration = durationMap[type];
        this.bezier = bezierMap[type];
      }
    },
    getOffsetTop(el) {
      // 获取元素位于 v-momentum-scroll 的 offsetTop
      let contain = document.querySelector("." + this.uniqueId);
      let totalOffsetY;
      if (el != undefined && el instanceof HTMLElement) {
        if (el.closest("." + this.uniqueId)) {
          totalOffsetY = -el.offsetTop;
          let parentEl = el.offsetParent;
          while (parentEl != null && parentEl !== contain) {
            totalOffsetY -= parentEl.offsetTop;
            parentEl = parentEl.offsetParent;
          }
        } else {
          console.warn("el元素的祖先不包含 v-momentum-scroll");
        }
      } else {
        console.warn(
          `el元素不是HTMLElement的实例:${Object.prototype.toString.call(el)}。`
        );
      }
      return totalOffsetY;
    },
    scrollTo(el, speed = 8, callback = noop) {
      if (typeof speed != "number")
        return console.error('typeof speed != "number"');
      if (this.constantScrolling) return;
      let offsetY = this.getOffsetTop(el);
      if (!offsetY) return;
      if (offsetY < this.minY) offsetY = this.minY;
      this.constantScrolling = true;

      let isUp = this.offsetY < offsetY;
      let step = () => {
        if (this.isStarted) {
          return;
        }
        if (isUp) {
          this.offsetY += speed;
          if (this.offsetY < offsetY) {
            window.requestAnimationFrame(step);
          } else {
            this.offsetY = offsetY;
            this.constantScrolling = false;
            callback();
          }
        } else {
          this.offsetY -= speed;
          if (this.offsetY > offsetY) {
            window.requestAnimationFrame(step);
          } else {
            this.offsetY = offsetY;
            this.constantScrolling = false;
            callback();
          }
        }
      };
      window.requestAnimationFrame(step);
    },
  },
};
</script>

<style scoped>
.v-momentum-scroll_Default {
  position: relative;
  width: 100px;
  height: 100px;
}
</style>


