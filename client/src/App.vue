<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: 'page-slide-left'
    }
  },
  watch: {
    $route(to, from) {
      if (!from || !from.path) {
        this.transitionName = 'page-slide-left'
        return
      }

      const toOrder = this.getRouteOrder(to.path)
      const fromOrder = this.getRouteOrder(from.path)
      this.transitionName = toOrder < fromOrder ? 'page-slide-right' : 'page-slide-left'
    }
  },
  methods: {
    getRouteOrder(path) {
      if (path === '/') {
        return 1
      }

      const match = path.match(/^\/page(\d+)$/)
      if (match) {
        return Number(match[1])
      }

      // Unknown routes fall back to a large order to keep animation predictable.
      return Number.MAX_SAFE_INTEGER
    }
  }
}
</script>

<style>

@font-face {
  font-family: 'mi';
  src: local('MiSans'),url('./assets/misans.woff2') format('woff2')  format('truetype');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'MyHeiTi';
  src: url('./assets/myheiti.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}



html {
    height: 100%;
    width:100%;
    min-width: 100%;
}
body{
    margin: 0;
    height: 100%;
    background-color: #f6f7f1;

    width:100%;
    min-width: 100%;

    font-family: 'mi','Microsoft YaHei','SimHei', Helvetica, Arial, sans-serif;


}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style>
/* 前进：新页面从右进，旧页面向左出 */
.page-slide-left-enter-active,
.page-slide-left-leave-active,
.page-slide-right-enter-active,
.page-slide-right-leave-active {
  transition: all 0.55s cubic-bezier(0.4, 0, 0.2, 1); /* 舒服的缓动 */
  position: absolute;
  inset: 0;
  width: 100%;
}

.page-slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0.4;
}

.page-slide-left-leave-to {
  transform: translateX(-60%);
  opacity: 0.4;
}

/* 后退：新页面从左进，旧页面向右出 */
.page-slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0.4;
}

.page-slide-right-leave-to {
  transform: translateX(60%);
  opacity: 0.4;
}


/* ================== 页面首次加载时的出现动画 ================== */
.appear-container {
  /* 可选：整体容器轻微缩放进入 */
  animation: containerEnter 1s ease-out forwards;
}

@keyframes containerEnter {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}



/* 每个主要区块从不同方向滑入 + stagger */
.appear-item {
  opacity: 0;
  transform: translateY(40px);           /* 默认从下往上 */
  transition: all 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.appear-item[data-delay="0.1"]  { transition-delay: 0.1s; transform: translateX(-60px); }  /* logo/year 区从左 */
.appear-item[data-delay="0.25"] { transition-delay: 0.25s; transform: translateY(80px); }  /* main 从下 */
.appear-item[data-delay="0.4"]  { transition-delay: 0.4s; transform: translateX(60px); }   /* footer 从右 */

/* 当挂载完成后添加 .appeared 类触发动画 */
.appeared .appear-item {
  opacity: 1;
  transform: none;
}

</style>