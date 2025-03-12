<script setup>
import { ref, createApp, onMounted, onUnmounted, nextTick } from 'vue'
import { jsPDF } from 'jspdf'
//import SourceHanSansCN from '@/assets/fonts/SourceHanSansSC-Regular.ttf' 字体没有空格
import SourceHanSansCN from '@/assets/fonts/SourceHanSansSC-Normal-Min.ttf'
import Seal from './Seal.vue'
import html2canvas from 'html2canvas'
import VuePdfEmbed from 'vue-pdf-embed'


const currentDate=new Date()
const currentYear = currentDate.getFullYear()
const nextYear = currentYear+1

const pdfTitle = ref('纸上谈兵委员会')
const pdfSubTitle = ref('关于纸上谈兵挑战赛的通知')
const pdfContent = ref(`   恭喜您在${currentYear}-${nextYear}年度'纸上谈兵'中脱颖而出，荣获佳绩！\n特授予荣誉头衔'常胜将军'称号，特此发本奖状，以表鼓励。`)
const pdfNickName = ref('不吃香菜(努力版)')

const isLoading = ref(false)
const inputTopText = ref('纸上谈兵委员会')
const inputCenterText = ref('官方认证')
const inputBottomCode = ref('51000020161224')
const pdfUrl = ref('')



const pdfQueue = ref([]);
let isProcessing = false

const processPdfQueue = async () => {
  if (isProcessing) return
  isProcessing = true
  while (pdfQueue.value.length > 0) {
    const pdfData = pdfQueue.value.shift()
    pdfNickName.value=pdfData.pdfNickName
    await genPaperTalkPdfFromDouYin(pdfData)
  }
  isProcessing = false
}




// 获取当前编号
const getCurrentNumber = () => {
  const currentNumber = localStorage.getItem('paperNumber')
  return currentNumber ? parseInt(currentNumber) : 0
}

// 更新编号
const updateNumber = (number) => {
  localStorage.setItem('paperNumber', number.toString())
}

// 格式化编号为三位数
const formatNumber = (number) => {
  return number.toString().padStart(3, '0')
}

// 生成文档编号
const generateDocumentNumber = () => {
  
 
  const nextNumber = getCurrentNumber() + 1
  updateNumber(nextNumber)
 const NO=`${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}期`
  return `纸上谈兵(${currentYear})${NO}第${formatNumber(nextNumber)}号`
}

const handleSubmit = async () => {
  const count=generateDocumentNumber()
  const pdfMessage={
    pdfTitle:pdfTitle.value,
    pdfSubTitle:pdfSubTitle.value,
    pdfContent:pdfContent.value,
    pdfNickName:pdfNickName.value,
    pdfCount:count,
  }
  genPaperTalkPdf(true,pdfMessage)
}



const genPaperTalkPdfFromDouYin = async (pdfMessage) => {
  const count=generateDocumentNumber()
  pdfMessage.pdfCount=count
  genPaperTalkPdf(true,pdfMessage)
}

const genPaperTalkPdf = async (autoDownload = false, pdfMessage) => {
  isLoading.value = true
  try {
    const doc = new jsPDF({
      unit: 'pt',
      hotfixes: ['pt_scaling'],
      orientation: 'p',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    })
  
  // 使用本地思源黑体
  doc.addFont(SourceHanSansCN, 'SourceHanSansCN', 'normal')
  doc.setFont('SourceHanSansCN', 'normal')
  doc.setLanguage('zh-CN')
  
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  // 设置字体大小和位置
  doc.setFontSize(36)
  doc.setTextColor(255, 0, 0) // 设置红色
  doc.text(pdfMessage.pdfTitle, pageWidth / 2, 50, { align: 'center' })
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0) // 恢复黑色
  doc.text(pdfMessage.pdfCount, pageWidth / 2, 81, { align: 'center' })
  //2条红色横线
  doc.setDrawColor(255, 0, 0) // 设置线条颜色为红色
  doc.line(40, 90, pageWidth - 40, 90) // 第一条横线
  doc.line(40, 95, pageWidth - 40, 95) // 第二条横线

  doc.setFontSize(24)
  doc.setTextColor(255, 0, 0) // 设置红色
  const subtitleX = pageWidth  / 2
  doc.text(pdfMessage.pdfSubTitle, subtitleX, 128, { align: 'center' })
  
  doc.setTextColor(0, 0, 0) // 恢复黑色
  doc.setFontSize(16)
  const contentLines = doc.splitTextToSize(`${pdfMessage.pdfNickName}:\n\n${pdfMessage.pdfContent}`, pageWidth-80)
  doc.text(contentLines, 40, 170, { 
    align: 'left', 
    renderingMode: 'fill', 
    charSpace: 1.5,  // 增加字符间距
    preserveLeadingSpaces: true, 
    lineHeightFactor: 1.5, 
    maxWidth: pageWidth-80,
    flags: {
      noBOM: true,
      autoencode: true
    }
  })


//添加底部 编码文字 NO.202303120011 最后一位为20230312001的对8取余的校验位
  doc.setFontSize(15)
  doc.setTextColor(0, 0, 0) // 恢复黑色
  const numbers = pdfMessage.pdfCount.match(/\d+/g); // 提取所有数字
  const sum = numbers.reduce((acc, num) => acc + parseInt(num), 0) % 8; // 计算总和并对 8 取余
  const NO = `${numbers.join('')}${sum===4?9:sum}`; // 去掉逗号并拼接结果
  doc.text(`编码：NO.${NO}`, pageWidth / 2, pageHeight-14, { align: 'center' })

  // 添加右下角文字和日期
  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}年${String(currentDate.getMonth() + 1).padStart(2, '0')}月${String(currentDate.getDate()).padStart(2, '0')}日`
  doc.setTextColor(0, 0, 0) // 恢复黑色
  doc.setFontSize(24)
  // 添加文字
  doc.text(`纸上谈兵\n${formattedDate}`, pageWidth - 180, pageHeight - 150, { align: 'center', lineHeightFactor: 1.4 })

  // 获取印章元素并转换为图片
  const sealElement = document.querySelector('.seal-container')
  if (sealElement) {
    const canvas = await html2canvas(sealElement, {
      backgroundColor: null,
      scale: 2,
      logging: false
    })
    const sealDataUrl = canvas.toDataURL('image/png')
    doc.addImage(sealDataUrl, 'PNG', pageWidth - 280, pageHeight - 240, 200, 200)
  }

  // 设置文件名并生成PDF
  doc.setProperties({
    title: pdfMessage.pdfSubTitle,
    subject: pdfMessage.pdfCount,
    author: '纸上谈兵委员会',
    keywords: '纸上谈兵|赵括|佛罗里|达州',
  })
  
  // 生成PDF并根据参数决定是否自动下载
  const pdfBlob = doc.output('blob')
  pdfUrl.value = URL.createObjectURL(pdfBlob)
  if (autoDownload) {
    doc.save(`${pdfMessage.pdfTitle}-${pdfMessage.pdfCount}.pdf`)
  }
  } catch (error) {
    console.error('PDF生成失败:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const currentNumber = getCurrentNumber()==0 ? 1: getCurrentNumber()
  const currentDate=new Date()
    const NO=`${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}期`
    const count= `纸上谈兵(${currentDate.getFullYear()})${NO}第${formatNumber(currentNumber)}号`
    const pdfMessage={
    pdfTitle:pdfTitle.value,
    pdfSubTitle:pdfSubTitle.value,
    pdfContent:pdfContent.value,
    pdfNickName:pdfNickName.value,
    pdfCount:count,
  }
  genPaperTalkPdf(false,pdfMessage)
  wsConnection = connectDou()
})

onUnmounted(() => {
  if (wsConnection) {
    wsConnection.close()
  }
})


const wsUrl = ref('ws://127.0.0.1:8888')
const messages = ref([])

const disconnectWebSocket = () => {
  if (wsConnection) {
    wsConnection.close()
    wsConnection = null
    wsError.value = '连接已断开'
  }
}

const reconnectWebSocket = () => {
  if (wsConnection) {
    wsConnection.close()
  }
  messages.value = []
  wsConnection = connectDou(wsUrl.value)
}

const addMessage = (message) => {
  messages.value.unshift(message)
}

let wsConnection = null
const wsError = ref('')

const connectDou = (url) => {
  wsError.value = ''
  const ws = new WebSocket(url)
  /**
   * 
   *  public enum PackMsgType
    {
        [Description("无")]
        无 = 0,       
        [Description("消息")] 
        弹幕消息 = 1,
        [Description("点赞")]
        点赞消息 = 2,
        [Description("进房")]
        进直播间 = 3,
        [Description("关注")]
        关注消息 = 4,
        [Description("礼物")]
        礼物消息 = 5,
        [Description("统计")]
        直播间统计 = 6,
        [Description("粉团")]
        粉丝团消息 = 7,
        [Description("分享")]
        直播间分享 = 8,
        [Description("下播")]
        下播 = 9
    }
   */
   ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      switch (data.Type) {
        case 0: // 无
          console.log('收到空消息')
          break
        case 1: // 弹幕消息
          const chatData = JSON.parse(data.Data)
          const chatUser = chatData.User
          addMessage({
            type: 'danmu',
            content: chatData.Content,
            user: chatUser
          })

          pdfQueue.value.push({ pdfTitle: pdfTitle.value, pdfSubTitle: pdfSubTitle.value, pdfContent: pdfContent.value, pdfNickName: chatUser.Nickname })
          processPdfQueue()
          // console.log(`用户 ${chatUser.Nickname}(等级${chatUser.Level}) 发送消息：${chatData.Content}`)
          break
        case 2: // 点赞消息
          const likeData = JSON.parse(data.Data)
          const likeUser = likeData.User
          addMessage({
            type: 'like',
            content: `${likeData.Content}`,
            user: likeUser
          })
          //console.log(`点赞了直播间，点赞数：${JSON.stringify(likeData)}`)
          console.log(`用户 ${likeUser.Nickname} 点赞了直播间，点赞数：${likeData.Content}`)
          break
        case 3: // 进直播间
          // const enterData = JSON.parse(data.Data)
          // const enterUser = enterData.User
          // addMessage({
          //   type: 'enter',
          //   content: `${enterUser.FansLevel ? `(粉丝团${enterUser.FansLevel}级)` : ''} 进入直播间，当前人数：${enterData.CurrentCount}`,
          //   user: enterUser
          // })
          // console.log(`用户 ${enterUser.Nickname} ${enterUser.FansLevel ? `(粉丝团${enterUser.FansLevel}级)` : ''} 进入直播间，当前人数：${enterData.CurrentCount}`)
           break
        case 4: // 关注消息
          // const followData = JSON.parse(data.Data)
          // const followUser = followData.User
          // addMessage({
          //   type: 'follow',
          //   content: `关注了主播`,
          //   user: followUser
          // })
          // console.log(`用户 ${followUser.Nickname} 关注了主播`)
          break
        case 5: // 礼物消息
          const giftData = JSON.parse(data.Data)
          const giftUser = giftData.User
          addMessage({
            type: 'gift',
            content: `赠送礼物：${giftData.Content}`,
            user: giftUser
          })
          //console.log(`用户 ${giftUser.Nickname} 赠送礼物：${giftData.Content}`)
          break
        case 6: // 直播间统计
          const statsData = JSON.parse(data.Data)
          addMessage({
            type: 'gift',
            content: `直播间统计数据：${statsData.Content}`,
          })
         // console.log(`直播间统计数据：${JSON.stringify(statsData)}`)
          console.log(`直播间统计数据：${statsData.Content}`)
          break
        case 7: // 粉丝团消息
          const fansData = JSON.parse(data.Data)
          console.log(`粉丝团消息：${JSON.stringify(fansData)}`)
          break
        case 8: // 直播间分享
          const shareData = JSON.parse(data.Data)
          //console.log(`分享了直播间：${JSON.stringify(shareData)}`)
          addMessage({
            type: 'share',
            content: `分享了直播间：${shareData.Content}`,
            user:shareData.User
          })
          break
        case 9: // 下播
        addMessage({
            type: 'share',
            content: `主播已下播`,
          })
          console.log('主播已下播')
          break
        default:
          console.log('未知消息类型:', data)
      }
    } catch (error) {
      console.error('消息解析失败:', error)
    }
  }
  ws.onopen = () => {
    console.log('WebSocket连接已建立')
    wsError.value = '连接已建立'
  }

  ws.onerror = (error) => {
    console.error('WebSocket错误:', error)
    wsError.value = '连接发生错误'+error
  }

  ws.onclose = (event) => {
    console.log('WebSocket连接已关闭', event)
    if (!event.wasClean) {
      wsError.value = '连接异常关闭'+event.reason
    }
  }
  return ws
}


const handleDownload = () => {
  if (pdfUrl.value) {
    const downloadLink = document.createElement('a')
    downloadLink.href = pdfUrl.value
    downloadLink.download = `${pdfTitle.value}-${pdfCount.value}.pdf`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }
}

const handlePrint = () => {
  if (pdfUrl.value) {
    const printWindow = window.open(pdfUrl.value, '_blank')
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}

</script>

<template>
  <div class="paper-container">
     <div class="left-panel">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        
        <div class="ws-connection">
          <div class="ws-input-group">
            <input
              v-model="wsUrl"
              type="text"
              placeholder="WebSocket地址"
              class="ws-input"
            />
            <button @click="reconnectWebSocket" class="ws-connect-btn">
              {{ wsConnection ? '重连' : '连接' }}
            </button>
            <button v-if="wsConnection && wsConnection.readyState === 1" @click="disconnectWebSocket" class="ws-disconnect-btn">
              断开
            </button>
          </div>
          <div class="ws-status">
            状态：{{ 
              wsConnection ? 
                wsConnection.readyState === 1 ? '已连接' : 
                wsConnection.readyState === 0 ? '正在连接...' : 
                wsConnection.readyState === 2 ? '正在关闭...' : 
                wsConnection.readyState === 3 ? '连接已关闭' : '未知状态' 
              : '未连接' 
            }}
            <span v-if="wsError" class="ws-error">{{ wsError }}</span>
          </div>
        </div>
      </div>
      <div class="chat-window">
        <div class="chat-messages" ref="chatMessages">
          <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
            <div class="user">{{ message.user?.Nickname  || 'system' }}</div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <div class="input-group">
          <input
            v-model="pdfTitle"
            type="text"
            placeholder="请输入一级标题"
            class="input-field"
          />
        </div>
        
        <div class="input-group">
          <input
            v-model="pdfSubTitle"
            type="text"
            placeholder="请输入二级标题"
            class="input-field"
          />
        </div>

        <div class="input-group">
          <input
            v-model="pdfNickName"
            type="text"
            placeholder="请输入昵称"
            class="input-field"
          />
        </div>
        
        <div class="input-group">
          <textarea
            v-model="pdfContent"
            placeholder="请输入内容（最多5行）"
            class="input-field content-area"
            rows="2"
          ></textarea>
        </div>
        
        <button @click="handleSubmit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? '生成中...' : '生成预览' }}
        </button>
      </div>
    </div>
    
    <div class="divider">
    </div>
    <div class="center-panel">
      <div class="action-buttons">
        <button class="icon-button" @click="handleDownload" title="下载PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        <button class="icon-button" @click="handlePrint" title="打印PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        </button>
      </div>
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在生成PDF...</div>
      </div>
      <div class="pdf-preview">
        <VuePdfEmbed v-if="pdfUrl" :source="pdfUrl" :zoom="0.75" />
      </div>
    </div>
    <div class="divider">
    </div>
    <div class="right-panel">
      <div class="seal-view-container">
        <div class="top-panel">
                  <div class="input-group">
                    <label for="topText">标题：</label>
                    <input id="topText" v-model="inputTopText" />
                  </div>
                  <div class="input-group">
                    <label for="centerText">认证：</label>
                    <input id="centerText" v-model="inputCenterText" />
                  </div>
                  <div class="input-group">
                    <label for="bottomCode">编码：</label>
                    <input id="bottomCode" v-model="inputBottomCode" />
                  </div>
          </div>
            <div class="bottom-panel">
              <Seal :topText="inputTopText" :centerText="inputCenterText" :bottomCode="inputBottomCode" />
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.paper-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  border: none;
}

.left-panel {
  flex: 2;
  padding: 2rem;
  background-color: white;
  box-shadow: none;
  position: relative;
}

.center-panel {
  flex: 2;
  padding: 0.2rem 0;
  position: relative;
  box-shadow: none;
}

.action-buttons {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.icon-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.2rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.icon-button:hover {
  background-color: #f5f5f5;
  color: #ff0000;
  border-color: #ff0000;
}
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4px;
  background-color: #f5f5f5;
}

.divider svg {
  display: none;
}

.right-panel {
  flex: 2;
  padding: 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
}

.download-btn {
  padding: 0.2rem 1rem;
  background-color: green;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #66b1ff;
}
.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  width: 125px;
  height: 125px;
  margin-right: 1rem;
}

.ws-connection {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 0;
  width: 100%;
}

.ws-input-group {
  display: flex;
  gap: 10px;
  width: 100%;
}

.ws-status {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.ws-error {
  display: block;
  margin-top: 4px;
  color: #ff4d4f;
  font-size: 12px;
}

.ws-input {
  padding: 0.5rem;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 200px;
}

.ws-connect-btn {
  padding: 0.5rem 1rem;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ws-connect-btn:hover {
  background-color: #ff6666;
}

.chat-window {
  width: 100%;
  margin-top: 0;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
}

.chat-messages {
  height: 260px;
  overflow-y: auto;
  padding: 15px;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.message {
  margin-bottom: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message .user {
  font-weight: bold;
  margin-right: 8px;
}

.message.danmu {
  background-color: rgba(255, 192, 203, 0.2);
  color: #d30a0a;
}

.message.gift {
  background-color: rgba(255, 192, 203, 0.2);
  color: #ff4d4f;
}

.message.enter {
  background-color: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.message.follow {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.message.like {
  background-color: rgba(250, 173, 20, 0.1);
  color: #faad14;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-field {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.3s;
  text-align: left;
}

.input-group:first-child .input-field {
  color: #000000 !important;
  font-size: 1.2rem !important;
  font-weight: bold !important;
}

.input-field:focus {
  border-color: #409eff;
  outline: none;
}

.content-area {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  padding: 0.8rem 2rem;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #ff6666;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.seal-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

.top-panel {
  background-color: #f3f3f3;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-panel h2 {
  color: #333;
  text-align: center;
  font-size: 1.5rem;
}

.top-panel .input-group {
  margin-bottom: 1.2rem;
}

.top-panel .input-group label {
  display: inline-block;
  color: #666;
  margin-right: 1rem;
}

.top-panel .input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.top-panel .input-group input:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.bottom-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #ff0000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #333;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.save-btn:hover {
  background-color: #ff6666;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>




