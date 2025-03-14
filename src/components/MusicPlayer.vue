<template>
  <div>
    <button @click="togglePlay">{{ isPlaying ? '暂停' : '播放' }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      audio: null,
      isPlaying: false
    };
  },
  methods: {
    togglePlay() {
      if (!this.audio) {
        this.audio = new Audio('/music.mp3');
      }
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }
};
</script>