<script setup>
import { ref } from 'vue'
import { jsPDF } from 'jspdf'
import SourceHanSansCN from '@/assets/fonts/SourceHanSansCN-Regular.ttf'

const title = ref('')
const subtitle = ref('')
const content = ref('')

const handleSubmit = async () => {
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
  
  // 设置字体大小和位置
  doc.setFontSize(24)
  const titleWidth = doc.getStringUnitWidth(title.value) * doc.getFontSize()
  const pageWidth = doc.internal.pageSize.getWidth()
  const titleX = (pageWidth - titleWidth) / 2
  doc.text(title.value, titleX, 50, { align: 'center' })
  
  doc.setFontSize(16)
  const subtitleWidth = doc.getStringUnitWidth(subtitle.value) * doc.getFontSize()
  const subtitleX = (pageWidth - subtitleWidth) / 2
  doc.text(subtitle.value, subtitleX, 80, { align: 'center' })
  
  doc.setFontSize(12)
  const contentLines = doc.splitTextToSize(content.value, pageWidth - 80)
  doc.text(contentLines, 40, 120)
  
  // 设置文件名并生成PDF
  const fileName = '纸上谈兵'
  doc.setProperties({
    title: fileName,
    subject: subtitle.value,
    author: '纸上谈兵委员会',
    keywords: '纸上谈兵,PDF生成'
  })
  
  // 生成PDF数据URI
  const pdfDataUri = doc.output('dataurlstring')
  
  // 添加文件名和缩放参数并设置预览
  document.getElementById('pdf-preview').src = pdfDataUri + '#filename=' + encodeURIComponent(`${fileName}.pdf`) + '&zoom=75%'
}
</script>

<template>
  <div class="paper-container">
    <div class="left-panel">
      <div class="logo-section">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <span class="app-name">纸上谈兵</span>
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
        
        <button @click="handleSubmit" class="submit-btn">生成预览</button>
      </div>
    </div>
    
    <div class="divider">
    </div>
    <div class="center-panel">
      <iframe id="pdf-preview" class="pdf-preview"></iframe>
    </div>
    <div class="divider">
    </div>
    <div class="right-panel">
     
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
  padding: 0rem;
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
  padding: 0rem;
  background-color: white;
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
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
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
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #66b1ff;
}

.pdf-preview {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>