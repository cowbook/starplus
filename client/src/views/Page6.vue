<template>
    <div v-if="assetsReady" class="page6 appear-container">

      <header class="segment appear-item" data-delay="0.1">

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

      <transition :name="innerTransitionName" mode="out-in">
        <div :key="$route.path" class="page6-inner-view appear-item" data-delay="0.2">

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

        <div class="h3" :class="{ 'even': index  % 2 === 1,'color1': (index + questionIndex) % 3 === 1,'color2': (index + questionIndex) % 3 === 2 ,'color3': (index + questionIndex) % 3 === 0 }">
          <div class="sy">
            {{ item.title }}   <span style="font-size:10px">{{ item.small || '' }}</span>
          </div>
          <div class="item-desc">
            {{ item.title_en }}
          </div>
        </div>
        
        <div class="row">

            <textarea class="item-textarea" v-if="item.control==='textarea'" v-model="item.value" placeholder="请输入您的意见..."></textarea>


            <div v-else-if="item.control==='multiple'" class="option-group" style="flex-wrap: wrap;">

                <label v-for="(o,ind) in item.options" :key="'opt-' + index + '-' + ind "  class="option-item-multiple" :for="'opt-' + index + '-' + ind">
                  <input type="checkbox" v-model="item.value" :value="o" alt="选项1" :id="'opt-' + index + '-' + ind " />
                   {{o}}
                  <div style="position:absolute;margin-top:32px;font-size:8px;margin-left:0px;letter-spacing:-0.3px;">
                    {{item.options_en[ind]}}
                  </div>
                 
                </label>
            </div>

            <div v-else-if="item.title.indexOf('8.1')>=0" class="option-group" style="flex-wrap: wrap;">

                 <label style="margin-bottom:8px;width:120px;margin-top:10px" v-for="(o,ind) in item.options" :key="'opt-' + index + '-' + ind "  class="option-item" :for="'opt-' + index + '-' + ind">
                  <input type="radio" v-model="item.value" :value="o" alt="选项1" :name="'opt-' + index"  :id="'opt-' + index + '-' + ind " />
                  <span></span>
                   {{o}}
                  <div class="opt-en">
                    {{item.options_en[ind]}}
                  </div>
                 
                </label>
            </div>

            <div v-else class="option-group">

                <label v-for="(o,ind) in item.options" :key="'opt-' + index + '-' + ind "  class="option-item" :for="'opt-' + index + '-' + ind">
                  <input type="radio" v-model="item.value" :value="o" alt="选项1" :name="'opt-' + index"  :id="'opt-' + index + '-' + ind " />
                  <span></span>
                   {{o}}
                  <div class="opt-en-n">
                    {{item.options_en[ind]}}
                  </div>
                 
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



      <div class="segment" v-if = "currentPage == 25">
        <div class="row">

          <div class="blue-btn" @click="p6_goNext(-1)">
                上一页
          </div>

          <div class="blue-btn" @click="submitForm()">
                提交
          </div>

          <div class="blue-btn" @click="PreviewForm()">
                预览
          </div>

        
        </div>
      </div>

      <div class="segment" v-else>
        <div class="row">

          <div class="blue-btn-l" @click="p6_goNext(-1)">
                上一页
          </div>

          <div class="blue-btn-l" @click="p6_goNext(1)">
                下一页
          </div>
        </div>
      </div>

        </div>
      </transition>




      



    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <p>{{ message }}</p>
          <button class="modal-btn" @click="onModalConfirm">确定</button>
        </div>
      </div>

      <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
        <div class="modal-content preview-modal-content" @click.stop>
          <h3 class="preview-title">问卷预览</h3>
          <div class="preview-list">
            <div v-for="(row, idx) in previewRows" :key="`${idx}-${row.question}`" class="preview-item">
              <div class="preview-question">{{ row.question }}</div>
              <div class="preview-answer">{{ row.answer }}</div>
            </div>
          </div>
          <button class="modal-btn" @click="closePreviewModal">关闭</button>
        </div>
      </div>
    </teleport>



    <!--
  


        -->
  </div>

  <div v-else class="page6 page6-loading">
    <div class="loading-text">页面资源加载中...</div>
  </div>
</template>

<script>

import { useFormStore } from '../stores/form';


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
    const hostname = window.location.hostname;
    const isLocalHost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

    return {
      apiBase:
        import.meta.env.VITE_API_URL ||
        (isLocalHost
          ? `${window.location.protocol}//${hostname}:3000/api`
          : '/api'),
      assetsReady: false,
      innerTransitionName: 'inner-slide-left',
      comptext,
      currentPage: 6,
      questionIndex: 0,
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

      },
      showModal: false,
      showPreviewModal: false,
      message: '',
      modalAction: '',
      previewRows: [],
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
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },
        'page7':{
          title:'2.客户服务',
          title_en:'Customer Service',
          items:[
            {
              title:'2.1 客服/礼宾台员工仪容仪表',
              title_en:'Grooming of Customer Service Staff',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'2.2 前台礼宾服务',
              small:'(含访客登记、雨伞借用)',
              value:'',
              title_en:'Concierge Service',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'2.3 晨间迎宾服务及指引',
              small:'(如适用)',
              value:'',
              title_en:'Peak Hour Service of Direction（If  applicable）',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },
        'page8':{
          title:'2.客户服务',
          title_en:'Customer Service',
          items:[
            {
              title:'2.4 咨询和投诉的处理',
              title_en:'Handling of Inquiry & Complaints',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'2.5 服务响应效率',
              value:'',
              title_en:'Service Feedback Efficiency',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'2.6 配合租户的活动需求响应',
              value:'',
              title_en:'Assistance in Tenant Event Requirments',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },
        'page9':{
          title:'2.客户服务',
          title_en:'Customer Service',
          items:[
            {
              title:'2.7 信息发布与通知工作',
              title_en:'Information Release and Notification',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'2.8 请问您对客户服务有什么其他意见？',
              control:'textarea',
              value:'',
              title_en:'Do you have any other suggestions regarding customer service?'
            }
          ]
        },
        'page10':{
          title:'3.设施保养及维修',
          title_en:'Facility & Maintenance',
          items:[
            {
              title:'3.1 维修人员仪容仪表',
              title_en:'Grooming of Maintenance Staff',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'3.2 维修响应及收费合理性',
              value:'',
              title_en:'Timely Response & Reasonable charges',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'3.3 中央空调舒适度',
              value:'',
              title_en:'Comfort of Centralized Air-conditioning System',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },
        'page11':{
          title:'3.设施保养及维修',
          title_en:'Facility & Maintenance',
          items:[
            {
              title:'3.4 电梯及扶手电梯',
              title_en:'Lifts and Escalators',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'3.5 公区照明',
              value:'',
              title_en:'Public Lighting System',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'3.6 茶水间',
              small:'(如适用)',
              value:'',
              title_en:'Pantry（If applicable）',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },
        'page12':{
          title:'3.设施保养及维修',
          title_en:'Facility & Maintenance',
          items:[
            {
              title:'3.7 装修管理',
              small:'(异味、噪音、粉尘、施工人员管理)',
              title_en:'Fitting-out Management',
              small_en:'(Odors, Noise, Dust, Workers management)',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },
            {
              title:'3.8 请问您对设施维护有什么其他意见?',
              control:'textarea',
              value:'',
              title_en:'Do you have any other suggestions regarding Facilities and Maintenance?'
            }
          ]
        },
        'page13':{
          title:'4.公共区域清洁及绿化',
          title_en:'Cleaning & Maintenance of Public Area & Landscaping',
          items:[
            {
              title:'4.1 保洁人员仪容仪表',
              title_en:'Grooming of Cleaning Staff',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'4.2 保洁人员服务态度',
              title_en:'Attitude of Cleaning Staff',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'4.3 清洁频率',
              title_en:'Frequency of Cleaning',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page14':{
          title:'4.公共区域清洁及绿化',
          title_en:'Cleaning & Maintenance of Public Area & Landscaping',
          items:[
            {
              title:'4.4 大堂及外墙清洁状况',
              title_en:'Main Lobby & Exterior Wall',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'4.5 公共走廊及楼梯清洁状况',
              title_en:'Public Corridors & Stairs',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'4.6 电梯及扶手电梯清洁状况',
              title_en:'Lifts and Escalators',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page15':{
          title:'4.公共区域清洁及绿化',
          title_en:'Cleaning & Maintenance of Public Area & Landscaping',
          items:[
            {
              title:'4.7 卫生间清洁状况',
              title_en:'Cleanliness of Washroom',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'4.8 卫生间易耗品补给及时性',
              title_en:'Timely Replenishment of Washroom Supplies',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'4.9 外围清洁状况',
              title_en:'Cleanliness of External Area',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page16':{
          title:'4.公共区域清洁及绿化',
          title_en:'Cleaning & Maintenance of Public Area & Landscaping',
          items:[
            {
              title:'4.10 公区绿植养护',
              title_en:'Landscaping',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'4.11 请问您对公共区域清洁及绿化有什么其他意见?',
              title_en:'Any other suggestions regarding Cleaning & Maintenance of Public Area & Landscaping?',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page17':{
          title:'5.保安服务及消防安全',
          title_en:'Security Service and Fire Safety',
          items:[
            {
              title:'5.1 保安人员仪容仪表',
              title_en:'Grooming of Security Staff',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'5.2 保安人员服务态度',
              title_en:'Attitude of Security Staff',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'5.3 突发事件紧急处理',
              title_en:'Emergency Response',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page18':{
          title:'5.保安服务及消防安全',
          title_en:'Security Service and Fire Safety',
          items:[
            {
              title:'5.4 室内抽烟管理',
              title_en:'Smoking Management',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'5.5 消防/火灾预防',
              title_en:'Fire Safety',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'5.6 交通指引及安全管控',
              title_en:'Traffic Guidance and Safety Management',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page19':{
          title:'5.保安服务及消防安全',
          title_en:'Security Service and Fire Safety',
          items:[
            {
              title:'5.7 请问您对保安及消防安全有什么其他意见?',
              title_en:'Any other suggestions regarding Security & Fire Safety?',
              control:'textarea',
              value:''
            }
          ]
        },'page20':{
          title:'6.停车场管理',
          title_en:'Car Parking',
          items:[
            {
              title:'6.1 清洁',
              title_en:'Cleanliness',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'6.2 照明',
              title_en:'Lighting',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'6.3 指示牌清晰度',
              title_en:'Parking Signage',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page21':{
          title:'6.停车场管理',
          title_en:'Car Parking',
          items:[
            {
              title:'6.4 寻车便捷性',
              title_en:'Easy to Find Parkings',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'6.5 支付便捷性',
              title_en:'Convenience of Paying',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'6.6 请问您对停车场管理有什么其他意见？',
              title_en:'Do you have any other suggestions regarding Car Parking ?',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },'page22':{
          title:'7.其他物业服务',
          title_en:'Other Services',
          items:[
            {
              title:'7.1 节日装饰',
              title_en:'Festive Decorations',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'7.2 手机信号',
              title_en:'Cell Phone Signal',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'7.3 快递服务',
              title_en:'Courier Service',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },
        'page23':{
          title:'7.其他物业服务',
          title_en:'Other Services',
          items:[
            {
              title:'7.4 外卖管理',
              title_en:'Food Delivery Management',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            },{
              title:'7.5 母婴室',
              small:'(如适用)',
              title_en:'Nursing Room（if applicable）',
              value:'',
              options:[
                '非常不满意',
                '不满意',
                '一般',
                '满意',
                '非常满意',
              ],
              options_en:[
                'Poor',
                'Dissatisfied',
                'Fair',
                'Satisfied',
                'Excellent'
              ]
            }
          ]
        },
        'page24':{
          title:'8.活动参与',
          title_en:'Activity Participation',
          items:[
            {
              title:'8.1 您是否愿意参加我们举办的活动?',
              title_en:'Would you like to take part in our activities?',
              value:'',
              options:[
                '非常乐意',
                '如果活动有趣的话',
                '没什么时间',
                '不感兴趣'
              ],
              options_en:[
                'With great pleasure',
                'If the activity is interesting',
                'Not much time',
                'Not interested'
              ]
            },{
              title:'8.2 您喜欢哪种类型的活动?',
              small:'(可多选)',
              title_en:'What kind of activity do you prefer?（multiple-choice ）',
              control:'multiple',
              value:[],
              options:[
                '运动游戏类',
                '表演互动类',
                '手工礼品类',
                '公益类',
                '艺术展览类',
                '礼品换领活动'
              ],
              options_en:[
                'Sports & Competitive games',
                'Performance',
                'Handicaft',
                'Charitable Events',
                'Art exhibitions',
                'Gift redemptions'
              ]
            }
          ]
        },'page25':{
          title:'9.ESG工作及节能减排',
          title_en:'ESG & Emission Reduction',
          submitpage:true,
          items:[
            {
              title:'9.1 您对物业管理中心的ESG工作有哪些建议或意见?',
              title_en:'What opinions or suggestions do you have on the ESG of the property management center?',
              value:'',
              control:'textarea'

            },{
              title:'9.2 企业是否需要物管中心提供协助, 以实现ESG目标?',
              title_en:'Do companies require assistance from property management center to fulfill their ESG obligations?',
              value:'',
              control:'textarea'

            },{
              title:'9.3 对于大厦/商场节能减排工作，您有什么建议？',
              title_en:'Do you have any specific suggestions for energy conservation and emission reduction measures in buildings or shopping malls?',
              value:'',
              control:'textarea'
            }
          ]
        },
      },
    }
  },
  async mounted() {
    await this.preloadPageImages();
    this.assetsReady = true;

    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector('.page6')?.classList.add('appeared');
      }, 200);
    });

    this.updatePageFromRoute();
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  },
  watch: {
    '$route'(to, from) {
      const toPage = this.parseRoutePageNumber(to.path);
      const fromPage = this.parseRoutePageNumber(from?.path || '');
      this.innerTransitionName = toPage < fromPage ? 'inner-slide-right' : 'inner-slide-left';
      this.updatePageFromRoute();
    }
  },
  methods: {
    preloadPageImages() {
      const imageUrls = [
        this.logo,
        this.textTop,
        this.btnStar,
        this.btnDown,
        this.comptext,
        this.h1_icon,
        this.bgColor,
        this.bgLeft,
        this.bgRight,
        this.bgLine,
        this.notebook_icon
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

    parseRoutePageNumber(path) {
      const match = path.match(/^\/page(\d+)$/);
      return match ? Number(match[1]) : 0;
    },

    updatePageFromRoute() {

      const formStore = useFormStore();

      const path = this.$route.path;
      // 获取路由最后1个字符作为currentPage
      this.currentPage = parseInt(path.replace(/^\//, '').replace('page', '')) || 6;
      
      // 更新页面数据
      const currentPageKey = path.replace(/^\//, '');
      this.page = this.pages[currentPageKey] || this.page;

      this.form = { 
        ...formStore.formData,
        ...this.form
      };

      this.questionIndex = 0;

      for(var page of Object.keys(this.pages)) {
         var cp = parseInt(page.replace('page', ''))
         if(cp < this.currentPage) {
          this.questionIndex += this.pages[page].items.length; 
         }
      }


      for(const item of this.page.items) {

        // 先为不同控件补默认值，避免 v-model 绑定到 undefined
        if (item.control === 'multiple') {
          item.value = Array.isArray(item.value) ? item.value : [];
        } else {
          item.value = typeof item.value === 'string' ? item.value : '';
        }

        // 不能用 truthy 判断，否则空字符串会被误判为“没有值”
        if (Object.prototype.hasOwnProperty.call(this.form, item.title)) {
          item.value = this.form[item.title];
        }

      }


      

      console.log('当前页面:', this.currentPage);
    },
    //比如标题是 1.1 客服/礼宾台员工仪容仪表，应该排在 1.2 晨间迎宾服务及指引前面
    compareQuestionKey(a, b) {
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
    normalizeFormattedValue(value) {
      if (Array.isArray(value)) {
        return value.join('，');
      }

      if (value == null) {
        return '';
      }

      if (typeof value === 'string') {
        return value.trim();
      }

      return String(value);
    },
    formatData(){
      // 本函数在提交前对数据做统一格式化：
      // 1. 合并当前页面还未点“下一页”的即时选择
      // 2. 多选数组转为逗号分隔字符串
      // 3. 英文字段名转为中文
      // 4. 题目按数字编号排序（如 1.1, 1.2, 2.1）
      const formStore = useFormStore();

      const mergedData = {
        ...(formStore.formData || {})
      };

      for (const item of this.page.items) {
        mergedData[item.title] = item.value;
      }

      const fieldLabelMap = {
        blockName: '物业',
        name: '姓名',
        mobile: '手机号',
        unit: '单元',
        company: '公司名称',
        subdate: '调查日期'
      };

      const basicFieldOrder = ['blockName', 'name', 'mobile', 'unit', 'company', 'subdate'];

      const entries = [];
      const usedKeySet = new Set();

      for (const key of basicFieldOrder) {
        if (Object.prototype.hasOwnProperty.call(mergedData, key)) {
          entries.push([fieldLabelMap[key] || key, this.normalizeFormattedValue(mergedData[key])]);
          usedKeySet.add(key);
        }
      }

      const questionKeys = Object.keys(mergedData)
        .filter((key) => !usedKeySet.has(key))
        .sort((a, b) => this.compareQuestionKey(a, b));

      for (const key of questionKeys) {
        entries.push([fieldLabelMap[key] || key, this.normalizeFormattedValue(mergedData[key])]);
      }

      return Object.fromEntries(entries);
    },
    PreviewForm() {
      const formattedData = this.formatData();
      const rows = Object.entries(formattedData).map(([question, answer]) => ({
        question,
        answer: this.formatPreviewAnswer(answer)
      }));

      this.previewRows = rows;
      this.showPreviewModal = true;
      this.updateBodyScrollLock();
      console.log('预览表单数据:', formattedData);
      
    },

    formatPreviewAnswer(value) {
      if (Array.isArray(value)) {
        return value.length > 0 ? value.join('、') : '未作答';
      }

      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed || '未作答';
      }

      if (value == null) {
        return '未作答';
      }

      return String(value);
    },
    updateBodyScrollLock() {
      if (this.showModal || this.showPreviewModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    openModal(msg, action = '') {
      this.message = msg;
      this.modalAction = action;
      this.showModal = true;
      this.updateBodyScrollLock();
    },
    closeModal() {
      this.showModal = false;
      this.modalAction = '';
      this.updateBodyScrollLock();
    },
    closePreviewModal() {
      this.showPreviewModal = false;
      this.updateBodyScrollLock();
    },
    onModalConfirm() {
      const action = this.modalAction;
      this.closeModal();

      if (action === 'goPage26') {
        this.$router.push('/page26');
      }
    },

    p6_goNext(n) {

      const formStore = useFormStore();

      // 确保 formStore.formData 存在
      if (!formStore.formData) {
        formStore.formData = {};
      }

      for(const item of this.page.items) {

          console.log('检查题目:', item.title, '值:', item.value);
        
          var required = true;

          if(item.value && typeof(item.value) === 'string' && item.value.trim() !== '') {
            required = false;
          }

          // 文本域不强制要求必须填写
        if(required && item.control == 'textarea') {
          required = false;
        }
        // 多选题必须至少选择一项
        if(required && item.control == 'multiple' && item.value && Array.isArray(item.value) && item.value.length > 0) {
            required = false;
        }
        

        //可忽略的题目，如果题目描述里包含“如适用”则不强制要求必须填写
        if(required && item.small && item.small.includes('如适用')) {
          required = false;
        }


        console.log('题目:', item.title, '是否必填:', required);

        if (required){
          this.openModal('请先完成本页问卷再继续');
          return;
        }

        formStore.formData[item.title] = item.value;
      }

      
      this.currentPage += n;

      console.log('Form Data:', formStore.formData);

      this.$router.push('/page'  + this.currentPage)
      
   



      //this.$router.push('/page6')

    },


    async submitForm() {

      const formattedData = this.formatData();

      try {
        const response = await fetch(`${this.apiBase}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formattedData)
        })
        if (response.ok) {
          localStorage.removeItem('form-temp-data');
          this.openModal('提交成功！', 'goPage26');

        } else {
          const errText = await response.text();
          this.openModal(`提交失败(${response.status})：${errText || '请稍后重试'}`)
        }
      } catch (error) {
        console.error('Error:', error)
        this.openModal(`提交失败，请检查网络或稍后再试\n${error?.message || ''}`)
      }
    }

  }
}
</script>

<style scoped>



@font-face {
  font-family: 'MyHeiTi';
  src: url('../assets/myheiti.ttf') format('truetype');
}

.item-textarea{
  margin:20px 15px 0 15px;
  width:100%;
  height:80px;
  padding:10px;
  font-size:14px;
  border-radius:8px;
  border:1px solid #c8b08e55;
  background-color:#f9f9f9;
  resize:none;
  font-family: yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.opt-en{
  position:absolute;margin-top:32px;font-size:10px;margin-left:20px

}

.opt-en-n{
  position:absolute;margin-top:32px;font-size:9px;margin-left:12px
}

.option-group {
  min-width:320px;
  display: flex;
  flex-wrap:  nowrap;
  margin-top: 10px;
  margin-left:3px;
}

.option-item {
  min-width:48px;
  font-size:10px;
  display: flex;
  align-items: center;
  white-space: nowrap;

}



.option-item-multiple {
  min-width:48px;
  font-size:10px;
  display: flex;
  align-items: center;
  white-space: nowrap;
   margin-bottom:10px;
  margin-top:9px;
  margin-left:0px;
  width:100px;

}



.option-item:nth-child(2){
  margin-left:4px;
  margin-right:11px;
}
  
 .option-item input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  /* 自定义未选中状态 */
  .option-item span {
    
    width: 12px;
    height: 12px;
    border: 2px solid #00b7eb; /* 未选中边框颜色 */
    border-radius: 50%;
    pointer-events: none; /* 允许点击穿透 */
    margin-right: 1px;
  }
  
  /* 自定义选中状态 */
.option-item input[type="radio"]:checked + span {
    border-color: #00b7eb; /* 选中边框颜色 */
    background: #00b7eb; /* 选中填充色 */
    color: white;
    font-family:yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
    font-size:16px;
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
  font-size: 9px;
  color: #FFF;
  font-weight: 100;
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

.h3.even{
  margin-left:auto;
  border-radius:25px 0 0 25px;
}

.h3.color1{
  background-color: #533278;
}

.h3.color2{
  background-color: #8a6d4a;
}

.h3.color3{
  background-color: #00b7eb;
}


.h2{
  font-size:38px;
  text-shadow: #00b7eb 0px 0px 8px;
  font-family: 'MyHeiTi', yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
  line-height: 130%;
  margin:0;

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
  width: 100px;
  height: 35px;
  line-height: 35px;
  background-image: url('../assets/blue_btn.png');
  background-repeat: no-repeat;
  background-size: 90px auto;
  color: white;

  font-size: 12px;
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
    repeat-y,            /* 右不重复 */
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

.page6-loading {
  min-height: 100vh;
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

.page6-inner-view {
  width: 100%;
}

.inner-slide-left-enter-active,
.inner-slide-left-leave-active,
.inner-slide-right-enter-active,
.inner-slide-right-leave-active {
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease;
}

.inner-slide-left-enter-from {
  transform: translateX(24px);
  opacity: 0;
}

.inner-slide-left-leave-to {
  transform: translateX(-24px);
  opacity: 0;
}

.inner-slide-right-enter-from {
  transform: translateX(-24px);
  opacity: 0;
}

.inner-slide-right-leave-to {
  transform: translateX(24px);
  opacity: 0;
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
  padding-bottom: 40px;
}




.logo {
    width: 180px;
    height: auto;
}

.text-top {
  width: 120px;
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
  overflow-y: auto;
  z-index: 9999;
}

.modal-content {
 

  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  text-align: center;
  font-family: yahei, Microsoft YaHei, Helvetica, Arial, sans-serif;
}

.preview-modal-content {
  
  width: 90vw;
  height: 95vh;
  max-width: none;
  max-height: none;
  margin: 0 auto;
  border-radius: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.preview-title {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.preview-list {
  overflow-y: auto;
  border: 1px solid #e3edf2;
  border-radius: 8px;
  padding: 8px;
  background: #f9fcfe;
}

.preview-item {
  padding: 10px;
  border-bottom: 1px dashed #d7e3ea;
}

.preview-item:last-child {
  border-bottom: none;
}

.preview-question {
  font-size: 13px;
  color: #2c3e50;
  margin-bottom: 4px;
}

.preview-answer {
  font-size: 13px;
  color: #0077a3;
  word-break: break-word;
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




.blue-btn-l {
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



</style>
