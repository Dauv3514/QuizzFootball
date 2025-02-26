<script setup>
    import { useRouter } from 'vue-router';
    import axios from 'axios';
    import useFetchPost from "../hooks/useFetchPost";
    import { useAuthStore } from '../stores/auth'

    const emit = defineEmits(['logout'])
    const router = useRouter();
    const authStore = useAuthStore()

    const logout = async () => {
        const { postData, data, error } = useFetchPost(`/api/auth/deconnexion`)
        
        await postData({})
        
        if (error.value) {
            console.error('Erreur de déconnexion:', error.value)
            return
        }
        if (data.value?.success) {
            authStore.logout()
            emit('logout')
            router.push('/')
            console.log('Déconnexion réussie')
        } else {
            console.error('Échec de la déconnexion:', data.value)
        }
    }

</script>

<template>
    <div class="deconnexion">
        <button @click="logout()" to="/deconnexion">Déconnexion</button>
    </div>
</template>

<style scoped>
  .deconnexion button {
    color: #003e66;
    text-decoration: none;
    font-weight: 600;
    font-size: 12px;
    background-color: white;
    border: white;
    cursor: pointer;
  }
</style>