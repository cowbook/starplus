<template>
  <div class="page-bg" @click="goNext">
  <div class="page">
    <header class="hero">
      <div class="hero-top">
        <img class="logo" :src="logo" alt="STARPLUS Logo" />
        <img class="year" :src="year" alt="2025" />
      </div>
      <div style="height:332px;">
        <img class="title" :src="mainText" alt="客户满意率调查" />
        <img class="download" :src="downIcon" alt="下载" />

      </div>
    </header>

    <main class="content">

      <img class="card" :src="card" alt="Card Background" />


      <img class="fold" :src="fold" alt="Card Background" />

        

      
    </main>

    <footer style="height: 169px;width:100%">
      <img class="footer-decor" :src="starplus" alt="STARPLUS" />
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

export default {
  name: 'Home',
  data() {
    return {
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

.page-bg {
  height: 100%;
  width: 100%;
  background-position: left top;
  background-repeat: repeat-x;
  background-image: url('../assets/page1_bg_line.png');
  cursor: pointer;
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

.download {

  width: 50px;
  margin-top: -10px;
  display: block;
  margin-left: auto;
  margin-right: 30px;
}

.content {
  width: 100%;
  height:472px;
  margin:0;
}

.card {
  display: block;
  z-index: 100;
  position: relative;
  left:29px;
  top:-20px;
  width: 260px;

  filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.36));
  
}

.fold{
  position: relative;
  top: -110px;
  max-width: 340px;
  width: 70%;
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

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #2e7df6 0%, #2cc6d7 100%);
  border: none;
  border-radius: 999px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(46, 125, 246, 0.2);
  transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(46, 125, 246, 0.28);
}

.submit-btn .icon {
  width: 18px;
  height: 18px;
}

.footer-decor {
  display: block;
  width: 150px;
  margin:-28px auto 0 30px;
}

@media (max-width: 640px) {
 

  .form-panel {
    top: 12px;
    left: 12px;
    right: 12px;
    bottom: 12px;
    padding: 18px;
  }
}
</style>
