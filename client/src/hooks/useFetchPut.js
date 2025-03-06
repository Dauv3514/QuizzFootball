import { ref } from 'vue'
import axios from 'axios'

export default function useFetchPut(url) {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const putData = async (payload) => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.put(url, payload, {
                withCredentials: true,
                headers: {}
            })
            data.value = res.data
            console.log('Données mises à jour:', res.data)
        } catch(err) {
            console.error('Erreur PUT:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { loading, error, putData, data }
}