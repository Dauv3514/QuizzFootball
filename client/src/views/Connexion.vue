<script setup>
  import { ref } from 'vue'
  import useFetchPost from "../hooks/useFetchPost";
  import { useRouter } from 'vue-router'

  const username = ref('')
  const password = ref('')
  const router = useRouter()

  const { postData, error, loading, data } = useFetchPost(`/api/auth/connexion`)

  const handleSubmit = async () => {
    const payload = {
      username: username.value,
      password: password.value
    }
    await postData(payload)
    if (data.value.success) {
      router.push('/')
    }
  }
</script>

<template>
  <div class="login-page">
    <div class="form">
      <h1>Se connecter</h1>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <form class="login-form">
        <input 
          type="text"  
          autocomplete="username" 
          placeholder="Nom d'utilisateur" 
          v-model="username"
        />
        <input 
          type="password"  
          autocomplete="current-password" 
          placeholder="Mot de passe" 
          v-model="password"
        />
        <button 
          @click.prevent="handleSubmit"
          :disabled="loading"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
        <p class="message">
          Pas encore inscrit ? 
          <router-link to="/inscription">Créer un compte</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .login-page {
    width: 360px;
    padding: 20% 0 0;
    margin: auto;
  }

  .form {
    position: relative;
    z-index: 1;
    background: #FFFFFF;
    max-width: 360px;
    margin: 0 auto 100px;
    padding: 45px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    border-radius: 8px;
  }

  .form h1 {
    margin: 0 0 30px;
    color: rgb(39, 192, 212);
    font-size: 24px;
    font-weight: 500;
  }

  .form input {
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
    border-radius: 4px;
  }

  .form button {
    text-transform: uppercase;
    outline: 0;
    background: rgb(39, 192, 212);
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
    transition: all 0.3s ease;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 10px;
  }

  .form button:hover {
    background: rgb(39, 192, 212);
  }

  .form button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }

  .form .message a {
    color: rgb(39, 192, 212);
    text-decoration: none;
    font-weight: 600;
  }

  .error-message {
    color: #ff4444;
    margin-bottom: 20px;
    font-size: 14px;
    background: #ffebee;
    padding: 10px;
    border-radius: 4px;
  }

  @media (max-width: 400px) {
    .login-page {
      width: 90%;
      padding-top: 20%;
    }
    
    .form {
      padding: 30px;
    }
  }
</style>