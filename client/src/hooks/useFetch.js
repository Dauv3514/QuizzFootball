import { ref, watchEffect } from 'vue'
import axios from 'axios'

export default function useFetch(url) {
    const data = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const fetchData = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get(url)
            data.value = res.data
            console.log('Données reçues:', res.data)
        } catch(err) {
            console.error('Erreur fetch:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const reFetch = () => {
        fetchData()
    }

    watchEffect(() => {
        if(url) fetchData()
    })

    return { data, loading, error, reFetch }
}