<script setup>
  import useFetch from "../hooks/useFetch";
  import {ref, computed} from "vue"
  import EditProfil from "../components/EditProfil.vue"

  const {data} = useFetch(`/api/profil/getUserProfil`);
  const {data: statsUser} = useFetch(`/api/profil/statsUser`)

  const userData = computed(() => data.value);
  const statsUserData = computed(() => statsUser.value.statsUser || []);

  const editProfil = () => {
    console.log('edit profile');
    isModalOpen.value = true;
  }

  const closeModal = () => {
    isModalOpen.value = false;
  }

  const updateUserData = (updatedUser) => {
      userData.value.user.username = updatedUser.username;
      userData.value.user.email = updatedUser.email;
  }
</script>

<template>
  <div class="profile-page">
    <template v-if="userData">
      <h1>Bienvenue sur ton profil</h1>
      <span>{{ userData?.user?.username }}</span>
      <p>Mail: {{ userData?.user?.email }}</p>
    </template>
    <button @click="editProfil">Modifier mon profil</button>
    <div v-if="isModalOpen" class="modal">
      <EditProfil 
        :isModalOpen="isModalOpen"
        :userData="userData"
        @close="closeModal"
        @updateUserData="updateUserData"
      />
    </div>
    <div class="statsUser">
      <h3>Bravo tu as terminé {{ statsUserData.length }} quiz ! 🎉🎉</h3>
      <template v-if="statsUserData">
        <div v-for="statsUser in statsUserData" :key="statsUser" class="totalStatsUser">
          <div class="resultsUser">
            <p>{{ statsUser.name }}</p>
            <p>{{ statsUser.score }} / {{ statsUser.totalquestions }}</p>
          </div>
          <img :src="statsUser.image" alt="">
        </div>
      </template>
      <p v-else>Tu n'as pas encore terminé de Quiz</p>
    </div>
  </div>
</template>

<style scoped>
    .profile-page {
      padding-top: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
    }

    .profile-page span {
      font-size: 20px;
      font-weight: bold;
    }

    button {
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

    button:hover {
        background-color: #333;
        transform: scale(1.05);
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .statsUser {
      margin-top: 40px;
    }

    h3 {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .resultsUser {
      display: flex;
      justify-content: center;
      gap: 5px;
    }

    .totalStatsUser img {
      width: 100%;
      height: 180px;
      margin: 0;
    }
</style>
