<template>
  <button @click="toggleWebSocket" class="ws-connect-btn">
    {{ wsConnection ? '断开' : '连接' }}
  </button>
</template>

<script>
export default {
  props: {
    wsConnection: Boolean
  },
  methods: {
    toggleWebSocket() {
      if (this.wsConnection) {
        this.$emit('disconnect');
      } else {
        this.$emit('connect');
      }
    }
  }
};
</script>

<style scoped>
.ws-connect-btn {
  background-color: green;
}
</style>