<template>
  <div class="page2">




    <div class="content">

      <div class="segment seg1 appear-item" data-delay="0.1">

        <div class="row">
            <img class="logo" :src="logo" alt="STARPLUS" />
            <img class="text-top" :src="textTop" alt="顶部文字" />

            <div style="display:flex; margin-right:64px;">

                <img class="btn-star" :src="btnStar" alt="星" />
                <img class="btn-star" :src="btnDown" alt="下" />


            </div>

        </div>
        
      </div>

      <div class="segment seg2"></div>

      <div class="segment seg3 appear-item" data-delay="0.25">
        <img class="main" :src="main" alt="主要内容" />
      </div>



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

      <div class="segment" style="height:280px">

     

        <div class="card-col-right appear-item" data-delay="0.1">

          <img class="card c3" :src="c3" alt="c3" />
          <img class="card c4" :src="c4" alt="c4" />


        </div>

      </div>


      <img class="arrow" :src="arrow" alt="箭头" />

    
    </main>


      <div class="segment seg4 appear-item" data-delay="0.1">

        


        <div style="display:flex">

          <div class="blue-btn" @click.stop="goBack()" style="z-index:100;position:relative;left:27px;">
            上一页
          </div>

          <div class="blue-btn" @click="goNext()">
            点击确认开始
          </div>
          
        </div>

        

      </div>
      <div class="segment seg5 appear-item" data-delay="0.4" >


                <img class="footer-text" :src="footerText" alt="底部文字" />


      </div>
      <div class="segment seg6">
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
import btnStart from '../assets/page2_btnstart.svg'
import arrow from '../assets/page2_arrow.png'
import btnStar from '../assets/page2_btnstar_topright.png'
import btnDown from '../assets/page2_btndown_topright.png'
import footerText from '../assets/text.svg'
import bgColor from '../assets/page2_bg_color.png'
import bgLeft from '../assets/page2_bg_left_2x.png'
import bgRight from '../assets/page2_bg_right_2x.png'
import bgLine from '../assets/page2_bg_horizontal_line.png'
import p3_title from '../assets/page3_title.svg'
import c1 from '../assets/page3_c1.png'
import c2 from '../assets/page3_c2.png'
import c3 from '../assets/page3_c3.png'
import c4 from '../assets/page3_c4.png'

export default {
  name: 'Page2',
  data() {
    return {
      logo,
      textTop,
      main,
      btnStart,
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
      c2,
      c3,
      c4
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
  margin: -35px 60px 0 auto;
  width: 140px;
  height: 55px;
  line-height: 55px;
  background-image: url('../assets/blue_btn.png');
  background-repeat: no-repeat;
  background-size: 140px auto;
  color: white;

  font-size: 14px;
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

    padding:20px 0px 0px 0px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.p3-title {
  width: 140px;
  display: block;
  margin: 0 auto;
}

.card {
  width: 200px;
  height: auto;
  display: block;
  margin: 0 10px;
  margin-bottom: -60px;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.26));
}

.card.c3 {
  margin-bottom: -20px;
}

.card.c4 {
  width: 180px;
}

.card-col {
  margin: 0 auto 0 25px;
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

.btn-star {
    margin-top:30px;
    width: 32px;
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
  width:400px;
  height: auto;

  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.36));

}

.seg4 {
  margin-top:-130px;
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
    left: -120px;
    top:-230px;
    width: 124px;


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
    top:40px;
    left:-45px;
    width: 240px;
    height: auto;
}

</style>
