<template>
  <div class="page5">




    <div class="content">


      <div class="segment">

        <div class="row">

            <img class="logo" :src="logo" alt="STARPLUS" />
            <img class="text-top" :src="textTop" alt="顶部文字" />

            <div style="display:flex; flex-basis:64px;">

                <img class="btn-star" :src="btnStar" alt="星" />
                <img class="btn-star" :src="btnDown" alt="下" />


            </div>

        </div>
        
      </div>

      <div class="segment">
        <div class="row">
          <div>
            <img class="h1" :src="h1" alt="客户满意率调查" />
            <div class="title-desc">
              Tenants'Satisfaction Survey
            </div>

          </div>
          <img class="h1-icon" :src="h1_icon" alt="客户满意率调查" />
        </div>
      </div>

      <div class="segment">

        <div class="form">

          <div class="h2">请填写您的基本信息</div>


          <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">姓名/Name</label>
            <input type="text" class="input-field" placeholder="姓名" />
          </div>

            <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">手机/Mobile</label>
            <input type="text" class="input-field" placeholder="手机号码" />
          </div>

            <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">单元/Unit</label>
            <input type="text" class="input-field" placeholder="单元" />
          </div>

            <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">公司名称/Company</label>
            <input type="text" class="input-field" placeholder="公司名称" />
          </div>

            <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">调查日/Date</label>
            <input type="text" class="input-field" placeholder="调查日期" v-model="form.subdate" />
          </div>



        </div>


        <div class="footer-zh">
          你的建议对我们很重要<br>
                    对于您们的反馈我们将十分感谢

        </div>

     

        <div class="footer-en">
          Your opinion matters to us<br>
          We will be grateful for your feedback
        </div>



      </div>


      <div class="blue-btn" @click="goNext">
        开启问卷调查
      </div>

    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <p>{{ message }}</p>
        <button class="modal-btn" @click="showModal = false">确定</button>
      </div>
    </div>



    <!--
  


        -->
  </div>
</template>

<script>

import logo from '../assets/page2_logo_top_left.png'
import textTop from '../assets/page_title.svg'

import btnStar from '../assets/page2_btnstar_topright.png'
import btnDown from '../assets/page2_btndown_topright.png'

import h1 from '../assets/page5_h1.svg'


import h1_icon from '../assets/page5_title_icon.png'



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
      h1_icon,
      h1,
      btnStar,
      btnDown,
      bgColor,
      bgLeft,
      bgRight,
      bgLine,
      form: {
        subdate: '2026-10-26'
      },
      showModal: false,
      message: ''
    }
  },
  methods: {

    goNext() {



      const name = document.querySelector('input[placeholder="姓名"]')?.value;
      const mobile = document.querySelector('input[placeholder="手机号码"]')?.value;
      const unit = document.querySelector('input[placeholder="单元"]')?.value;
      const company = document.querySelector('input[placeholder="公司名称"]')?.value;

      if (!name || !mobile || !unit || !company) {
        this.showModal = true;
        this.message = '请填写所有信息';
        return;
      }

      
      this.showModal = true;
      this.message = '最后一页';



      //this.$router.push('/page6')

    },

    goBack() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

@font-face {
  font-family: 'MyHeiTi';
  src: url('../assets/myheiti.ttf') format('truetype');
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
.page5 {

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
    box-sizing: border-box;
    padding:10px 55px 0px 35px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.form {

    max-width:500px;
    width:100%;
    box-sizing: border-box;
    padding:20px 65px 20px 45px;
    
}

.input-group {
  width:100%;
  display: flex;
  align-items: center;
  justify-content: space-between;


  padding: 9px 0;
  /*border-left: 4px solid #2e7df6;*/
  padding-left: 6px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #c8b08e55;
  height:18px;
  margin:0 0 12px 0;


}

.blue-border{
  width:2px;
  height:75%;
  background-color:#00b7eb;
  border-radius: 2px;
  margin-right: 3px;
}


.input-label {
  font-size: 14px;
  color: #666;
  font-weight: 600;
  white-space: nowrap;
}

.input-field {
  flex: 1;
  border: none;
  padding:0 15px;
  background: transparent;
  font-size: 14px;
  color: #666;
  outline: none;
  text-align: right;
}

.input-field::placeholder {
  color: #999;
  font-size: 14px;
  text-align: right;
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
  padding-bottom: 20px;
}



.logo {
    width: 140px;
    height: auto;
}

.text-top {
  width: 110px;
  height: auto;
}

.btn-star {
    margin-top:30px;
    width: 32px;
    height: auto;
}





.h1{
  width:180px;
}

.title-desc{
  padding: 0 6px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-top: 8px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.h1-icon{
  width: 122px;
  height: auto;
  margin-left: 10px;
}




.h2{
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #2c3e50;
  text-align: left;
  padding:15px 10px;
}


.footer-zh{
  font-family: Microsoft YaHei, Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #533278;
  text-align: center;
  margin-top: 20px;
}

.footer-en{
  font-family: Microsoft YaHei, Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #2c3e50;
  text-align: center;
  margin-top: 8px;
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
  text-align: center;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.modal-btn {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #00b7eb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.modal-btn:hover {
  background-color: #0099cc;
}







</style>
