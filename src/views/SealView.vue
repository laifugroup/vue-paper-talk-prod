<template>
  <div class="seal-view-container">
    <div class="left-panel">
      <a href="/" class="back-link">返回首页</a>
      <h2>纸上谈兵委员会</h2>
      <h2>印章生成</h2>
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
    
    <div class="right-panel">
      <Seal :topText="inputTopText" :centerText="inputCenterText" :bottomCode="inputBottomCode" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Seal from '../components/Seal.vue'

const inputTopText = ref('纸上谈兵委员会')
const inputCenterText = ref('官方认证')
const inputBottomCode = ref('51000020161224')
</script>

<style scoped>
.seal-view-container {
  display: flex;
  gap: 40px;
  margin: 0 auto;
  max-width: 1200px;
  padding: 20px;
}

.left-panel {
  flex: 0 0 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 350px;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

input {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 250px;
}

.back-link {
  color: #666;
  text-decoration: none;
  margin-bottom: 20px;
}

.back-link:hover {
  color: #333;
}
</style>