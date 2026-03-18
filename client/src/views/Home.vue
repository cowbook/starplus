<template>
  <div class="page-bg" @click="goNext">
  <div class="page appear-container">
    <header class="hero appear-item" data-delay="0.1">

      <div class="hero-top bg-line">
        <img class="logo" :src="logo" alt="STARPLUS Logo" />
        <img class="year" :src="year" alt="2025" />
      </div>

      <div style="height:290px;" class="bg-line">
        <img class="title" :src="mainText" alt="客户满意率调查" />

        <div class="icon-group">

          <img class="download" :src="downIcon" alt="下载" />
          <img class="clickicon" :src="clickicon" alt="Card Background" />

        </div>
        
      </div>
    </header>

    <main class="content bg-line appear-item" data-delay="0.25">

      <img class="card" :src="card" alt="Card Background" />


      <img class="fold" :src="fold" alt="Card Background" />


      

      
    </main>

    <footer style="height: 169px;width:100%">
      <img class="footer-decor appear-item" data-delay="0.4" :src="starplus" alt="STARPLUS" />
    </footer>
  </div>
  </div>
</template>

<script>
import logo from '../assets/page1_logo.png'
import year from '../assets/page1_year.png'
import mainText from '../assets/page1_maintext.png'
import downIcon from '../assets/page1_down.png'
import card from '../assets/page1_card.png'
import fold from '../assets/page1_fold.png'
import starplus from '../assets/page1_starplus.png'
import clickicon from '../assets/click.svg'

export default {
  name: 'Home',
  data() {
    return {
      clickicon,
      logo,
      year,
      mainText,
      card,
      fold,
      downIcon,
      starplus,
      form: {
        name: '',
        email: '',
        feedback: ''
      },
      apiBase: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`
    }
  },

  mounted() {
    // 下一帧添加类，让 transition 生效
    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector('.page')?.classList.add('appeared')
      }, 1000)  // 轻微延迟更自然
    })
  },
  methods: {
    goNext() {
      this.$router.push('/page2')
    },
    async submitForm() {
      try {
        const response = await fetch(`${this.apiBase}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        })
        if (response.ok) {
          alert('提交成功！')
          this.form = { name: '', email: '', feedback: '' }
        } else {
          alert('提交失败，请稍后重试')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('提交失败，请检查网络或稍后再试')
      }
    }
  }
}
</script>


<style scoped>

.icon-group{
  margin-top:-30px;
  padding:0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.clickicon{

  width: 120px;
  margin: 20px 0;
  display: block;

}

.download {
  display: block;
  width: 50px;
  
}

.page-bg {
  height: 100%;
  width: 100%;
  /*
  background-position: left top;
  background-repeat: repeat-x;
  background-image: url('../assets/page1_bg_line.png');
  */
  cursor: pointer;
}

.bg-line {

  background-position: bottom center;
  background-repeat: no-repeat;
  background-image: url('../assets/page2_bg_horizontal_line.png');
  background-size: 100% 1px;
}


.page {
  
  background-image: url('../assets/page1_bg_left.png');
  background-position: left top;
  background-repeat: no-repeat;
  width: 100%;
  max-width: 500px; /* 设计稿 500px */
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.hero {
  width: 100%;
  max-width: 840px;
  text-align: center;
}

.hero-top {
  display: flex;
  height:76px;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  padding-top: 20px;
}

.logo {
  width: 130px;
  margin-left:50px;
}

.year {
  width: 160px;
  margin-right: 50px;
}

.title {
  width: 330px;
  margin: 0 auto;
  display: block;
}



.content {
  width: 100%;
  margin:0;
  height: 300px;
}

.card {

  display: block;
  z-index: 100;
  position: relative;
  left:29px;
  top:-20px;
  width: 210px;

  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.36));
  
}

.fold{
  position: relative;
  top: -110px;
  width: 240px;
}

.card-bg {
  width: 100%;
  display: block;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.form-panel {
  position: absolute;
  top: 18px;
  left: 18px;
  right: 18px;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 14px;
  backdrop-filter: blur(8px);
}

.form-panel h2 {
  margin: 0 0 18px;
  font-size: 22px;
  color: #1a3365;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
}

.field label {
  font-size: 12px;
  margin-bottom: 6px;
  color: #4a4f5c;
  text-align: left;
}

.field input,
.field textarea {
  border: 1px solid rgba(26, 51, 101, 0.25);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  resize: vertical;
}

.field textarea {
  min-height: 90px;
}





.footer-decor {
  display: block;
  width: 150px;
  margin:-28px auto 0 60px;
}




</style>
