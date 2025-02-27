<script setup>
  import useFetch from "../hooks/useFetch";
  const {data: userProfile} = useFetch(`/api/profil/getUserProfil`)
  console.log(userProfile, "bbbb");
  
</script>

<template>
  <div class="profile-page">
    <p>bon </p>
    <h1>Bienvenue sur ton profil <span>{{userProfile.value.user.username }}</span></h1>
    <p> Utilisateur: {{userProfile.value.user.username }}</p>
    <p> Mail: {{userProfile.value.user.email }}</p>
  </div>
</template>

<style scoped>
</style>