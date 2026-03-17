<template>
  <div class="page6">

      <header class="segment">

        <div class="row">

            <img class="logo" :src="logo" alt="STARPLUS" />

            <div>

              <img class="text-top" :src="textTop" alt="顶部文字" />
              <div class="top-group">
                  <img class="btn-star" :src="btnStar" alt="星" />
                  <img class="btn-star" :src="btnDown" alt="下" />


              </div>
            </div>

        </div>
        
      </header>

      <div class="block">

        <div class="row">
          <div>
            <h2 class="h2">
              {{page.title}}
            </h2>
            <div class="title-desc">
              {{page.title_en}}  
            </div>

          </div>
        </div>
      </div>

      <div class="block" v-for="(item, index) in page.items" :key="index">

        <div class="h3">
          <div class="sy">
            {{ item.title }}
          </div>
          <div class="item-desc">
            {{ item.title_en }}
          </div>
        </div>
        
        <div class="row">

            <div class="option-group">
                <label v-for="(o,ind) in item.options" :key="o" class="option-item" :for="'opt-' + index + '-' + ind">
                  <input type="radio" alt="选项1" :name="'opt-' + index"  :id="'opt-' + index + '-' + ind " />
                  <span></span>
                  {{o}}
                </label>
            </div>


        </div>
        
      </div>

      <div class="segment" v-if="currentPage==6">

        <div class="row" style="justify-content:space-between; margin: 60px 110px 40px auto;">

          <img :src="comptext" alt="comptext"  style="width:140px;position: relative;top:160px;"/>

          <img :src="notebook_icon" alt="笔记本图标" style="width:140px;"/>

        </div>

      </div>




      <div class="segment">
        <div class="row">

          <div class="blue-btn" @click="p6_goPrev">
                上一页
          </div>

          <div class="blue-btn" @click="p6_goNext">
                下一页
          </div>
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

import comptext from '../assets/text.svg'


import h1_icon from '../assets/page5_title_icon.png'



import bgColor from '../assets/page2_bg_color.png'
import bgLeft from '../assets/page2_bg_left_2x.png'
import bgRight from '../assets/page2_bg_right_2x.png'
import bgLine from '../assets/page2_bg_horizontal_line.png'
import notebook_icon from '../assets/page6_note.png'

export default {
  name: 'Page2',
  data() {
    return {
      comptext,
      currentPage: 6,
      notebook_icon,
      logo,
      textTop,
      h1_icon,
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
      message: '',
      page:{
        title: '33',
        title_en: '',
        items:[]
      },
      pages:{
        'page6':{
          title:'1.物业管理中心',
          title_en:'Property Management Center',
          items:[
            {
              title:'1.1 整体满意度',
              title_en:'Overall Satisfaction',
              options:[
                '非常满意',
                '满意',
                '一般',
                '不满意',
                '非常不满意'
              ]
            }
          ]
        }
      }
    }
  },
  mounted() {
    // 模拟获取数据：使用当前路由路径（去掉前导 `/`）作为 key
    const currentPage = this.$route.path.replace(/^\//, '');
    this.page = this.pages[currentPage];
    this.currentPage = parseInt(currentPage.substring(4));

  },
  methods: {

    p6_goNext() {
      
      this.currentPage += 1;
      this.$router.push('/page'  + this.currentPage)
      
   



      //this.$router.push('/page6')

    },

    p6_goPrev() {

      this.currentPage -= 1;
      this.$router.push('/page'  + this.currentPage)

    }
  }
}
</script>

<style scoped>



@font-face {
  font-family: 'MyHeiTi';
  src: url('../assets/myheiti.ttf') format('truetype');
}

.option-group {

  display: flex;
  flex-wrap:  nowrap;
  margin-top: 10px;
  gap:10px;
}


.option-item {
  font-size:11px;
  display: flex;
  align-items: center;

}
  
 .option-item input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  /* 自定义未选中状态 */
  .option-item span {
    
    width: 14px;
    height: 14px;
    border: 2px solid #00b7eb; /* 未选中边框颜色 */
    border-radius: 50%;
    pointer-events: none; /* 允许点击穿透 */
    margin-right: 3px;
  }
  
  /* 自定义选中状态 */
.option-item input[type="radio"]:checked + span {
    border-color: #00b7eb; /* 选中边框颜色 */
    background: #00b7eb; /* 选中填充色 */
    color: white;
    font-family:yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
    font-size:18px;
  }
  
  /* 添加内部圆点（选中时） */
 .option-item input[type="radio"]:checked + span::before {
    content: "√";
    position: relative;
    top:-3px;
    left:-2px;
  }




.option-item label {
  
  cursor: pointer;
  font-family: yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}




.item-desc{
  font-size: 11px;
  color: #FFF;
  font-weight: 100;
  white-space: nowrap;
}

.sy{
    transform: scaleY(1.2); /* Y轴拉伸3倍，数值越大越细长 */

}
.h3{
  
  background-color: #533278;
  color: #fff;
  font-family: yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  font-size: 16px;
  letter-spacing: 2px;
  width:70%;
  padding: 12px 12px;
  border-radius: 0 25px 25px 0;
  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.36));

}

.h2{
  font-size:38px;
  text-shadow: #00b7eb 0px 0px 8px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;

}

.input-group{
  display:flex; flex-basis:64px;
}
.btn-star {

    width: 32px;
    height: 32px;
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
.page6 {

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
    margin:0 auto;
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
  width:20px;
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
  padding-bottom: 10px;
}


.block {
  
  width: 100%;
  padding-bottom: 10px;
}




.logo {
    width: 140px;
    height: auto;
}

.text-top {
  width: 110px;
  height: auto;
}







.h1{
  width:180px;
}

.title-desc{
  text-align: left;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.h1-icon{
  width: 122px;
  height: auto;
  margin-left: 10px;
}




.h2 {
  margin-bottom: 0px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  font-size: 30px;
  font-weight: 100;
  color: #fff;
  text-align: left;
  padding: 15px 10px;
  text-stroke:7px transparent;
  -webkit-text-stroke:7px transparent;
  background-color:#00b7eb;
  -webkit-background-clip: text;
  background-clip: text;


  /* 外部描边/光晕（模拟描边）
  text-shadow:
    -1 -1 0px #00b7eb,
    0 0 10px #00b7eb,
    0 0 10px #00b7eb,
    0 0 2px #00b7eb,
    0 0 3px #00b7eb,
    0 0 4px #00b7eb,
    0 0 2px #00b7eb,
    0 0 3px #00b7eb,
    0 0 6px #00b7eb,
    0 0 6px rgba(0, 183, 235, 0.4);*/
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
