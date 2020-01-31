import Vue from 'vue';
import App from './App.vue';
import AppCanvas from './AppCanvas.vue';

new Vue({
  el: '#app',
  render: h => h(App),
});

new Vue({
  el: '#app-canvas',
  render: h => h(AppCanvas),
});