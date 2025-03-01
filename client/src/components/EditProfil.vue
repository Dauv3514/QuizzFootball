<script setup>
import useFetchPut from "../hooks/useFetchPut";
import {reactive, ref, defineEmits, defineProps, watch} from 'vue';

const emit = defineEmits();
const { isModalOpen, userData } = defineProps(['isModalOpen', 'userData']);

const closeModal = () => {
    emit('close');
};

const userInfos = reactive({
    username: "", 
    email: "", 
    password: ""
});

const messageSuccess = ref(false);

watch(() => userInfos.username, (newValue) => {
    console.log(newValue, 'vvvv');
})

const handleSubmit = async () => {
    const {putData, data} = useFetchPut(`/api/profil/updateUserProfil`, userInfos);
    const payload = {
        user: {
            username: userInfos.username,
            email: userInfos.email,
            password: userInfos.password
        }
    }
    await putData(payload)
    if (data.value?.success) {
        messageSuccess.value = true;
        emit('updateUserData', { username: userInfos.username, email: userInfos.email });
        console.log('oui');
    }
}

</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <span @click="closeModal" class="close-btn">×</span>
      <h2>Modifier ton profil</h2>

      <form @submit.prevent="handleSubmit" class="group">
        <div class="input-group">
        <label for="username">Nom d'utilisateur</label>
        <input 
            type="text" 
            id="username" 
            v-model="userInfos.username" 
            :placeholder="userData?.user?.username"
            autocomplete=""
        />
        </div>

        <div class="input-group">
        <label for="email">Email</label>
        <input 
            type="email" 
            id="email" 
            v-model="userInfos.email" 
            :placeholder="userData?.user?.email"
            autocomplete
        />
        </div>

        <div class="input-group">
        <label for="password">Mot de passe</label>
        <input 
            type="password" 
            id="password" 
            v-model="userInfos.password" 
            :placeholder="userData?.user?.password"
            autocomplete
        />
        </div>

        <div class="form-actions">
          <button type="submit">Sauvegarder</button>
        </div>
        <p v-if="messageSuccess" class="messageSuccess"> 
            La sauvegarde a bien été effectuée ! 🎉
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    .modal-content {
    background-color: white;
    padding: 18px 30px 30px 30px;
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    }

    .close-btn {
    position: absolute;
    top: 8px;
    right: 20px;
    font-size: 30px;
    color: #333;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: color 0.3s ease;
    }

    .close-btn:hover {
    color: #f44336;
    }

    .group {
        margin-top: 20px;
    }

    .input-group {
    margin-bottom: 15px;
    text-align: left;
    }

    .input-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    }

    .input-group input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 14px;
    }

    .input-group input:focus {
    border-color: #333;
    outline: none;
    }

    .form-actions {
    margin-top: 20px;
    }

    .form-actions button {
    margin-top: 30px;
    background-color: black;
    color: white;
    padding: 10px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    }

    .form-actions button:hover {
    background-color: #333;
    transform: scale(1.05);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .messageSuccess {
        margin-top: 20px;
    }

    @media (max-width: 768px) {
    .modal-content {
        padding: 20px;
        width: 90%;
    }
    }

    @media (max-width: 480px) {
    .modal-content {
        padding: 15px;
        width: 95%;
    }

    .close-btn {
        font-size: 24px;
        top: 5px;
        right: 10px;
    }

    .form-actions button {
        width: 100%;
    }
    }
</style>