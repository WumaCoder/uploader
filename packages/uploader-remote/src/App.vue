<template>
  <div>
    <div class="header">
      <span class="logo" @click="$router.replace('/')">
        <img style="width:100%;height100%" src="/favicon.ico" alt="LOGO" />
      </span>
      <span class="title" @click="$router.replace('/')">班级小管家</span>
      <span class="line"></span>
      <span class="sub" @click="$router.replace('/')">文件传输助手</span>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="foot">
      <span
        >Copyright © 2018 - 2021 . All Rights Reserved.
        京ICP备15006611号-1</span
      >
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  background: #eff1f3;
}
#app {
  background: #eff1f3;
  min-height: 100vh;
  font-family: Microsoft YaHei, PingFang SC, Helvetica Neue, Hiragino Sans GB,
    Noto Sans, Tahoma, Arial, simsun, sans-serif;
}
.header {
  display: flex;
  align-items: center;
  padding: 16px;
  .logo {
    width: 28px;
    height: 28px;
    cursor: pointer;
  }
  .title {
    font-size: 22px;
    margin-left: 5px;
    color: #656565;
    cursor: pointer;
  }
  .line {
    width: 1px;
    height: 20px;
    margin: 0 10px;
    background-color: hsla(210, 8%, 51%, 0.13);
  }
  .sub {
    color: #666;
    cursor: pointer;
  }
}

.main {
  min-height: 87vh;
}

.foot {
  font-size: 13px;
  color: #bbb;
  padding: 8px;
  text-align: center;
}
</style>
