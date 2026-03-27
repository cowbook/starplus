<template>
  <div v-if="assetsReady" class="page4 appear-container">

    <header class="segment seg1 appear-item bottom-line" data-delay="0.1">

      <div class="row">

          <img class="logo" :src="logo" alt="STARPLUS" />
          <img class="text-top" :src="textTop" alt="顶部文字" />

          <div style="display: flex; gap: 3px;margin-right:15px;">

              <img class="btn-star" :src="btnStar" alt="星" @click.stop="openHomeConfirm" />
              <img class="btn-star" :src="btnDown" alt="下" @click.stop="scrollToBottom" />


          </div>

      </div>
      
    </header>


    <main class="content">

      <div class="tip appear-item" data-delay="0.2">
        <div @click="goBack()">
          ⬅ 上一步
        </div>

        <div>
          ▼点击图片选择您所在物业▼
        </div>
      </div>
    

      <div class="segment appear-item" data-delay="0.25">

        <div class="row">

          <div class="p-row">

              <div class="item" :class="{active: choice === '星扬西岸中心'}" @click="blockTap('星扬西岸中心')">
                <img :src="p1" alt="STARPLUS" />
              </div>
              <div class="item" :class="{active: choice === '星瀚广场'}" @click="blockTap('星瀚广场')">
                <img :src="p2" alt="STARPLUS" />
              </div>

          </div>

        </div>
      </div>
      <div class="segment appear-item" data-delay="0.3">

        <div class="row">

          <div class="p-row">

              <div class="item" :class="{active: choice === '星寰国际商业中心'}" @click="blockTap('星寰国际商业中心')">
                <img :src="p3" alt="STARPLUS" />
              </div>
              <div class="item" :class="{active: choice === '北京环球金融中心'}" @click="blockTap('北京环球金融中心')">
                <img :src="p4" alt="STARPLUS" />
              </div>

          </div>
        </div>
      </div>
      <div class="segment appear-item" data-delay="0.35">

        <div class="row">

          <div class="p-row">

              <div class="item" :class="{active: choice === '688广场'}" @click="blockTap('688广场')">
                <img :src="p5" alt="STARPLUS" />
              </div>
              <div class="item" :class="{active: choice === '恒基名人商业大厦'}" @click="blockTap('恒基名人商业大厦')">
                <img :src="p6" alt="STARPLUS" />
              </div>

          </div>
        </div>
    </div>
      <div class="segment appear-item" data-delay="0.4">

        <div class="row">

          <div class="p-row">

              <div class="item" :class="{active: choice === '恒汇国际大厦'}" @click="blockTap('恒汇国际大厦')">
                <img :src="p7" alt="STARPLUS" />
              </div>
              <div class="item" :class="{active: choice === '环智国际大厦'}" @click="blockTap('环智国际大厦')">
                <img :src="p8" alt="STARPLUS" />
              </div>

          </div>
        </div>


      </div>
      
    </main>

    <!--    <footer class="segment">
      <img class="footer-text" :src="footerText" alt="底部文字" />
    </footer>
    
    -->



    <div v-if="showHomeConfirm" class="modal-overlay" @click="closeHomeConfirm">
      <div class="modal-content" @click.stop>
        <p>是否回到首页？</p>
        <div class="modal-actions">
          <button class="modal-btn" @click="confirmGoHome">是</button>
          <button class="modal-btn secondary" @click="closeHomeConfirm">否</button>
        </div>
      </div>
    </div>



  </div>

  <div v-else class="page4 page4-loading">
    <div class="loading-text">页面资源加载中...</div>
  </div>
</template>

<script>


// 组件中使用
import { useFormStore } from '../stores/form';

import logo from '../assets/page2_logo_top_left.png'
import textTop from '../assets/page_title.svg'
import arrow from '../assets/page2_arrow.png'
import btnStar from '../assets/page2_btnstar_topright.png'
import btnDown from '../assets/page2_btndown_topright.png'
import footerText from '../assets/page3_btn.png'
import bgColor from '../assets/page2_bg_color.png'
import bgLeft from '../assets/page2_bg_left_2x.png'
import bgRight from '../assets/page2_bg_right_2x.png'
import bgLine from '../assets/page2_bg_horizontal_line.png'


import p1 from '../assets/b1.png'
import p2 from '../assets/b2.png'
import p3 from '../assets/b3.png'
import p4 from '../assets/b4.png'
import p5 from '../assets/b5.png'
import p6 from '../assets/b6.png'
import p7 from '../assets/b7.png'
import p8 from '../assets/b8.png'



export default {
  name: 'Page4',
  data() {
    return {
      assetsReady: false,
      choice: "恒汇国际大厦",
      p1,p2,p3,p4,p4,p5,p6,p7,p8,
      logo,
      textTop,
      btnStar,
      btnDown,
      arrow,
      footerText,
      bgColor,
      bgLeft,
      bgRight,
      bgLine,
      apiBase: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`,
      showHomeConfirm: false
    }
  },
  async mounted() {
    await this.preloadPageImages();
    this.assetsReady = true;

    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector('.page4')?.classList.add('appeared');
      }, 200);
    });

    const formStore = useFormStore();

    // 从 store 获取数据并设置到本地 choice
    this.choice = formStore.formData?.blockName || '';
  },
  methods: {
    preloadPageImages() {
      const imageUrls = [
        this.logo,
        this.textTop,
        this.btnStar,
        this.btnDown,
        this.footerText,
        this.bgColor,
        this.bgLeft,
        this.bgRight,
        this.bgLine,
        this.p1,
        this.p2,
        this.p3,
        this.p4,
        this.p5,
        this.p6,
        this.p7,
        this.p8
      ];

      return Promise.all(
        imageUrls.map((url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = url;
          })
        )
      );
    },
    scrollToBottom() {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    },
    
    goBack() {
      this.$router.push('/page2')
    },
    openHomeConfirm() {
      this.showHomeConfirm = true;
    },
    closeHomeConfirm() {
      this.showHomeConfirm = false;
    },
    confirmGoHome() {
      this.showHomeConfirm = false;
      this.$router.push('/home');
    },
    
    blockTap(name) {

       this.choice = name;

       const formStore = useFormStore();
       formStore.formData = { ...formStore.formData,  blockName: name };

       console.log("选择了", formStore.formData);
       //this.submitForm();

       setTimeout(() => {

          this.$router.push('/page5');

       }, 700);


    }
  }
}
</script>

<style scoped>




.active img {
  border: 8px solid #ffd70088;
  box-sizing: border-box;
  border-radius: 10px;
}

.active::after {
  content: '√';
  position: absolute;
  opacity: 0.7;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 88px;
  font-weight: bold;
  font-family:  Helvetica, Arial, sans-serif;
}

.page4 {

  min-width: 100vw;
  width:100%;
  margin:0;
  /* 从上到下（第一层在最上面） */
  background-image:
  url("../assets/page2_bg_color.png");   /* 中间可重复 */
  background-repeat:repeat;
  /* 建议加一个兜底颜色，防止图片加载慢或透明 */
  background-color: #f6f7f1;

}

.page4-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  color: #1b8fbe;
  font-size: 14px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  letter-spacing: 1px;
}


.tip{
  box-sizing: border-box;
  max-width:500px;
  width:100%;
  display: flex;
  justify-content: space-between;;
  font-size:13px;
  font-family: 'Heiti', Microsoft YaHei, Helvetica, Arial, sans-serif;
  padding:10px 40px 0 23px;
  font-weight: 800;
  color:#666;
  text-align: left;
  margin:0 auto;
}


.p-row{
  width:100%;
  display:flex; 
  justify-content: space-between;
  padding: 0 30px 10px 15px;
  
}

.item {
  position: relative;
  display: inline-block;
  width: 170px;
  margin-right:9px;
  cursor: pointer;

}

.item img {
  display: block;
  width: 100%;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.16));
}



.row{

    margin:0 auto;
    max-width:500px;
    width:100%;
    padding:10px 0px 0px 0px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

}


.content {
    margin: 0;
    width: 100%;
}

.segment {

  width: 100%;

  /* ver-no-line 背景图方案：三层背景图，左固定、中重复、右固定
  background-position: bottom center;
  background-repeat: no-repeat;
  background-image: url('../assets/page2_bg_horizontal_line.png');
  background-size: 100% 1px;*/
}

.seg2{

  padding-bottom: 20px;
}

.seg1 {
    height: 101px;
    
}



.logo {
  position: relative;
    margin-left:20px;
    width: 160px;
    height: auto;
}

.text-top {
  position: relative;
  top:-5px;
  width: 120px;
  height: auto;
}

.btn-star {
    margin-top:30px;
    width: 32px;
    height: auto;
    cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: calc(100% - 48px);
  text-align: center;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.modal-actions {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.modal-btn {
  padding: 8px 16px;
  background-color: #00b7eb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.modal-btn.secondary {
  background-color: #8a9aa5;
}


.seg3 {
  height: 186px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}



.seg4 {

  height: 190px;

  justify-content: center;
  padding-top: 20px;
}

.btn-start {
  width: 140px;
  height: auto;
}





.seg5 {
  height: 87px;
    text-align: right;
}



.footer-text {
    margin-top:20px;
    width: 110px;
    height: auto;
}

</style>
