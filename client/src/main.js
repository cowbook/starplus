import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useFormStore } from './stores/form'
const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)

const formStore = useFormStore(pinia)
formStore.hydrateFromCookie()
formStore.$subscribe(
	() => {
		formStore.persistToCookie()
	},
	{ detached: true }
)

app.mount('#app')