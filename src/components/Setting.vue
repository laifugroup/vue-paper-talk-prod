<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Seal from './Seal.vue'

const router = useRouter()
const inputTopText = ref('狮子湖越野挑战赛委员会')
const inputCenterText = ref('官方认证')
const inputBottomCode = ref('51000020161224')


const pdfTitle = ref('狮子湖越野挑战赛委员会')
const pdfSubTitle = ref('第一届狮子湖越野挑战赛')
const pdfContent = ref(`    恭喜您在2023-2024年度"狮子湖越野挑战赛"中完成挑战，特此证明。\n\n特授予您"狮子湖极限挑战者"荣誉称号！`)
const pdfNickName = ref('川A78BBQ')
const firstTitle = ref('狮子湖越野挑战赛')
</script>

<template>
  <div class="settings-container">
    <div class="left-panel">
      <div class="firstTitle">{{ firstTitle }}</div>
      <div class="form-section">
        <div class="input-group">
          <div>标题：</div>
          <input
            v-model="pdfTitle"
            type="text"
            placeholder="请输入一级标题"
            class="input-field"
          />
        </div>
        
        <div class="input-group">
          <div>副标题：</div>
          <input
            v-model="pdfSubTitle"
            type="text"
            placeholder="请输入二级标题"
            class="input-field"
          />
        </div>

        <div class="input-group">
          <div>昵称：</div>
          <input
            v-model="pdfNickName"
            type="text"
            placeholder="请输入昵称"
            class="input-field"
          />
        </div>
        
        <div class="input-group">
          <div>内容：</div>
          <textarea
            v-model="pdfContent"
            placeholder="请输入内容（最多5行）"
            class="input-field content-area"
            rows="2"
          ></textarea>
        </div>

        <!---证书 -->
        <label for="topText">证书</label>
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
      
      <Seal :topText="inputTopText" :centerText="inputCenterText" :bottomCode="inputBottomCode" />

      </div>
      <!--增加生成按钮-->
      <button @click="router.push('/lion')" class="submit-btn">
        生成证书
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
  padding: 0 0.5rem;
}

.left-panel {
  flex: 1;
  padding: 0.5rem;
  background-color: white;
  box-shadow: none;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-section {
  width: 100%;
  margin: 0 auto;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.input-group {
  margin-bottom: 1.2rem;
}

.input-field {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.content-area {
  resize: vertical;
  min-height: 100px;
}

.seal-view-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.top-panel {
  background-color: #f3f3f3;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-panel .input-group {
  margin-bottom: 1.0rem;
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

.submit-btn {
  width: calc(100% - 4rem);
  padding: 0.8rem 2rem;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 10;
}

.submit-btn:hover {
  background-color: #ff6666;
}
.firstTitle {
  font-size: 2rem;
  text-align: center;
  color: #ff0000;
  margin-bottom: 2rem;
}
</style>