<template>
  <div class="page2">




    <div class="content">

      <div class="segment seg1 appear-item" data-delay="0.1">

        <div class="row">
            <img class="logo" :src="logo" alt="STARPLUS" />
            <img class="text-top" :src="textTop" alt="顶部文字" />

            <div style="display:flex; margin-right:64px;">

              <img class="btn-star" :src="btnStar" alt="星" @click.stop="openHomeConfirm" />
                <img class="btn-star" :src="btnDown" alt="下" @click.stop="scrollToBottom" />


            </div>

        </div>
        
      </div>


      <div class="segment seg3 appear-item" data-delay="0.25">
        <div class="row">
        <img class="main" :src="main" alt="主要内容" />
        </div>
      </div>



    <main class="content">

      <div class="segment" style="padding-bottom: 20px;">
        <div class="row">


          <img class="p3-title appear-item" :src="p3_title" alt="操作介绍" data-delay="0.1"/>


        </div>

        <div class="card-col appear-item" data-delay="0.1">

          <img class="card" :src="c1" alt="c1" />
          <img class="arrow" :src="arrow" alt="箭头" />

        </div>


        <div class="row" style="box-sizing: border-box; padding:0 60px 0 30px;margin-top:-70px;display:flex;flex-wrap:nowrap;justify-content:space-between;">

          <div style="margin-right:40px;">
            <div class="blue-btn" @click.stop="goBack()" style="z-index:100;position:relative;left:27px;">
              上一页
            </div>
          </div>

          <div style="">
            <div class="blue-btn" @click="goNext()">
              点击确认开始
            </div>
          </div>
        </div>




              

      </div>

   



    
    </main>


      
      <div class="segment seg5 appear-item" data-delay="0.4" >


                <img class="footer-text" :src="footerText" alt="底部文字" />


      </div>
      <div style="height:90px"></div>
   
    </div>



    <div v-if="showHomeConfirm" class="modal-overlay" @click="closeHomeConfirm">
      <div class="modal-content" @click.stop>
        <p>是否回到首页？</p>
        <div class="modal-actions">
          <button class="modal-btn" @click="confirmGoHome">是</button>
          <button class="modal-btn secondary" @click="closeHomeConfirm">否</button>
        </div>
      </div>
    </div>

    <!--
  


        -->
  </div>
</template>

<script>
import logo from '../assets/page2_logo_top_left.png'
import textTop from '../assets/page_title.svg'
import main from '../assets/page2_main2.svg'
import arrow from '../assets/page2_arrow.png'
import btnStar from '../assets/page2_btnstar_topright.png'
import btnDown from '../assets/page2_btndown_topright.png'
import footerText from '../assets/text.svg'
import bgColor from '../assets/page2_bg_color.png'
import bgLeft from '../assets/page2_bg_left_2x.png'
import bgRight from '../assets/page2_bg_right_2x.png'
import bgLine from '../assets/page2_bg_horizontal_line.png'
import p3_title from '../assets/page3_title.svg'
import c1 from '../assets/page2_cardnc.svg'


export default {
  name: 'Page2',
  data() {
    return {
      logo,
      textTop,
      main,
      btnStar,
      btnDown,
      arrow,
      footerText,
      bgColor,
      bgLeft,
      bgRight,
      bgLine,
      p3_title,
      c1,
      showHomeConfirm: false
     
    }
  },
  mounted() {
    // 下一帧添加类，让 transition 生效
    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector('.page2')?.classList.add('appeared')
      }, 1000)  // 轻微延迟更自然
    })
  },
  methods: {
    scrollToBottom() {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      })
    },
    openHomeConfirm() {
      this.showHomeConfirm = true
    },
    closeHomeConfirm() {
      this.showHomeConfirm = false
    },
    confirmGoHome() {
      this.showHomeConfirm = false
      this.$router.push('/home')
    },
    goNext() {
      this.$router.push('/page4')
    },
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>


.blue-btn {
  padding:0 0 0 4px;
  width: 130px;
  height: 50px;
  line-height: 50px;
  background-image: url('../assets/blue_btn.png');
  background-repeat: no-repeat;
  background-size: 130px auto;
  color: white;

  font-size: 12px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  text-align: center;
  cursor: pointer;

  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

  letter-spacing: 2px;
}


.page2 {



  min-width: 100vw;
  width:100%;


  margin:0;


  /* 从上到下（第一层在最上面） */
  background-image:

    url("../assets/page2_bg_left_2x.png"),      /* 左边固定 */
    url("../assets/page2_bg_color.png"),   /* 中间可重复 */
    url("../assets/page2_bg_right_2x.png");     /* 右边固定 */


  background-repeat:
    no-repeat,            /* 左不重复 */
    no-repeat,            /* 左不重复 */
    repeat-y;            /* 右不重复 */

  background-position:
    left top,             /* 左上角对齐 */
    center top,             /* 中间从左开始铺（也可以 center top）*/
    right top;            /* 右上角对齐 */

  /* 可选：如果图片高度不同，可以统一高度 */
  background-size:
    39px 1078px,            /* 左：高度撑满，宽度自动 */
    calc(100vw - 290px) 1078px,            /* 中：高度撑满，宽度自动重复 */
    54px 808px;
  


  /* 建议加一个兜底颜色，防止图片加载慢或透明 */
  background-color: #f6f7f1;






}

.row{

    max-width:500px;
    width:100%;
    margin:0 auto;
    padding:20px 0px 0px 0px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
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


.p3-title {
  width: 120px;
  display: block;
  margin: 0 auto;
}

.card {
  position: relative;
  left:40px;
  width: 250px;
  height: auto;
  display: block;
  margin: 20px 10px;
  margin-bottom: -60px;
  filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.26));
  transform: rotate(-8deg);
}


.card-col {
  margin: 0 auto;
  width: 300px;
}

.card-col-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  margin: 10px 55px 0 auto;
  width: 300px;
}

.content {
    margin: 0;
    width: 100%;
}

.segment {

  width: 100%;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-image: url('../assets/page2_bg_horizontal_line.png');
  background-size: 100% 1px;
}



.logo {
    margin-left:30px;
    width: 160px;
    height: auto;
}

.text-top {
  width: 90px;
  height: auto;
}





.seg2 {
  height: 29px;
}

.seg3 {

  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 24px;
}

.main {
  width:280px;
  height: auto;

  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.36));

}

.seg4 {
  margin-top:-30px;
  height: 40px;
  justify-content: center;
  padding-top: 20px;
}

.btn-start {
  width: 140px;
  height: auto;
}


.arrow{
    position: relative;
    left: -90px;
    top:-230px;
    width: 124px;
    /*左右翻转*/
    transform: rotate(15deg);


}


.seg5 {
  height: 87px;
  text-align: right;
}

.seg6 {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-text {
    position: relative;
    top:55px;
    left:-45px;
    width: 170px;
    height: auto;
}

</style>
