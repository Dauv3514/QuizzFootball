<script setup>
  import useFetch from "../hooks/useFetch";
  import {ref, computed} from "vue"
  import EditProfil from "../components/EditProfil.vue"

  const { data, loading, error } = useFetch(`/api/profil/getUserProfil`);

  const isModalOpen = ref(false);
  const userData = computed(() => data.value);

  const editProfil = () => {
    console.log('edit profile');
    isModalOpen.value = true;
  }

  const closeModal = () => {
    isModalOpen.value = false;
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
      />
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
</style>
