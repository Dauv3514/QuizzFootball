import { ref } from 'vue'
import axios from 'axios'

export default function useFetch(url) {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const postData = async (payload) => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.post(url, payload, {
                withCredentials: true
            })
            data.value = res.data
            console.log('Données envoyées:', res.data)
        } catch(err) {
            console.error('Erreur post:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { loading, error, postData, data }
}