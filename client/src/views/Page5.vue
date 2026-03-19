<template>
  <div v-if="assetsReady" class="page5 appear-container">




    <div class="content">


      <div class="segment appear-item" data-delay="0.1">

        <div class="row">

            <img class="logo" :src="logo" alt="STARPLUS" />
            <img class="text-top" :src="textTop" alt="顶部文字" />

            <div style="display:flex; flex-basis:64px;">

                <img class="btn-star" :src="btnStar" alt="星" />
                <img class="btn-star" :src="btnDown" alt="下" />


            </div>

        </div>
        
      </div>

      <div class="segment appear-item" style="padding-bottom:5px;" data-delay="0.2">
        <div class="row">
          <div>
            <img class="h1" :src="h1" alt="客户满意率调查" />
            <div class="title-desc">
              Tenants' Satisfaction Survey
            </div>

          </div>
          <img class="h1-icon" :src="h1_icon" alt="客户满意率调查" />
        </div>
      </div>

      <div class="segment appear-item" data-delay="0.3">

        <div class="form">

          <div class="h2">请填写您的基本信息</div>
          

          <div class="input-group" style="background-color: #F0F0F0;">
            <div class="blue-border" style="background-color:#F00"></div>
            <label class="input-label">物业</label>
            <input type="text" readonly="" class="input-field" name="blockName" :value="form.blockName"/>
          </div>


          <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">姓名/Name</label>
            <input type="text" class="input-field" name="name" placeholder="姓名" v-model="form.name"/>
          </div>

            <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">手机/Tel Number</label>
            <input type="text" class="input-field" name="mobile" placeholder="手机号码" v-model="form.mobile" />
          </div>

          <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">区域/Area</label>
            <div class="radio-set">

              <div class="set" :class="form.area === '商场' ? 'active' : ''" @click="form.area = '商场'">
                <input type="radio" id="r1" class="r1" name="area" value="商场" v-model="form.area" />
                <label class="r-text" for="r1">商场</label>
              </div>

              <div class="set" :class="form.area === '写字楼' ? 'active' : ''" style="margin-left:6px" @click="form.area = '写字楼'">
                <input type="radio" id="r2" class="r2" name="area" value="写字楼" v-model="form.area" />
                <label class="r-text" for="r2">写字楼</label>
              </div>
            </div>
          </div>



          <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">单元/Unit</label>
            <input type="text" class="input-field" name="unit" placeholder="单元" v-model="form.unit" />
          </div>

            <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">公司名称/Company</label>
            <input type="text" class="input-field" name="company" placeholder="公司名称" v-model="form.company" />
          </div>

            <div class="input-group">
            <div class="blue-border"></div>
            <label class="input-label">调查日/Date</label>
            <input type="text" class="input-field" name="subdate" placeholder="调查日期" v-model="form.subdate" />
          </div>



        </div>


        <div class="footer-zh">
          你的建议对我们很重要<br>
                    对于您们的反馈我们将十分感谢

        </div>

     

        <div class="footer-en">
          Your opinion is valuable to us and your<br>
          feedbacks are highly appreciated
        </div>



      </div>

      <div class="row appear-item" data-delay="0.4">

        <div class="blue-btn" @click="goBack()">
          上一页
        </div>


        <div class="blue-btn" @click="goNext()">
          提交
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

  <div v-else class="page5 page5-loading">
    <div class="loading-text">页面资源加载中...</div>
  </div>
</template>

<script>

import { useFormStore } from '../stores/form';


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
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return {
      assetsReady: false,
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
        blockName:'',
        name: '',
        mobile: '',
        unit: '',
        company: '',
        subdate: today,
        area:''
      },
      showModal: false,
      message: ''
    }
  },
  async mounted() {
    await this.preloadPageImages();
    this.assetsReady = true;

    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector('.page5')?.classList.add('appeared');
      }, 200);
    });

    const formStore = useFormStore();

    // 从 store 获取数据并设置到本地 form
    this.form = { ...this.form, ...formStore.formData };
  },
  methods: {
    preloadPageImages() {
      const imageUrls = [
        this.logo,
        this.textTop,
        this.h1,
        this.h1_icon,
        this.btnStar,
        this.btnDown,
        this.bgColor,
        this.bgLeft,
        this.bgRight,
        this.bgLine
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

    goNext() {
      
      const { name, mobile, unit, company, subdate } = this.form;

      const trimmedName = (name || '').trim();
      const trimmedMobile = (mobile || '').trim();
      const trimmedUnit = (unit || '').trim();
      const trimmedCompany = (company || '').trim();
      const trimmedSubdate = (subdate || '').trim();

      if (!trimmedName || !trimmedMobile || !trimmedUnit || !trimmedCompany || !trimmedSubdate) {
        this.showModal = true;
        this.message = '请填写完整信息!';
        return;
      }

      // 姓名至少 2 个字符
      if (trimmedName.length < 2) {
        this.showModal = true;
        this.message = '姓名至少需要2个字符';
        return;
      }

      // 手机号必须 11 位且符合大陆手机号格式
      const mobilePattern = /^1[3-9]\d{9}$/;
      if (!mobilePattern.test(trimmedMobile)) {
        this.showModal = true;
        this.message = '请输入有效的11位手机号';
        return;
      }

      // 单元不能为空
      if (!trimmedUnit) {
        this.showModal = true;
        this.message = '请输入单元信息';
        return;
      }

      /*
      // 公司名称需要超过 1个汉字（至少 4 个汉字）
      const chineseCharCount = (trimmedCompany.match(/[\u4e00-\u9fa5]/g) || []).length;
      if (chineseCharCount < 4) {
        this.showModal = true;
        this.message = '公司名称需超过3个汉字';
        return;
      }*/

      // 调查日期格式校验 YYYY-MM-DD
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(trimmedSubdate) || Number.isNaN(new Date(trimmedSubdate).getTime())) {
        this.showModal = true;
        this.message = '调查日期格式应为YYYY-MM-DD';
        return;
      }

      this.form = {
        ...this.form,
        name: trimmedName,
        mobile: trimmedMobile,
        unit: trimmedUnit,
        company: trimmedCompany,
        subdate: trimmedSubdate
      };

      const formStore = useFormStore();

      //console.log('OLD:',formStore.formData);

      formStore.formData = { 
        ...formStore.formData,
        ...this.form
      };

      console.log('Form Data:', formStore.formData);
      
      this.$router.push('/page6')





    },

    goBack() {
      this.$router.push('/page4')
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
  margin: 0px auto 30px auto;
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

.page5-loading {
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
.radio-set{
  flex:1;
  display: flex;
  justify-content: flex-end;
  padding:0 12px;
  font-size:14px;
}

.set{
  padding:3px 6px;
  border:1px solid #DDD;
  border-radius: 3px;
}

.active{
  border:1px solid #00b7eb;
}


.r1,.r2 {
  position: relative;
  top:2px;
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
  padding:0px 10px 15px 5px;
}


.footer-zh{
  font-family: Microsoft YaHei, Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #533278;
  text-align: center;
  margin-top: 0px;
}

.footer-en{
  font-family: Microsoft YaHei, Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #2c3e50;
  text-align: center;
  margin-top: 0px;
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
