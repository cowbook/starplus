<template>
  <div class="page4">

    <header class="segment seg1">

      <div class="row">
          <img class="logo" :src="logo" alt="STARPLUS" />
          <img class="text-top" :src="textTop" alt="顶部文字" />

          <div style="display: flex; gap: 10px;">

              <img class="btn-star" :src="btnStar" alt="星" />
              <img class="btn-star" :src="btnDown" alt="下" />


          </div>

      </div>
      
    </header>


    <main class="content">

    

      <div class="segment">

        <div class="row">

          <div class="p-row">

              <img class="item" :src="p1" alt="STARPLUS" @click="blockTap('星扬西岸中心')" />
              <img class="item" :src="p2" alt="STARPLUS"@click="blockTap('星瀚广场')" />

          </div>

        </div>
      </div>
      <div class="segment">

        <div class="row">

          <div class="p-row">

              <img class="item" :src="p3" alt="STARPLUS" @click="blockTap('星寰国际商业中心')" />
              <img class="item" :src="p4" alt="STARPLUS" @click="blockTap('北京环球金融中心')" />

          </div>
        </div>
      </div>
      <div class="segment">

        <div class="row">

          <div class="p-row">

              <img class="item" :src="p5" alt="STARPLUS" @click="blockTap('688广场')" />
              <img class="item" :src="p6" alt="STARPLUS" @click="blockTap('恒基名人商业大厦')" />

          </div>
        </div>
    </div>
      <div class="segment">

        <div class="row">

          <div class="p-row">

              <img class="item" :src="p7" alt="STARPLUS" @click="blockTap('恒汇国际大厦')" />
              <img class="item" :src="p8" alt="STARPLUS" @click="blockTap('环智国际大厦')" />

          </div>
        </div>


      </div>
      
    </main>

    <footer class="segment">
      <img class="footer-text" :src="footerText" alt="底部文字" />
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
  name: 'Page4',
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
      apiBase: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`
    }
  },
  methods: {
    goNext() {
      this.$router.push('/page3')
    },
    goBack() {
      this.$router.push('/')
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

       this.$router.push('/page5');

    }
  }
}
</script>

<style scoped>

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

.seg1 {
    height: 101px;
    
}

.item{
  margin:0 10px;
  display: block;
  width:calc(50% - 20px);
  max-width:450px;
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
