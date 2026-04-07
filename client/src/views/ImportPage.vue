<template>
  <div class="import-page">
    <div class="import-card">
      <h1>数据导入</h1>
      <p class="desc">上传导出的 Excel 文件，系统将按 id 更新现有记录（不会新建记录）。</p>

      <button class="upload-btn" type="button" :disabled="uploading" @click="startUpload">
        {{ uploading ? '上传中...' : '上传EXCEL并更新' }}
      </button>
      <input
        ref="fileInput"
        class="hidden-file-input"
        type="file"
        accept=".xlsx,.xls"
        @change="onFileChange"
      />

      <p v-if="message" class="message">{{ message }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
const ADMIN_KEY_STORAGE = 'starplus-admin-key'

export default {
  name: 'ImportPage',
  data() {
    const hostname = window.location.hostname
    const isLocalHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      /^\d+\.\d+\.\d+\.\d+$/.test(hostname)

    return {
      apiBase:
        import.meta.env.VITE_API_URL ||
        (isLocalHost ? `${window.location.protocol}//${hostname}:3000/api` : '/api'),
      adminKey: sessionStorage.getItem(ADMIN_KEY_STORAGE) || '',
      uploading: false,
      message: '',
      errorMessage: ''
    }
  },
  methods: {
    async startUpload() {
      this.message = ''
      this.errorMessage = ''

      let adminKey = this.adminKey
      if (!adminKey) {
        const input = window.prompt('请输入管理员口令')
        adminKey = typeof input === 'string' ? input.trim() : ''
      }

      if (!adminKey) {
        this.errorMessage = '需要管理员口令才能导入'
        return
      }

      this.adminKey = adminKey
      sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey)

      const input = this.$refs.fileInput
      if (!input) {
        this.errorMessage = '无法打开文件选择器'
        return
      }

      input.value = ''
      input.click()
    },
    async onFileChange(event) {
      const file = event?.target?.files?.[0]
      if (!file) {
        return
      }

      this.uploading = true
      this.message = ''
      this.errorMessage = ''

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${this.apiBase}/import`, {
          method: 'POST',
          headers: {
            'x-admin-key': this.adminKey
          },
          body: formData
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem(ADMIN_KEY_STORAGE)
            this.adminKey = ''
            this.errorMessage = '管理员口令错误'
            return
          }

          this.errorMessage = result.error || `导入失败(${response.status})`
          return
        }

        const summary = result.summary || {}
        this.message = `导入完成：总行数 ${summary.totalRows || 0}，更新 ${summary.updated || 0}，空id ${summary.skippedEmptyId || 0}，无效id ${summary.skippedInvalidId || 0}，未找到 ${summary.skippedNotFound || 0}`
      } catch (error) {
        this.errorMessage = `导入失败：${error?.message || '网络异常'}`
      } finally {
        this.uploading = false
      }
    }
  }
}
</script>

<style scoped>
.import-page {
  min-height: 100vh;
  padding: 24px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 10% 10%, rgba(0, 183, 235, 0.2), transparent 32%),
    linear-gradient(180deg, #f6f7f1 0%, #eef3f6 100%);
}

.import-card {
  width: min(560px, 100%);
  border-radius: 18px;
  padding: 28px;
  background: #ffffff;
  border: 1px solid #d8e8ef;
  box-shadow: 0 16px 40px rgba(36, 52, 71, 0.12);
}

h1 {
  margin: 0;
  font-size: 28px;
  color: #183153;
}

.desc {
  margin: 10px 0 20px;
  color: #5f6f82;
  line-height: 1.6;
}

.upload-btn {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  background: #00b7eb;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hidden-file-input {
  display: none;
}

.message {
  margin-top: 16px;
  color: #136f46;
}

.error {
  margin-top: 16px;
  color: #b42318;
}
</style>
