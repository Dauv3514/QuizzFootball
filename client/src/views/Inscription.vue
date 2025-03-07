<script setup>
  import { ref } from 'vue'
  import useFetchPost from "../hooks/useFetchPost";
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'

  const username = ref('')
  const password = ref('')
  const email = ref('')
  const router = useRouter()
  const authStore = useAuthStore()
  const profileImage = ref(null);
  const filePreview = ref(null);

  const {postData, error, data, loading } = useFetchPost(`/api/auth/inscription`)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      profileImage.value = file;
      const reader = new FileReader();
      reader.onload = () => {
        filePreview.value = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    // const payload = {
    //   username: username.value,
    //   password: password.value,
    //   email: email.value
    // }
    const formData = new FormData();
    formData.append("username", username.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    if (profileImage.value) {
      formData.append("profileImage", profileImage.value);
    }
    await postData(formData);
      if (data.value?.success) {
      authStore.setUser(data.value.user)
      router.push('/');
    }
  }
</script>

<template>
<div class="login-page">
    <div class="form">
      <h1>S'inscrire</h1>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <form class="register-form">
        <input type="text"  autocomplete="text" placeholder="Nom d'utilisateur" v-model="username"/>
        <input type="email"  autocomplete="email" placeholder="Email" v-model="email"/>
        <input type="password"  autocomplete="password" placeholder="Mot de passe" v-model="password"/>
        <input type="file" id="file-upload" @change="handleFileUpload" accept="image/*" style="display:none" />
        <p>Choisir une photo de profil</p>
        <label for="file-upload" class="file-upload-label">
          <span v-if="fileName" class="file-name">{{ fileName }}</span>
          <img v-if="!filePreview" 
              src="https://static.vecteezy.com/ti/vecteur-libre/t1/2318271-icone-de-profil-utilisateur-vectoriel.jpg" 
              alt="Icône de profil" 
              class="profile-icon" />
          <img v-else :src="filePreview" alt="Prévisualisation" class="profile-icon" />
        </label>
        <button @click.prevent="handleSubmit">S'inscrire</button>
        <p class="message">
          Déjà inscrit ? 
          <router-link to="/connexion">Se connecter</router-link>
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
    color: #003e66;
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
    background: #003e66;
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
    background: #003e66;
  }

  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }

  .form .message a {
    color: #003e66;
    text-decoration: none;
    font-weight: 600;
  }

  .form .file-upload-label {
    display: inline-block;
    background-color: white;
    color: white;
    font-size: 14px;
    cursor: pointer;
    border-radius: 4px;
    margin: 10px 0;
    text-align: center;
    transition: background-color 0.3s ease;
  }

  .form .file-upload-label:hover {
    background-color: white;
  }

  .form .file-upload-label .file-name {
    display: inline-block;
    margin-left: 10px;
    color: #6c757d;
    font-style: italic;
  }

  .form p {
    color: #003e66;
  }

  .profile-icon {
    height: 40px;
    width: 40px;
  }

  @media (max-width: 400px) {
    .login-page {
      width: 90%;
      padding-top: 20%;
    }
    
    .form {
      padding: 30px;
    }
    .error-message {
      color: #ff4444;
      margin-bottom: 20px;
      font-size: 14px;
      background: #ffebee;
      padding: 10px;
      border-radius: 4px;
    }
  }
</style>