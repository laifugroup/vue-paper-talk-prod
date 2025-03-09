<script setup>
import Paper from '../components/Paper.vue'
import Seal from '../components/Seal.vue'

</script>

<template>
  <div class="pager-container">
    <div class="paper-section">
      <!-- <Seal/> -->
      <Paper />
    </div>
  </div>
</template>

<style scoped>
.pager-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.paper-section {
  flex: 1;
  height: 100%;
  border-right: 1px solid var(--color-border);
}

.preview-section {
  width: 40%;
  height: 100%;
  background-color: #e0e0e0;
}
</style>