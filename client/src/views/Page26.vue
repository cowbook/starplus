<template>
  <div class="page26 appear-container">

    <header class="segment seg1 appear-item" data-delay="0.1">

      <div class="row">
          <img class="logo" :src="logo" alt="STARPLUS" />
          <img class="text-top" :src="textTop" alt="顶部文字" />

         

      </div>
      
    </header>


    <main class="segment appear-item" style="padding-top:40px" data-delay="0.2">

      <div>
        如有更多意见与建议,欢迎联系我们:
        <br>

        Corpcomm@starplus-sh.com.cn

                <br>
        <br>
        <br>

      </div>

      <div class="bar">
        星扬西岸中心:021-6403 6018
      </div>

      <div class="bar">
        星 瀚 广 场:021-5496 2878
      </div>

      <div class="bar">
        星寰国际商业中心:020-8370 1773
      </div>

      <div class="bar">
        北京环球金融中心:010-8587 8188
      </div>

      <div class="bar">
        6 8 8 广场:021-6273 7688
      </div>

      <div class="bar">
        恒基名人商业大厦:021-3366 0818
      </div>

      <div class="bar">
        恒汇国际大厦:021-3253 2801
      </div>

      <div class="bar">
        环智国际大厦:021-8016 7666
      </div>

      <div style="color:goldenrod;font-size:18px;margin-top:20px;">
        感谢您的参与和支持<br>
        祝您工作顺利, 生活愉快
      </div>
<br>
    </main>

    <footer class="segment appear-item" style="padding-top:20px" data-delay="0.35">
      
        <div style="text-align: center;">

          退出问卷请按左上角关闭按钮

          <div class="blue-btn" @click="reset()">
                重新填写
          </div>

          <br>
        </div>

    </footer>



    <!--
  


        -->
  </div>
</template>

<script>


// 组件中使用
import { useFormStore } from '../stores/form';


import logo from '../assets/page2_logo_top_left.png'
import textTop from '../assets/page_title.svg'
import main from '../assets/page2_main2.svg'
import btnStart from '../assets/page2_btnstart.svg'
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
  name: 'Page3',
  data() {
    return {
      choice: "",
      p1,p2,p3,p4,p4,p5,p6,p7,p8,
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
      apiBase: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000/api`
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector('.page26')?.classList.add('appeared');
      }, 200);
    });
  },
  methods: {
    reset(){
      this.$router.push('/page4')
    },
    
    async submitForm() {
      const formStore = useFormStore();
      try {
        const response = await fetch(`${this.apiBase}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: '',
            email: '',
            feedback: formStore.step1Data.blockName
          })
        })
        if (response.ok) {
          alert('提交成功！')
          formStore.$reset();
          localStorage.removeItem('form-temp-data');
        } else {
          alert('提交失败，请稍后重试')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('提交失败，请检查网络或稍后再试')
      }
    },
    blockTap(name) {
       // 阻止事件冒泡
       this.choice = name;

       const formStore = useFormStore();
       formStore.step1Data = { blockName: name };

       console.log("选择了", name);
       //this.submitForm();

       this.$router.push('/page4');

    }
  }
}
</script>

<style scoped>

.page26 {

  min-height: 100vh;

  min-width: 100vw;
  width:100%;


  margin:0;


  /* 从上到下（第一层在最上面） */
  background-image:

    url("../assets/page2_bg_left_2x.png"),      /* 左边固定 */
    url("../assets/page2_bg_color.png"),   /* 中间可重复 */
    url("../assets/page2_bg_right_2x.png");     /* 右边固定 */


  background-repeat:
    repeat-y,            /* 右不重复 */
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
.bar{
  background-color: #8a6d4a;
  border-radius: 0 20px 20px 0;
  width:60%;

  color:#FFF;

  padding:5px 0;
  font-size:14px;
  font-weight: 800;
  margin-bottom: 12px;
  margin-left:35px;

}

.bar:nth-child(even){
    background-color: #00b7eb;

}

.row{

    margin:0 auto;
    max-width:500px;
    width:100%;
    padding:20px 0px 0px 0px;
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
}

.segment {

  width: 100%;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-image: url('../assets/page2_bg_horizontal_line.png');
  background-size: 100% 1px;
}

.seg2{

  padding-bottom: 20px;
}



.blue-btn {
  margin: 30px auto;
  width: 140px;
  height: 55px;
  line-height: 55px;
  background-image: url('../assets/blue_btn.png');
  background-repeat: no-repeat;
  background-size: 140px auto;
  color: white;

  font-size: 14px;
  font-weight: bold;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  text-align: center;
  cursor: pointer;

  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

  letter-spacing: 2px;
}
.item{
  margin:0 10px;
  display: block;
  width:calc(50% - 20px);
  max-width:450px;
}

.logo {
    margin-left:30px;
    width: 240px;
    height: auto;
}

.text-top {
  width: 120px;
  height: auto;
}

.btn-star {
    margin-top:30px;
    width: 32px;
    height: auto;
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
