import { ref } from 'vue'
import axios from 'axios'

export default function useFetch(url) {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const fetchData = async (customUrl = url) => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get(customUrl, {
                withCredentials: true
            })
            data.value = res.data
            return res.data
        } catch(err) {
            error.value = err.message
            console.error('Erreur fetch:', err)
        } finally {
            loading.value = false
        }
    }

    if (url) {
        fetchData()
    }

    return { 
        data, 
        loading, 
        error, 
        refetch: fetchData  
    }
}