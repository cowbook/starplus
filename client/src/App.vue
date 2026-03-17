<template>
  <router-view v-slot="{ Component }">
    <transition name="page-slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
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


}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<style scoped>
/* 页面切换：从右 → 左滑入（下一页从右边进来） */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.55s cubic-bezier(0.4, 0, 0.2, 1); /* 舒服的缓动 */
  position: absolute;
  inset: 0;
  width: 100%;
}

.page-slide-enter-from {
  transform: translateX(100%);
  opacity: 0.4;
}

.page-slide-leave-to {
  transform: translateX(-60%);
  opacity: 0.4;
}
</style>