<script setup>
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const emit = defineEmits(['logout'])
    const router = useRouter();

    const logout = async () => {
        try {
            const response = await axios.post('http://localhost:8800/api/auth/deconnexion')
            if (response.data.success) {
                localStorage.removeItem('user');
                emit('logout')
                router.push('/');
                console.log('Déconnexion réussie', response.data.success);
            }
        } catch(error) {
            console.error('Erreur lors de la déconnexion');
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