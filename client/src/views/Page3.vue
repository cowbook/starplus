<template>
  <div v-if="assetsReady" class="page3" @click="goNext()">

    <header class="segment seg1 appear-item" data-delay="0.4">

      <div class="row">
          <img class="logo" :src="logo" alt="STARPLUS" />

          <div>

              <img class="text-top" :src="textTop" alt="顶部文字" />


              <img class="btn-star" :src="btnDown" alt="下" />


          </div>

      </div>
      
    </header>


    <main class="content">

      <div class="segment">
        <div class="row">


          <img class="p3-title appear-item" :src="p3_title" alt="主要内容" data-delay="0.1"/>

         
        </div>

        <div class="card-col appear-item" data-delay="0.1">

          <img class="card c1" :src="c1" alt="c1" />
          <img class="card c2" :src="c2" alt="c2" />
        </div>
        

      </div>

      <div class="segment" style="height:260px">

     

        <div class="card-col-right appear-item" data-delay="0.1">

          <img class="card c3" :src="c3" alt="c3" />
          <img class="card c4" :src="c4" alt="c4" />


        </div>

      </div>

    
    </main>

    <footer class="segment appear-item" data-delay="0.4">
      <div class="row flex">

        <div class="blue-btn" @click.stop="goBack()">
                上一页
        </div>

        <div>
          <img :src="clickicon" alt="点击图标" style="width: 140px; height: auto; margin: 0 8px;" />
        </div>
      </div>
    </footer>



    <!--
  


        -->
  </div>

  <div v-else class="page3 page3-loading">
    <div class="loading-text">页面资源加载中...</div>
  </div>
</template>

<script>




import logo from '../assets/page2_logo_top_left.png'
import textTop from '../assets/page_title.svg'
import main from '../assets/page2_main2.svg'
import btnStar from '../assets/page2_btnstar_topright.png'
import btnDown from '../assets/page2_btndown_topright.png'
import bgColor from '../assets/page2_bg_color.png'
import bgLeft from '../assets/page2_bg_left_2x.png'
import bgRight from '../assets/page2_bg_right_2x.png'
import bgLine from '../assets/page2_bg_horizontal_line.png'
import clickicon from '../assets/click.svg'
import p3_title from '../assets/page3_title.svg'

import c1 from '../assets/page3_c1.png'
import c2 from '../assets/page3_c2.png'
import c3 from '../assets/page3_c3.png'
import c4 from '../assets/page3_c4.png'



export default {
  name: 'Page3',
  data() {
    return {
      assetsReady: false,
      clickicon,c1,c2,c3,c4,
      p3_title,
      logo,
      textTop,
      main,
      btnStar,
      btnDown,
      bgColor,
      bgLeft,
      bgRight,
      bgLine    
    }
  },
  async mounted() {
    await this.preloadPageImages()
    this.assetsReady = true

    // 下一帧添加类，让 transition 生效
    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector('.page3')?.classList.add('appeared')
      }, 200)
    })
  },
  methods: {
    preloadPageImages() {
      const imageUrls = [
        this.logo,
        this.textTop,
        this.btnDown,
        this.clickicon,
        this.p3_title,
        this.c1,
        this.c2,
        this.c3,
        this.c4,
        this.bgLeft,
        this.bgColor,
        this.bgRight,
        this.bgLine
      ]

      return Promise.all(
        imageUrls.map((url) => {
          return new Promise((resolve) => {
            const img = new Image()
            img.onload = resolve
            img.onerror = resolve
            img.src = url
          })
        })
      )
    },
    goNext() {
      this.$router.push('/page4')
    },
    goBack() {
      this.$router.push('/page2')
    }
  }
}
</script>

<style scoped>


@font-face {
  font-family: 'MyHeiTi';
  src: url('../assets/myheiti.woff2') format('woff2');
}

.p3-title{
  width:140px;
  display:block;
  margin:0 auto;
}

.blue-btn {
  margin:8px 0;
  width: 120px;
  height: 45px;
  line-height: 45px;
  background-image: url('../assets/blue_btn.png');
  background-repeat: no-repeat;
  background-size: 120px auto;
  color: white;

  font-size: 14px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  text-align: center;
  cursor: pointer;

  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

  letter-spacing: 2px;
}

.flex{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card{
  width: 200px;
  height: auto;
  display: block;
  margin:0 10px;
  margin-bottom:-60px;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.26));

}


.card.c3{
  margin-bottom: -20px;
}

.card.c4{
  width:180px;
}

.card-col{
  margin:0px auto 0 25px;
  width:300px;
}

.card-col-right{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  margin:10px 55px 0 auto;
  width:300px;
}


.page3 {

  display: flex;
  flex-direction: column;
  min-width: 100vw;
  width:100%;
  min-height: 100vh;
  margin:0;
 

  background-repeat:repeat;
  /* 建议加一个兜底颜色，防止图片加载慢或透明 */
  background-color: #f6f7f1;




  /* 从上到下（第一层在最上面） */
  background-image:

    url("../assets/page2_bg_left_2x.png"),      /* 左边固定 */
    url("../assets/page2_bg_color.png"),   /* 中间可重复 */
    url("../assets/page2_bg_right_2x.png");     /* 右边固定 */


  background-repeat:
    repeat-y,            /* 左不重复 */
    no-repeat,            /* 中不重复 */
    repeat-y;            /* 右不重复 */

  background-position:
    left top,             /* 左上角对齐 */
    center top,             /* 中间从左开始铺（也可以 center top）*/
    right top;            /* 右上角对齐 */

  /* 可选：如果图片高度不同，可以统一高度 */
  background-size:
    36px 808px,            /* 左：高度撑满，宽度自动 */
    calc(100vw - 190px) 808px,            /* 中：高度撑满，宽度自动重复 */
    64px 908px;
  


  /* 建议加一个兜底颜色，防止图片加载慢或透明 */
  background-color: #f6f7f1;




}

.page3-loading {
  align-items: center;
  justify-content: center;
}

.loading-text {
  color: #1b8fbe;
  font-size: 14px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  letter-spacing: 1px;
}

.row{

    margin:0 auto;
    padding:20px 60px 0 35px;
    max-width:500px;
    width:100%;
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

}

.p-row{
  width:100%;
  display:flex; 
  justify-content: center;
  padding-bottom: 20px;
}

.content {
    margin: 0;
    width: 100%;
    flex:1;
}

.segment {

  width: 100%;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-image: url('../assets/page2_bg_horizontal_line.png');
  background-size: 100% 1px;
  padding-bottom: 8px;
}

.seg2{

  padding-bottom: 20px;
}



.item{
  margin:0 10px;
  display: block;
  width:calc(50% - 20px);
  max-width:450px;
}

.logo {
    width: 140px;
    height: auto;
}

.text-top {
  width: 120px;
  height: auto;
  display: block;
}

.btn-star {
    margin-top:-10px;
    margin-left: 80px;
    width: 32px;
    height: auto;
      display: block;

}


.seg3 {
  height: 186px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.main {
  max-width:390px;
  width:80%;
  height: auto;

    filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.36));

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


.arrow{
    display: relative;
    left: -120px;
    top:-300px;
    width: 124px;


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
