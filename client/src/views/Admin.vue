<template>
  <div class="admin-page">
    <div class="admin-shell">
      <div class="admin-header">
        <button
          v-if="isAuthorized"
          class="mobile-menu-btn"
          type="button"
          aria-label="打开菜单"
          @click="openMobileMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div>
          <h1>StarPlus 后台</h1>
          <p>仅管理员可查看调查提交数据</p>
        </div>
      </div>

      <div v-if="!isAuthorized" class="login-card">
        <p v-if="errorMessage" class="error-text login-error">{{ errorMessage }}</p>
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
        <div class="admin-layout">
          <aside class="side-menu desktop-side-menu">
            <button class="menu-item" :class="{ 'menu-item-active': activeView === 'records' }" @click="setActiveView('records')">
              提交记录
            </button>
            <button class="menu-item" :class="{ 'menu-item-active': activeView === 'analytics' }" @click="setActiveView('analytics')">
              数据分析
            </button>
            <button class="menu-item" :disabled="exporting" @click="exportExcel">
              {{ exporting ? '导出中...' : '导出EXCEL' }}
            </button>
            <button class="menu-item" @click="openChangePasswordModal">更改管理员密码</button>
            <button class="menu-item menu-item-danger" @click="logout">退出</button>
          </aside>

          <div class="admin-content">


            <div v-if="activeView === 'records' && !loading" class="property-filter">
              <label class="property-filter-label" for="property-filter">物业筛选</label>
              <select
                id="property-filter"
                v-model="selectedProperty"
                class="property-filter-select"
              >
                <option value="">全部物业</option>
                <option v-for="name in propertyOptions" :key="name" :value="name">
                  {{ name }}
                </option>
              </select>
            </div>

            <div v-if="activeView === 'records' && isAuthorized && !loading" class="stats-panel">
              <div class="stat-card">
                <div class="stat-label">记录数</div>
                <div class="stat-value">{{ total }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">不满意率</div>
                <div class="stat-value">
                  {{ Math.round(dissatisfactionRate) }}<span class="stat-percent">%</span>
                </div>
              </div>
            </div>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
            <p v-if="loading" class="meta">正在加载...</p>


            <div v-if="activeView === 'records' && !loading && totalPages > 0" class="pagination">
              <button class="pagination-btn" @click="previousPage" :disabled="currentPage <= 1">
                <span aria-label="上一页">←</span>
              </button>
              <div class="pagination-info">
                <span>{{ currentPage }} / {{ totalPages }} </span>
                <span class="page-divider">|</span>
                <span>{{ total }}</span>
              </div>
              <button class="pagination-btn" @click="nextPage" :disabled="currentPage >= totalPages">
                <span aria-label="下一页">→</span>
              </button>
            </div>

            <div v-if="activeView === 'records' && !loading" class="records-table-wrap">
              <table class="records-table">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>区域</th>
                    <th>整体满意度</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="submissions.length === 0">
                    <td colspan="3" class="empty-cell">暂无记录</td>
                  </tr>
                  <tr
                    v-for="item in submissions"
                    :key="item.id"
                    class="records-row"
                    @click="openSubmissionDetail(item)"
                  >
                    <td>{{ getDisplayValue(item, ['姓名', 'name']) }}</td>
                    <td>{{ getDisplayValue(item, ['区域', 'area']) }}</td>
                    <td>{{ getDisplayValue(item, ['1.1 整体满意度', '1.1整体满意度']) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="activeView === 'analytics' && !loading" class="analytics-page">
              <div class="analytics-property-filter">
                <button
                  v-for="item in analyticsPropertyButtons"
                  :key="item.value || 'all'"
                  class="analytics-property-btn"
                  :class="{ 'analytics-property-btn-active': selectedProperty === item.value }"
                  type="button"
                  @click="selectAnalyticsProperty(item.value)"
                >
                  {{ item.label }}
                </button>
              </div>

              <div class="analytics-card pie-card">
                <div class="analytics-card-title">1.1 问题答案分布（数量/占比）</div>
                <div class="pie-layout">
                  <div class="pie-chart" :style="{ background: pieChartBackground }" aria-label="1.1问题答案占比饼图"></div>
                  <div class="pie-legend">
                    <div v-for="item in oneOneStats" :key="item.answer" class="pie-legend-item">
                      <span class="legend-dot" :style="{ background: getAnswerColor(item.answer) }"></span>
                      <span class="legend-answer">{{ item.answer }}</span>
                      <span class="legend-count">{{ item.count }}</span>
                      <span class="legend-rate">{{ item.percentage }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="analytics-card bar-card">
                <div class="analytics-card-title">各题目答案数量对比（横向柱状图）</div>
                <div class="question-bars">
                  <div v-for="question in questionStats" :key="question.key" class="question-block">
                    <div class="question-title">{{ question.label }}</div>
                    <div v-for="answer in answerOptions" :key="`${question.key}-${answer}`" class="answer-row">
                      <div class="answer-name">{{ answer }}</div>
                      <div class="answer-track">
                        <div
                          class="answer-fill"
                          :style="{
                            width: getBarWidth(question.counts[answer] || 0),
                            background: getAnswerColor(answer)
                          }"
                        ></div>
                      </div>
                      <div class="answer-value">{{ question.counts[answer] || 0 }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="showMobileMenu" class="menu-overlay" @click.self="closeMobileMenu">
          <div class="menu-drawer">
            <h3>后台菜单</h3>
            <button class="mobile-menu-item" @click="setActiveView('records')">
              <svg class="mobile-menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 5h16M4 12h16M4 19h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>提交记录</span>
            </button>
            <button class="mobile-menu-item" @click="setActiveView('analytics')">
              <svg class="mobile-menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M7 18V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M12 18V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M17 18v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>数据分析</span>
            </button>
            <button class="mobile-menu-item" :disabled="exporting" @click="exportExcel">
              <svg class="mobile-menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M8 10.5L12 14.5L16 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4 16.5v1.5A2 2 0 0 0 6 20h12a2 2 0 0 0 2-2v-1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>{{ exporting ? '导出中...' : '导出EXCEL' }}</span>
            </button>
            <button class="mobile-menu-item" @click="openChangePasswordModal">
              <svg class="mobile-menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" stroke-width="2" />
                <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>更改管理员密码</span>
            </button>
            <button class="mobile-menu-item mobile-menu-item-danger" @click="logout">
              <svg class="mobile-menu-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 17l5-5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15 12H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M20 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>退出</span>
            </button>
          </div>
        </div>

        <div v-if="showChangePasswordModal" class="password-modal-overlay" @click.self="closeChangePasswordModal">
          <div class="password-modal">
            <h3>修改管理员密码</h3>
            <p class="password-modal-tip">请输入原密码并设置新密码</p>

            <label class="field-label" for="old-password">原密码</label>
            <input
              id="old-password"
              v-model="oldPassword"
              class="text-input"
              type="password"
              placeholder="请输入原密码"
            />

            <label class="field-label" for="new-password">新密码</label>
            <input
              id="new-password"
              v-model="newPassword"
              class="text-input"
              type="password"
              placeholder="至少6位"
            />

            <label class="field-label" for="confirm-password">确认新密码</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              class="text-input"
              type="password"
              placeholder="请再次输入新密码"
              @keyup.enter="submitPasswordChange"
            />

            <p v-if="passwordChangeError" class="error-text password-modal-error">{{ passwordChangeError }}</p>
            <p v-if="passwordChangeSuccess" class="password-modal-success">{{ passwordChangeSuccess }}</p>

            <div class="password-modal-actions">
              <button class="ghost-btn" @click="closeChangePasswordModal">取消</button>
              <button class="primary-btn" :disabled="changingPassword" @click="submitPasswordChange">
                {{ changingPassword ? '提交中...' : '确认修改' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="showSubmissionDetailModal" class="detail-modal-overlay" @click.self="closeSubmissionDetail">
          <div class="detail-modal">
            <div class="detail-modal-header">
              <h3>提交记录详情</h3>
              <button class="detail-close-btn" @click="closeSubmissionDetail">关闭</button>
            </div>
            <div class="detail-grid">
              <div v-for="entry in getEntries(selectedSubmission || {})" :key="entry.key" class="detail-row">
                <div class="detail-key">{{ entry.key }}</div>
                <div class="detail-value">{{ formatValue(entry.value) }}</div>
              </div>
            </div>
          </div>
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
      exporting: false,
      errorMessage: '',
      currentPage: 1,
      pageSize: 50,
      total: 0,
      totalPages: 0,
      activeView: 'records',
      selectedProperty: '',
      propertyOptions: [
        '星扬西岸中心',
        '星瀚广场',
        '星寰国际商业中心',
        '北京环球金融中心',
        '688广场',
        '恒基名人商业大厦',
        '恒汇国际大厦',
        '环智国际大厦'
      ],
      dissatisfactionRate: 0,
      answerOptions: ['非常不满意', '不满意', '一般', '满意', '非常满意'],
      answerColors: {
        '非常不满意': '#ca2f1a',
        '不满意': '#f06a2f',
        '一般': '#f5c542',
        '满意': '#35a76f',
        '非常满意': '#15803d'
      },
      oneOneStats: [],
      questionStats: [],
      showChangePasswordModal: false,
      showMobileMenu: false,
      showSubmissionDetailModal: false,
      selectedSubmission: null,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      changingPassword: false,
      passwordChangeError: '',
      passwordChangeSuccess: ''
      
    }
  },
  mounted() {
    if (this.adminKey) {
      this.loadSubmissions()
    }
  },
  watch: {
    selectedProperty() {
      if (this.isAuthorized) {
        if (this.activeView === 'analytics') {
          this.loadAnalytics()
        } else {
          this.loadSubmissions(1)
        }
      }
    }
  },
  computed: {
    pieChartBackground() {
      const total = this.oneOneStats.reduce((sum, item) => sum + (item.count || 0), 0)
      if (!total) {
        return 'conic-gradient(#d9e4ec 0deg 360deg)'
      }

      let start = 0
      const segments = this.oneOneStats.map((item) => {
        const degree = (item.count / total) * 360
        const end = start + degree
        const color = this.getAnswerColor(item.answer)
        const segment = `${color} ${start.toFixed(1)}deg ${end.toFixed(1)}deg`
        start = end
        return segment
      })

      return `conic-gradient(${segments.join(', ')})`
    },
    maxAnswerCount() {
      let maxCount = 0
      for (const question of this.questionStats) {
        for (const answer of this.answerOptions) {
          const count = question.counts?.[answer] || 0
          if (count > maxCount) {
            maxCount = count
          }
        }
      }
      return maxCount
    },
    analyticsPropertyButtons() {
      return [
        { label: '全部', value: '' },
        ...this.propertyOptions.map((name) => ({ label: name, value: name }))
      ]
    }
  },
  methods: {

    //比如标题是 1.1 客服/礼宾台员工仪容仪表，应该排在 1.2 晨间迎宾服务及指引前面
    compareQuestionKey(a, b) {


      var no_num_order= ['ip','createdAt','updatedAt','物业','姓名','手机号','单元','公司','调查日期','区域'];

      if(no_num_order.includes(a) &&  no_num_order.includes(b)) {
        return no_num_order.indexOf(a) - no_num_order.indexOf(b);

      }


      if (no_num_order.includes(a) && !no_num_order.includes(b)) return -1;
      if (!no_num_order.includes(a) && no_num_order.includes(b)) return 1;



      const matchA = String(a).match(/^(\d+(?:\.\d+)*)/);
      const matchB = String(b).match(/^(\d+(?:\.\d+)*)/);

      

      if (matchA && matchB) {
        const partsA = matchA[1].split('.').map(Number);
        const partsB = matchB[1].split('.').map(Number);
        const maxLen = Math.max(partsA.length, partsB.length);

        for (let i = 0; i < maxLen; i += 1) {
          const valueA = partsA[i] ?? -1;
          const valueB = partsB[i] ?? -1;
          if (valueA !== valueB) {
            return valueA - valueB;
          }
        }

        return String(a).localeCompare(String(b), 'zh-Hans-CN');
      }

      if (matchA && !matchB) return -1;
      if (!matchA && matchB) return 1;

      return String(a).localeCompare(String(b), 'zh-Hans-CN');
    },

    formatData(mergedData){


      const entries = [];

      const questionKeys = Object.keys(mergedData)
        .filter((key) => key !== 'submissionId')
        .sort((a, b) => this.compareQuestionKey(a, b));

      for (const key of questionKeys) {
        entries.push([key, mergedData[key]]);
      }


      return Object.fromEntries(entries);


    },
    
    buildApiUrl(endpoint) {
      const base = this.apiBase.endsWith('/') ? this.apiBase.slice(0, -1) : this.apiBase
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      return new URL(`${base}${path}`, window.location.origin)
    },
    setActiveView(view) {
      this.activeView = view
      this.closeMobileMenu()

      if (view === 'analytics') {
        this.loadAnalytics()
      } else if (this.isAuthorized) {
        this.loadSubmissions(this.currentPage)
      }
    },
    selectAnalyticsProperty(property) {
      this.selectedProperty = property
    },
    async loadSubmissions(page = 1) {
      if (!this.adminKey) {
        this.errorMessage = '请输入管理员口令'
        return
      }

      const targetPage = Number.isFinite(Number(page)) ? Math.max(1, Number(page)) : 1

      this.loading = true
      this.errorMessage = ''
      this.currentPage = targetPage

      try {
        const url = this.buildApiUrl('/submissions')
        url.searchParams.set('page', targetPage)
        url.searchParams.set('pageSize', this.pageSize)
        if (this.selectedProperty) {
          url.searchParams.set('property', this.selectedProperty)
        }

        const response = await fetch(url.toString(), {
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

        const result = await response.json()
        this.submissions = result.data || []
        this.total = result.total || 0
        this.totalPages = result.totalPages || 0
        this.isAuthorized = true
        sessionStorage.setItem(ADMIN_KEY_STORAGE, this.adminKey)
        this.loadStats()
      } catch (error) {
        this.isAuthorized = false
        this.errorMessage = `读取失败：${error?.message || '网络异常'}`
      } finally {
        this.loading = false
      }
    },
    async loadAnalytics() {
      if (!this.adminKey) {
        return
      }

      this.loading = true
      this.errorMessage = ''

      try {
        const url = this.buildApiUrl('/analytics')
        if (this.selectedProperty) {
          url.searchParams.set('property', this.selectedProperty)
        }

        const response = await fetch(url.toString(), {
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
          this.errorMessage = `读取分析失败(${response.status})：${errText || '请稍后重试'}`
          return
        }

        const data = await response.json()
        this.oneOneStats = data.oneOne || []
        this.questionStats = data.questions || []
        this.isAuthorized = true
        sessionStorage.setItem(ADMIN_KEY_STORAGE, this.adminKey)
      } catch (error) {
        this.errorMessage = `读取分析失败：${error?.message || '网络异常'}`
      } finally {
        this.loading = false
      }
    },
    async loadStats() {
      if (!this.adminKey) {
        return
      }

      try {
        const url = this.buildApiUrl('/stats')
        if (this.selectedProperty) {
          url.searchParams.set('property', this.selectedProperty)
        }

        const response = await fetch(url.toString(), {
          headers: {
            'x-admin-key': this.adminKey
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.dissatisfactionRate = data.dissatisfactionRate || 0
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.loadSubmissions(page)
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.goToPage(this.currentPage - 1)
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1)
      }
    },
    openMobileMenu() {
      this.showMobileMenu = true
    },
    closeMobileMenu() {
      this.showMobileMenu = false
    },
    openChangePasswordModal() {
      this.closeMobileMenu()
      this.passwordChangeError = ''
      this.passwordChangeSuccess = ''
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmPassword = ''
      this.showChangePasswordModal = true
    },
    openSubmissionDetail(item) {
      this.selectedSubmission = item
      this.showSubmissionDetailModal = true
    },
    closeSubmissionDetail() {
      this.showSubmissionDetailModal = false
      this.selectedSubmission = null
    },
    closeChangePasswordModal() {
      this.showChangePasswordModal = false
      this.changingPassword = false
      this.passwordChangeError = ''
      this.passwordChangeSuccess = ''
    },
    async submitPasswordChange() {
      const oldPassword = this.oldPassword.trim()
      const newPassword = this.newPassword.trim()
      const confirmPassword = this.confirmPassword.trim()

      this.passwordChangeError = ''
      this.passwordChangeSuccess = ''

      if (!oldPassword || !newPassword || !confirmPassword) {
        this.passwordChangeError = '请完整填写密码信息'
        return
      }

      if (newPassword.length < 6) {
        this.passwordChangeError = '新密码至少需要6位'
        return
      }

      if (newPassword !== confirmPassword) {
        this.passwordChangeError = '两次输入的新密码不一致'
        return
      }

      this.changingPassword = true

      try {
        const response = await fetch(`${this.apiBase}/admin/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': this.adminKey
          },
          body: JSON.stringify({
            oldPassword,
            newPassword
          })
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          this.passwordChangeError = result.error || `修改失败(${response.status})`
          return
        }

        this.adminKey = newPassword
        sessionStorage.setItem(ADMIN_KEY_STORAGE, newPassword)
        this.passwordChangeSuccess = '密码修改成功'

        setTimeout(() => {
          this.closeChangePasswordModal()
        }, 600)
      } catch (error) {
        this.passwordChangeError = `修改失败：${error?.message || '网络异常'}`
      } finally {
        this.changingPassword = false
      }
    },
    logout() {
      this.closeMobileMenu()
      sessionStorage.removeItem(ADMIN_KEY_STORAGE)
      this.adminKey = ''
      this.isAuthorized = false
      this.activeView = 'records'
      this.submissions = []
      this.oneOneStats = []
      this.questionStats = []
      this.selectedProperty = ''
      this.errorMessage = ''
      this.closeSubmissionDetail()
      this.closeChangePasswordModal()
    },
    async exportExcel() {
      if (!this.adminKey) {
        this.errorMessage = '请输入管理员口令'
        return
      }

      this.closeMobileMenu()
      this.errorMessage = ''
      this.exporting = true

      try {
        const response = await fetch(`${this.apiBase}/download`, {
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
          this.errorMessage = `导出失败(${response.status})：${errText || '请稍后重试'}`
          return
        }

        const blob = await response.blob()
        const disposition = response.headers.get('content-disposition') || ''
        const fileNameMatch = disposition.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i)
        const rawFileName = decodeURIComponent(fileNameMatch?.[1] || fileNameMatch?.[2] || '').trim()
        const fileName = rawFileName || `submissions-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      } catch (error) {
        this.errorMessage = `导出失败：${error?.message || '网络异常'}`
      } finally {
        this.exporting = false
      }
    },
    getDisplayValue(item, keys) {
      for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          return this.formatValue(item[key])
        }
      }

      return '-'
    },
    getEntries(item) {
      return Object.entries(item)
        .filter(([key]) => key !== '_id' && key !== 'id')
        .sort(([keyA], [keyB]) => this.compareQuestionKey(keyA, keyB))
        .map(([key, value]) => {
          const displayKey =  key
          return { key: displayKey, value }
        })
    },
    formatValue(value) {
      if (Array.isArray(value)) {
        return value.join(' / ')
      }

      if (value && typeof value === 'object') {
        return JSON.stringify(value)
      }

      return value === '' ? '-' : value
    },
    getAnswerColor(answer) {
      return this.answerColors[answer] || '#6b7b8f'
    },
    getBarWidth(value) {
      const maxValue = this.maxAnswerCount
      if (!maxValue || value <= 0) {
        return '0%'
      }
      return `${Math.max(4, (value / maxValue) * 100)}%`
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
    min-width:320px;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-icon {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
}

.primary-btn:disabled,
.ghost-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary-btn {
  background: #00b7eb;
  color: #fff;
}

.ghost-btn {
  background: #edf4f7;
  color: #183153;
}

.admin-layout {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 18px;
}

.side-menu {
  width: 188px;
  flex: 0 0 188px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: #eff6fb;
  border: 1px solid #d4e4ef;
}

.admin-content {
  flex: 1;
  min-width: 0;
}

.menu-item {
  border: 1px solid #b4c9d9;
  background: #fff;
  color: #183153;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover:not(:disabled) {
  background: #e8f4fb;
  border-color: #8ab3cd;
}

.menu-item-active {
  background: #d9f0fb;
  border-color: #4ea7d2;
  color: #0f4668;
}

.menu-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.menu-item-danger {
  color: #b42318;
  border-color: #efc2be;
}

.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  border: 1px solid #b8cad8;
  border-radius: 12px;
  background: #fff;
  padding: 9px 10px;
  margin-right: 10px;
  cursor: pointer;
}

.mobile-menu-btn span {
  display: block;
  width: 100%;
  height: 2px;
  background: #1a3a56;
  border-radius: 999px;
}

.mobile-menu-btn span + span {
  margin-top: 6px;
}

.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  z-index: 1100;
}

.menu-drawer {
  width: min(260px, 88vw);
  height: 100%;
  background: #f7fbfd;
  border-right: 1px solid #d4e4ef;
  padding: 18px 14px;
  box-shadow: 14px 0 40px rgba(26, 45, 66, 0.24);
}

.menu-drawer h3 {
  margin: 0 0 14px;
  color: #183153;
  font-size: 20px;
}

.mobile-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  border-bottom: 1px solid #d6e4ee;
  background: transparent;
  color: #183153;
  padding: 12px 2px;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}

.mobile-menu-item:last-child {
  border-bottom: none;
}

.mobile-menu-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mobile-menu-item-danger {
  color: #b42318;
}

.mobile-menu-icon {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
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

.login-error {
  margin-top: 0;
  margin-bottom: 10px;
}

.records-table-wrap {
  border: 1px solid #dbe8ef;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th,
.records-table td {
  padding: 12px 18px;
  border-bottom: 1px solid #edf3f7;
  text-align: left;
  vertical-align: top;
}

.records-table th {
  color: #183153;
  background: #f3f8fc;
  font-weight: 700;
}

.records-table td {
  color: #344054;
  word-break: break-word;
}

.records-table tr:last-child td {
  border-bottom: none;
}

.records-row {
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.records-row:hover td {
  background: #f4faff;
}

.empty-cell {
  text-align: center;
  color: #627388;
}

.property-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 13px 14px;
  border: 2px solid #67b9de;
  border-radius: 14px;
  background: linear-gradient(120deg, #ecf9ff 0%, #f6fcff 100%);
  box-shadow: 0 8px 20px rgba(0, 122, 188, 0.12);
}

.property-filter-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #114368;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.2px;
  background: #dff4ff;
  border: 1px solid #9ed2ea;
  padding: 6px 10px;
  border-radius: 999px;
}

.property-filter-label::before {
  content: '⏷';
  color: #0f6c9b;
  font-size: 12px;
}

.property-filter-select {
  flex: 1;
  min-width: 0;
  padding: 9px 12px;
  border: 2px solid #7bbddb;
  border-radius: 8px;
  background: #fff;
  color: #183153;
  font-size: 14px;
  font-weight: 600;
  box-shadow: inset 0 1px 2px rgba(16, 71, 106, 0.08);
}

.property-filter-select:focus {
  outline: none;
  border-color: #1693c9;
  box-shadow:
    inset 0 1px 2px rgba(16, 71, 106, 0.08),
    0 0 0 3px rgba(22, 147, 201, 0.18);
}

.pagination {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 14px 16px;
  background: #f8fbfd;
  border: 1px solid #e0eaf2;
  border-radius: 12px;
}

.pagination > :first-child {
  justify-self: start;
}

.pagination > :last-child {
  justify-self: end;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #8fa6b8;
  border-radius: 8px;
  background: #fff;
  color: #183153;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #e3f1f7;
  border-color: #5a8fb8;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #627388;
}

.page-divider {
  color: #bec8d1;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.analytics-page {
  display: grid;
  gap: 18px;
}

.analytics-property-filter {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.analytics-property-btn {
  min-height: 46px;
  border: 1px solid #abc5d7;
  border-radius: 10px;
  background: #f7fbfe;
  color: #173954;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.analytics-property-btn:hover {
  border-color: #449cc8;
  background: #e9f6fd;
}

.analytics-property-btn-active {
  border-color: #0f88be;
  background: linear-gradient(135deg, #d8f1ff 0%, #e6f7ff 100%);
  color: #0f4668;
  box-shadow: 0 6px 14px rgba(15, 136, 190, 0.18);
}

.analytics-card {
  border: 1px solid #dbe8ef;
  border-radius: 16px;
  background: #ffffff;
  padding: 16px;
}

.analytics-card-title {
  margin: 0 0 12px;
  color: #183153;
  font-size: 16px;
  font-weight: 700;
}

.pie-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  align-items: center;
}

.pie-chart {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 10px solid #f2f7fb;
  box-sizing: border-box;
}

.pie-legend {
  display: grid;
  gap: 8px;
}

.pie-legend-item {
  display: grid;
  grid-template-columns: 14px minmax(88px, 1fr) 56px 60px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f7fbfd;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-answer,
.legend-count,
.legend-rate {
  color: #1a3a56;
  font-size: 13px;
  text-align: left;
}

.question-bars {
  display: grid;
  gap: 12px;
}

.question-block {
  border: 1px solid #e1ebf2;
  border-radius: 12px;
  padding: 12px;
}

.question-title {
  color: #0f4568;
  font-weight: 700;
  margin-bottom: 10px;
}

.answer-row {
  display: grid;
  grid-template-columns: 88px 1fr 48px;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.answer-row:last-child {
  margin-bottom: 0;
}

.answer-name,
.answer-value {
  font-size: 12px;
  color: #314a63;
  text-align: left;
}

.answer-track {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: #e8f1f7;
  overflow: hidden;
}

.answer-fill {
  height: 100%;
  border-radius: 999px;
}

.stat-card {
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #00b7eb 0%, #0088cc 100%);
  box-shadow: 0 8px 24px rgba(0, 183, 235, 0.25);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  line-height: 1.5;
}

.stat-value {
  font-size: 42px;
  color: #ffffff;
  font-weight: 700;
  line-height: 1.2;
}

.stat-percent {
  font-size: 21px;
}

.password-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.password-modal {
  width: min(460px, 100%);
  background: #fff;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 20px 42px rgba(20, 39, 61, 0.22);
}

.password-modal h3 {
  margin: 0 0 6px;
  color: #183153;
  font-size: 22px;
}

.password-modal-tip {
  margin: 0 0 14px;
  color: #627388;
  font-size: 13px;
}

.password-modal-error {
  margin-bottom: 10px;
}

.password-modal-success {
  margin: 0 0 10px;
  color: #067647;
  font-size: 14px;
}

.password-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.detail-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 16px;
}

.detail-modal {
  width: min(760px, 100%);
  max-height: 86vh;
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 22px 50px rgba(20, 39, 61, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  z-index: 1000;
    position: absolute;
    top: 30px;
    
}

.detail-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.detail-modal-header h3 {
  margin: 0;
  color: #183153;
  font-size: 22px;
}

.detail-close-btn {
  border: 1px solid #c3d4e2;
  background: #f5fafc;
  color: #183153;
  border-radius: 9px;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}

.detail-grid {
  border: 1px solid #dbe8ef;
  border-radius: 12px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #edf3f7;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-key,
.detail-value {
  padding: 12px 15px;
  font-size: 14px;
  text-align: left;
}

.detail-key {
  flex: 0 0 200px;
  background: #f4f9fc;
  color: #183153;
  font-weight: 700;
  border-right: 1px solid #edf3f7;
}

.detail-value {
  flex: 1;
  color: #344054;
  word-break: break-word;
}

@media (max-width: 768px) {
  .admin-shell {
    padding: 18px;
  }

  .admin-header,
  .admin-layout {
    flex-direction: column;
    align-items: stretch;
  }

  .mobile-menu-btn {
    display: inline-block;
  }

  .desktop-side-menu {
    display: none;
  }

  .records-table th,
  .records-table td {
    padding: 10px 12px;
    font-size: 13px;
  }

  .property-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .records-table th {
    white-space: nowrap;
  }

  .pie-layout {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .pie-legend {
    width: 100%;
  }

  .pie-legend-item {
    grid-template-columns: 14px minmax(70px, 1fr) 50px 50px;
    gap: 8px;
  }

  .answer-row {
    grid-template-columns: 74px 1fr 40px;
    gap: 8px;
  }

  .detail-row {
    flex-wrap: wrap;
  }

  .detail-key {
    flex: 0 0 auto;
    border-right: none;
    border-bottom: 1px solid #edf3f7;
  }
}

@media (max-width: 480px) {
  .records-table th:nth-child(3),
  .records-table td:nth-child(3) {
    display: none;
  }

  .admin-header h1 {
    font-size: 26px;
  }
}
</style>