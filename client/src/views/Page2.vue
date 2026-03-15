<template>
  <div class="page2" @click="goBack">




    <div class="content">
      <div class="segment seg1">

        <div class="row">
            <img class="logo" :src="logo" alt="STARPLUS" />
            <img class="text-top" :src="textTop" alt="顶部文字" />

            <div style="display:flex; margin-right:64px;">

                <img class="btn-star" :src="btnStar" alt="星" />
                <img class="btn-star" :src="btnDown" alt="下" />


            </div>

        </div>
        
      </div>
      <div class="segment seg2" />
      <div class="segment seg3">
        <img class="main" :src="main" alt="主要内容" />
      </div>

      <div class="segment seg4">

        <img class="arrow" :src="arrow" alt="箭头" />
        <img class="btn-start" :src="btnStart" alt="开始" />
        
      </div>
      <div class="segment seg5" >


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
import footerText from '../assets/page2_text_footer.png'
import bgColor from '../assets/page2_bg_color.png'
import bgLeft from '../assets/page2_bg_left_2x.png'
import bgRight from '../assets/page2_bg_right_2x.png'
import bgLine from '../assets/page2_bg_horizontal_line.png'

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
      bgLine
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

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

.seg1 {
    height: 169px;
    
}

.logo {
    margin-left:30px;
    width: 120px;
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

.seg6 {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-text {
    position: relative;
    top:40px;
    right:0px;
    width: 240px;
    height: auto;
}

</style>
