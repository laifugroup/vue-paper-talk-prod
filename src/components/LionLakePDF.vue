<script setup>
import { ref, createApp, onMounted, onUnmounted, nextTick } from 'vue'
import { jsPDF } from 'jspdf'
//import SourceHanSansCN from '@/assets/fonts/SourceHanSansSC-Regular.ttf' 字体没有空格
import SourceHanSansCN from '@/assets/fonts/SourceHanSansSC-Normal-Min.ttf'
import Seal from './Seal.vue'
import MusicPlayer from './MusicPlayer.vue'
import html2canvas from 'html2canvas'
import VuePdfEmbed from 'vue-pdf-embed'
import { useRouter } from 'vue-router'

const currentDate=new Date()
const currentYear = currentDate.getFullYear()
const nextYear = currentYear+1
const formattedDate = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日`;

const pdfTitle = ref('狮子湖越野挑战赛委员会')
const pdfSubTitle = ref('成都狮子湖越野挑战赛')
const pdfContent = ref(`    恭喜您在${currentYear}-${nextYear}年度“狮子湖越野挑战赛”中完成挑战，特此证明。\n\n特授予您“狮子湖极限挑战者”荣誉称号！`)
const pdfNickName = ref('川A78BBQ')

const isLoading = ref(false)
const inputTopText = ref('狮子湖越野挑战赛委员会')
const inputCenterText = ref('官方认证')
const inputBottomCode = ref('51000020161224')
const pdfUrl = ref('')


// 获取当前编号 编号需要每天更新 从1开始
const getCurrentNumber = () => {
  const currentNumber = localStorage.getItem(formattedDate)
  return currentNumber ? parseInt(currentNumber) : 0
}

// 更新编号 编号需要每天更新 从1开始
const updateNumber = (number) => {
  localStorage.setItem(formattedDate, number.toString())
}

// 格式化编号为三位数
const formatNumber = (number) => {
  return number.toString().padStart(3, '0')
}

// 生成文档编号
const generateDocumentNumber = () => {
  const nextNumber = getCurrentNumber() + 1
  updateNumber(nextNumber)
 const NO=`${String(currentDate.getMonth() + 1).padStart(2, '0')}月`
  return `纸上谈兵(${currentYear})${NO}`
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
  const contentLines = doc.splitTextToSize(`${pdfMessage.pdfNickName}:\n\n${pdfMessage.pdfContent}`, pageWidth-120)
  //
  console.log(contentLines)
  doc.text(contentLines, 40, 170, { 
    align: 'left', 
    renderingMode: 'fill', 
    charSpace: 1.2,  // 增加字符间距
    preserveLeadingSpaces: true, 
    lineHeightFactor: 1.2, 
  })


//添加底部 编码文字 NO.202303120011 最后一位为20230312001的对8取余的校验位
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0) // 恢复黑色
  const numbers = pdfMessage.pdfCount.match(/\d+/g); // 提取所有数字
  const sum = numbers.reduce((acc, num) => acc + parseInt(num), 0) % 8; // 计算总和并对 8 取余
  const NO = `${numbers.join('')}${sum===4?9:sum}`; // 去掉逗号并拼接结果
  doc.text(`编号：NO.${NO}`, pageWidth / 2, pageHeight-14, { align: 'center' })

  // 添加右下角文字和日期
  const currentDate = new Date()
  const formattedDate = `${currentDate.getFullYear()}年${String(currentDate.getMonth() + 1).padStart(2, '0')}月`
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
    subject: pdfMessage.pdfNickName,
    author: pdfMessage.pdfTitle,
    keywords: pdfMessage.pdfTitle,
  })
  
  // 生成PDF并根据参数决定是否自动下载
  const pdfBlob = doc.output('blob')
  pdfUrl.value = URL.createObjectURL(pdfBlob)
  if (autoDownload) {
    doc.save(`${pdfMessage.pdfTitle}-${pdfMessage.pdfNickName}.pdf`)
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
    const NO=`${String(currentDate.getMonth() + 1).padStart(2, '0')}月`
    const count= `纸上谈兵(${currentDate.getFullYear()})年度${NO}`
    const pdfMessage={
    pdfTitle:pdfTitle.value,
    pdfSubTitle:pdfSubTitle.value,
    pdfContent:pdfContent.value,
    pdfNickName:pdfNickName.value,
    pdfCount:count,
  }
  genPaperTalkPdf(false,pdfMessage)
})

onUnmounted(() => {
 
})

const handleDownload = () => {
  if (pdfUrl.value) {
    const downloadLink = document.createElement('a')
    downloadLink.href = pdfUrl.value
    downloadLink.download = `${pdfTitle.value}-${pdfNickName.value}.pdf`
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
const router=useRouter()

const route =router.currentRoute.value
// 从路由参数中获取值，如果没有则使用默认值
pdfTitle.value = route.query.pdfTitle || '狮子湖越野挑战赛委员会'
pdfSubTitle.value = route.query.pdfSubTitle || '成都狮子湖越野挑战赛'
pdfContent.value = route.query.pdfContent || `    恭喜您在${currentYear}-${nextYear}年度"狮子湖越野挑战赛"中完成挑战，特此证明。\n\n特授予您"狮子湖极限挑战者"荣誉称号！`
pdfNickName.value = route.query.pdfNickName || '川A78BBQ'
inputTopText.value = route.query.inputTopText || '狮子湖越野挑战赛委员会'
inputCenterText.value = route.query.inputCenterText || '官方认证'
inputBottomCode.value = route.query.inputBottomCode || '51000020161224'

const handleSetting = () => {
  router.push('/lionLake')
}
</script>

<template>
  <div class="paper-container">
    <div class="center-panel">
      <div class="action-buttons">
        <button class="icon-button" @click="handleDownload" title="下载PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        <button class="icon-button" @click="handlePrint" title="打印PDF">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        </button>
        <button class="icon-button" @click="handleSetting" title="设置">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
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
  </div>
</template>

<style scoped>
.paper-container {
  display: flex;
  height: 100vh;
  background-color:#f5f5f5;
  border: none;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.center-panel {
  flex: 1;
  height: 100vh;
  padding: 1rem;
  background-color:rgb(218, 18, 18);
  border-radius: 0;
  box-shadow: none;
  position: relative;
  display: flex;
  flex-direction: column;
}

.action-buttons {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.icon-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
}

.icon-button:hover {
  background-color: #f5f5f5;
  color: #ff0000;
  border-color: #ff0000;
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
  flex: 1;
  width: 100%;
  height: calc(100vh - 2rem);
  background-color: white;
  overflow: auto;
  display: flex;
  justify-content: center;
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




