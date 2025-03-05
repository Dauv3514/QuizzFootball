<script setup>
import useFetchPut from "../hooks/useFetchPut";
import useFetch from "../hooks/useFetch";
import {reactive, ref, defineEmits, defineProps, watch, computed} from 'vue';

const emit = defineEmits();
const { isModalOpen, userData } = defineProps(['isModalOpen', 'userData']);

const {data: getUserProfil} = useFetch(`/api/profil/getUserProfil`);
const profileImage = computed(() => {
    return getUserProfil.value && getUserProfil.value.user 
    ? `/api/uploads/${getUserProfil.value.user.profile_image}` 
    : null;
})

console.log(profileImage,'rrf');

const closeModal = () => {
    emit('close');
};

const userInfos = reactive({
    username: "",
    email: "",
    password: "",
    profileImage: null
});

const filePreview = ref(null);

const messageSuccess = ref(false);

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        userInfos.profileImage = file;
        const reader = new FileReader();
        reader.onload = () => {
            filePreview.value = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

watch(() => userInfos.username, (newValue) => {
    console.log(newValue, 'vvvv');
});

const handleSubmit = async () => {
    const { putData, data } = useFetchPut(`/api/profil/updateUserProfil`, userInfos);
    const formData = new FormData();
    formData.append("username", userInfos.username);
    formData.append("email", userInfos.email);
    formData.append("password", userInfos.password);
    if (userInfos.profileImage) {
        formData.append("profileImage", userInfos.profileImage);
    }
    await putData(formData);
    if (data.value?.success) {
        messageSuccess.value = true;
        emit('updateUserData', { username: userInfos.username, email: userInfos.email });
    }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <span @click="closeModal" class="close-btn">×</span>
      <h2>Modifier mon profil</h2>

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

        <div class="input-group">
          <p>Modifier la photo de profil</p>
          <input 
              type="file" 
              id="file-upload" 
              @change="handleFileUpload" 
              accept="image/*" 
              style="display:none" 
          />
          <router-link v-if="profileImage" to="/profil" class="profilPicture">
            <img
                v-if="profileImage"
                :src="profileImage"
                alt="Photo de profil"
                class="profilImage"
            />
          </router-link>
          <!-- <label for="file-upload" class="file-upload-label">
            <span v-if="userInfos.profileImage" class="file-name">Image sélectionnée</span>
            <img v-if="!filePreview && !userInfos.profileImage" 
                 src="https://static.vecteezy.com/ti/vecteur-libre/t1/2318271-icone-de-profil-utilisateur-vectoriel.jpg" 
                 alt="Icône de profil" 
                 class="profile-icon" />
            <img v-else :src="filePreview" alt="Prévisualisation" class="profile-icon" />
          </label> -->
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
        color: #333;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: color 0.3s ease;
        font-size: 24px;
        top: 5px;
        right: 14px;
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

    .input-group p {
        color: #003e66;
        display: flex;
        justify-content: center;
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

    .profile-icon {
        height: 40px;
        width: 40px;
        border-radius: 50%;
    }

    .file-upload-label {
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

    .file-upload-label:hover {
        background-color: white;
    }

    .profilImage {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid #ddd;
    }

    .profilPicture {
        display: flex;
        justify-content: center;
        margin-top: 6px;
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

    .form-actions button {
        width: 100%;
    }
    }
</style>