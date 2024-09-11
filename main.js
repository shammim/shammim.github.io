import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.querySelector('#theme-toggle')
  const currentTheme = localStorage.getItem('theme')

  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }

  toggleSwitch.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark')
    let theme = 'light'
    if (document.documentElement.classList.contains('dark')) {
      theme = 'dark'
    }
    localStorage.setItem('theme', theme)
  })
})
