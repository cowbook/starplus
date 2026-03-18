<template>
  <div class="admin-page">
    <div class="admin-shell">
      <div class="admin-header">
        <div>
          <h1>提交记录后台</h1>
          <p>仅管理员可查看调查提交数据</p>
        </div>
        <button v-if="isAuthorized" class="ghost-btn" @click="logout">退出</button>
      </div>

      <div v-if="!isAuthorized" class="login-card">
        <label class="field-label" for="admin-key">管理员口令</label>
        <input
          id="admin-key"
          v-model="adminKey"
          class="text-input"
          type="password"
          placeholder="请输入管理员口令"
          @keyup.enter="loadSubmissions"
        />
        <button class="primary-btn" @click="loadSubmissions">进入后台</button>
      </div>

      <div v-else>
        <div class="toolbar">
          <button class="primary-btn" @click="loadSubmissions">刷新数据</button>
          <span class="meta">共 {{ submissions.length }} 条记录</span>
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        <p v-if="loading" class="meta">正在加载...</p>

        <div v-for="item in submissions" :key="item.id" class="submission-card">
          <div class="submission-top">
            <span class="submission-id">{{ item.id }}</span>
            <span class="submission-meta">{{ item.createdAt }} / {{ item.ip || 'unknown ip' }}</span>
          </div>

          <table class="submission-table">
            <tbody>
              <tr v-for="entry in getEntries(item)" :key="`${item.id}-${entry.key}`">
                <th>{{ entry.key }}</th>
                <td>{{ formatValue(entry.value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ADMIN_KEY_STORAGE = 'starplus-admin-key'

export default {
  name: 'Admin',
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
      isAuthorized: false,
      submissions: [],
      loading: false,
      errorMessage: ''
    }
  },
  mounted() {
    if (this.adminKey) {
      this.loadSubmissions()
    }
  },
  methods: {
    async loadSubmissions() {
      if (!this.adminKey) {
        this.errorMessage = '请输入管理员口令'
        return
      }

      this.loading = true
      this.errorMessage = ''

      try {
        const response = await fetch(`${this.apiBase}/submissions`, {
          headers: {
            'x-admin-key': this.adminKey
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            this.errorMessage = '管理员口令错误'
            sessionStorage.removeItem(ADMIN_KEY_STORAGE)
            this.isAuthorized = false
            return
          }

          const errText = await response.text()
          this.isAuthorized = false
          this.errorMessage = `读取失败(${response.status})：${errText || '请稍后重试'}`
          return
        }

        this.submissions = await response.json()
        this.isAuthorized = true
        sessionStorage.setItem(ADMIN_KEY_STORAGE, this.adminKey)
      } catch (error) {
        this.isAuthorized = false
        this.errorMessage = `读取失败：${error?.message || '网络异常'}`
      } finally {
        this.loading = false
      }
    },
    logout() {
      sessionStorage.removeItem(ADMIN_KEY_STORAGE)
      this.adminKey = ''
      this.isAuthorized = false
      this.submissions = []
      this.errorMessage = ''
    },
    getEntries(item) {
      return Object.entries(item)
        .filter(([key]) => key !== '_id' && key !== 'id')
        .map(([key, value]) => ({ key, value }))
    },
    formatValue(value) {
      if (Array.isArray(value)) {
        return value.join(' / ')
      }

      if (value && typeof value === 'object') {
        return JSON.stringify(value)
      }

      return value === '' ? '-' : value
    }
  }
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 32px 20px 48px;
  background:
    radial-gradient(circle at top left, rgba(0, 183, 235, 0.18), transparent 28%),
    linear-gradient(180deg, #f6f7f1 0%, #eef3f6 100%);
}

.admin-shell {
  max-width: 1080px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 48px rgba(36, 52, 71, 0.12);
  backdrop-filter: blur(10px);
}

.admin-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.admin-header h1 {
  margin: 0;
  font-size: 30px;
  color: #183153;
}

.admin-header p {
  margin: 8px 0 0;
  color: #5f6f82;
}

.login-card {
  max-width: 380px;
  padding: 24px;
  border-radius: 18px;
  background: #f7fbfd;
  border: 1px solid #d8e8ef;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  color: #183153;
  font-weight: 600;
}

.text-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  margin-bottom: 14px;
  border: 1px solid #c7d8e2;
  border-radius: 12px;
  font-size: 15px;
}

.primary-btn,
.ghost-btn {
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
}

.primary-btn {
  background: #00b7eb;
  color: #fff;
}

.ghost-btn {
  background: #edf4f7;
  color: #183153;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}

.meta {
  color: #627388;
  font-size: 14px;
}

.error-text {
  color: #b42318;
  font-size: 14px;
  margin-bottom: 16px;
}

.submission-card {
  margin-bottom: 20px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #dbe8ef;
  background: #fff;
}

.submission-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(90deg, #183153 0%, #24527a 100%);
  color: #fff;
}

.submission-id {
  font-weight: 600;
}

.submission-meta {
  font-size: 13px;
  opacity: 0.86;
}

.submission-table {
  width: 100%;
  border-collapse: collapse;
}

.submission-table th,
.submission-table td {
  padding: 12px 18px;
  border-top: 1px solid #edf3f7;
  text-align: left;
  vertical-align: top;
}

.submission-table th {
  width: 240px;
  color: #183153;
  background: #f8fbfd;
}

.submission-table td {
  color: #344054;
  word-break: break-word;
}

@media (max-width: 768px) {
  .admin-shell {
    padding: 18px;
  }

  .admin-header,
  .submission-top,
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .submission-table th,
  .submission-table td {
    display: block;
    width: auto;
  }

  .submission-table th {
    border-bottom: none;
    padding-bottom: 6px;
  }

  .submission-table td {
    padding-top: 0;
  }
}
</style>