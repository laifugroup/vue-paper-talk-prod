<script setup>
import { ref, createApp, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import SourceHanSansCN from '@/assets/fonts/SourceHanSansCN-Regular.ttf'
import Seal from './Seal.vue'
import html2canvas from 'html2canvas'


const currentDate = new Date()

const times = ref(0)

const title = ref('纸上谈兵委员会')
const count = ref(`纸上谈兵(${currentDate.getFullYear()})第${times.value}号`)
const subtitle = ref('关于纸上谈兵挑战赛的通知')
const content = ref('不吃香菜(努力版):\n\n恭喜您在2025-2026年`纸上谈兵挑战赛`中脱颖而出，荣获佳绩！你们的智慧与才华为我们呈现了一场精彩绝伦的兵法盛宴，充分展现了中华传统文化的深厚底蕴与现代创新的完美结合。\n\n再次向所有获奖者表示衷心的祝贺！愿你们在未来的征程中继续披荆斩棘，勇攀高峰！')

const isLoading = ref(false)
const inputTopText = ref('纸上谈兵委员会')
const inputCenterText = ref('官方认证')
const inputBottomCode = ref('51000020161224')



const handleSubmit = async () => {
  isLoading.value = true
  try {
    times.value++
    count.value = `纸上谈兵(${currentDate.getFullYear()})第${times.value}号`
    const doc = new jsPDF({
      unit: 'pt',
      hotfixes: ['px_scaling'],
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
  doc.text(title.value, pageWidth / 2, 50, { align: 'center' })
  
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0) // 恢复黑色
  doc.text(count.value, pageWidth / 2, 81, { align: 'center' })
  //2条红色横线
  doc.setDrawColor(255, 0, 0) // 设置线条颜色为红色
  doc.line(40, 90, pageWidth - 40, 90) // 第一条横线
  doc.line(40, 95, pageWidth - 40, 95) // 第二条横线

  doc.setFontSize(24)
  doc.setTextColor(255, 0, 0) // 设置红色
  const subtitleX = pageWidth  / 2
  doc.text(subtitle.value, subtitleX, 128, { align: 'center' })
  
  doc.setTextColor(0, 0, 0) // 恢复黑色
  doc.setFontSize(14)
  const contentLines = doc.splitTextToSize(content.value, pageWidth-80)
  
  // 保留空格字符
  doc.setCharSpace(0)
  doc.text(contentLines, 40, 170, { align: 'left', renderingMode: 'fill', charSpace: 0, preserveLeadingSpaces: true, lineHeightFactor: 1.2, maxWidth: pageWidth-80 })

  // 添加右下角文字和日期
  
  const formattedDate = `${currentDate.getFullYear()}年${String(currentDate.getMonth() + 1).padStart(2, '0')}月${String(currentDate.getDate()).padStart(2, '0')}日`
  doc.setTextColor(0, 0, 0) // 恢复黑色
  doc.setFontSize(24)
  // 添加文字
  doc.text(`纸上谈兵委员会\n${formattedDate}`, pageWidth - 180, pageHeight - 120, { align: 'center', lineHeightFactor: 1.4 })

  // 获取印章元素并转换为图片
  const sealElement = document.querySelector('.seal-container')
  if (sealElement) {
    const canvas = await html2canvas(sealElement, {
      backgroundColor: null,
      scale: 2,
      logging: false
    })
    const sealDataUrl = canvas.toDataURL('image/png')
    doc.addImage(sealDataUrl, 'PNG', pageWidth - 280, pageHeight - 220, 200, 200)
  }

  // 设置文件名并生成PDF
  const fileName = '纸上谈兵'
  doc.setProperties({
    title: fileName,
    subject: subtitle.value,
    author: '纸上谈兵委员会',
    keywords: '纸上谈兵,赵括,佛洛里*达州'
  })
  
  // 生成PDF数据URI
  const pdfDataUri = doc.output('datauristring',{filename:`${fileName}.pdf`})
  document.getElementById('pdf-preview').src = pdfDataUri + '#filename=' + encodeURIComponent(`${fileName}.pdf`) + '&zoom=75'
  } catch (error) {
    console.error('PDF生成失败:', error)
  } finally {
    isLoading.value = false
  }
}


onMounted(() => {
  handleSubmit()
})



</script>

<template>
  <div class="paper-container">
    <div class="left-panel">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <span class="app-name">纸上谈兵 荣耀</span>
      </div>
      
      <div class="form-section">
        <div class="input-group">
          <input
            v-model="title"
            type="text"
            placeholder="请输入一级标题"
            class="input-field"
          />
        </div>
        
        <div class="input-group">
          <input
            v-model="subtitle"
            type="text"
            placeholder="请输入二级标题"
            class="input-field"
          />
        </div>
        
        <div class="input-group">
          <textarea
            v-model="content"
            placeholder="请输入内容"
            class="input-field content-area"
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
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在生成PDF...</div>
      </div>
      <iframe id="pdf-preview" class="pdf-preview"></iframe>
    </div>
    <div class="divider">
    </div>
    <div class="right-panel">
      <div class="seal-view-container">
        <div class="top-panel">
                  <div class="logo-section">
                    <img src="@/assets/logo.svg" alt="Logo" class="logo" />
                    <span class="app-name">纸上谈兵*印章</span>
                  </div>
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
}

.left-panel {
  flex: 2;
  padding: 2rem;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.center-panel {
  flex: 2;
  padding: 0.5rem;
  position: relative;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
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
  padding: 2rem;
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

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-field {
  width: 100%;
  padding: 1rem;
  border: 1px solid #000000;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
  text-align: left;
}

.input-group:first-child .input-field {
  color: #000000 !important;
  font-size: 1.5rem !important;
  font-weight: bold !important;
}

.input-field:focus {
  border-color: #409eff;
  outline: none;
}

.content-area {
  min-height: 300px;
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
  border: none;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.seal-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
}

.top-panel {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-panel h2 {
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.top-panel .input-group {
  margin-bottom: 1.2rem;
}

.top-panel .input-group label {
  display: inline-block;
  width: 60px;
  color: #666;
  margin-right: 1rem;
}

.top-panel .input-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: calc(100% - 80px);
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
  background-color: #ffffff;
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
</style>

