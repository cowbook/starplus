<template>
  <div class="home">
    <h1>Customer Survey Form</h1>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input v-model="form.name" type="text" id="name" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="form.email" type="email" id="email" required>
      </div>
      <div>
        <label for="feedback">Feedback:</label>
        <textarea v-model="form.feedback" id="feedback" required></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      form: {
        name: '',
        email: '',
        feedback: ''
      },
      // 根据环境变量或自动检测来确定 API 地址
      apiBase: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`
    }
  },
  methods: {
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
          alert('Form submitted successfully!')
          this.form = { name: '', email: '', feedback: '' }
        } else {
          alert('Error submitting form')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error submitting form')
      }
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #369870;
}
</style>
