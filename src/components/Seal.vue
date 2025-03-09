<script setup>
import { defineProps } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  // 上半圆文字
  topText: {
    type: String,
    default: '纸上谈兵委员会'
  },
  // 五角星下方文字
  centerText: {
    type: String,
    default: '官方认证'
  },
  // 下半圆编码
  bottomCode: {
    type: String,
    default: '51000020161224'
  }
})

// 计算五角星的顶点坐标
const calculateStarPoints = (centerX, centerY, outerRadius) => {
  const points = []
  const innerRadius = outerRadius * 0.382 // 内圆半径，使用黄金分割比例
  
  for (let i = 0; i < 5; i++) {
    // 外圆顶点
    const outerAngle = (i * 72) * Math.PI / 180 // 从正上方开始，每72度一个顶点
    points.push([
      centerX + outerRadius * Math.sin(outerAngle),
      centerY - outerRadius * Math.cos(outerAngle)
    ])
    
    // 内圆顶点
    const innerAngle = (i * 72 + 36) * Math.PI / 180
    points.push([
      centerX + innerRadius * Math.sin(innerAngle),
      centerY - innerRadius * Math.cos(innerAngle)
    ])
  }
  
  return points.map(point => point.join(",")).join(" ")
}

const saveSealAsImage = () => {
  const sealElement = document.querySelector('.seal-container')
  if (!sealElement) return

  html2canvas(sealElement, {
    backgroundColor: null,
    scale: 2, // 提高导出图片质量
    logging: false
  }).then(canvas => {
    // 创建下载链接
    const link = document.createElement('a')
    link.download = 'seal.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  })
}
</script>

<template>
  <div class="seal-container">
    <svg class="seal" viewBox="0 0 400 400">
      <!-- 外圆边框 -->
      <circle
        cx="200"
        cy="200"
        r="196"
        fill="none"
        stroke="#FF0000"
        stroke-width="4"
      />
      
      <!-- 上半圆文字 -->
      <path
        id="top-text-path"
        d="M50,200 A150,150 0 0,1 350,200"
        fill="none"
      />
      <text class="top-text">
        <textPath href="#top-text-path" startOffset="50%" text-anchor="middle">
          {{ topText }}
        </textPath>
      </text>
      
      <!-- 五角星 -->
      <polygon
        :points="calculateStarPoints(200, 200, 60)"
        class="star"
      />
      
      <!-- 五角星下方文字 -->
      <text
        x="200"
        y="300"
        class="center-text"
        text-anchor="middle"
      >
        {{ centerText }}
      </text>
      
      <!-- 下半圆编码 -->
      <path
        id="bottom-text-path"
        d="M50,200 A150,150 0 0,0 350,200"
        fill="none"
      />
      <text class="bottom-text">
        <textPath href="#bottom-text-path" startOffset="50%" text-anchor="middle">
          {{ bottomCode }}
        </textPath>
      </text>
    </svg>

    <div class="input-group">
      <button @click="saveSealAsImage">下载印章</button>
    </div>

  </div>
</template>

<style scoped>
.seal-container {
  display: inline-block;
  width: 200px;
  height: 200px;
}

.seal {
  width: 100%;
  height: 100%;
}

.top-text {
  font-size: 42px;
  fill: #FF0000;
  font-weight: bold;
  letter-spacing: 10px;
}

.star {
  fill: rgba(255, 0, 0, 0.85);
  transform-origin: center;
  transform: rotate(0deg);
}

.center-text {
  font-size: 38px;
  fill: #FF0000;
  font-weight: normal;
}

.bottom-text {
  font-size: 22px;
  fill: #FF0000;
  transform: translate(0, 15px);
  letter-spacing: 10px;
}

.input-group {
  text-align: center;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  background-color: #FF0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #E60000;
}
</style>