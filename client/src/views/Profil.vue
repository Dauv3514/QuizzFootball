<script setup>
  import useFetch from "../hooks/useFetch";
  import {ref, computed} from "vue"
  import EditProfil from "../components/EditProfil.vue"
  import {useRoute} from "vue-router"
  import { useAuthStore } from '../stores/auth'

  const isModalOpen = ref(false);

  const route = useRoute()
  const themeId = route.params.themeId;
  const authStore = useAuthStore()

  const {data: statsUser} = useFetch(`/api/profil/statsUser`)
  const {data: statsUsers} = useFetch(`/api/results/themes/${themeId}/scoresUsers`)
  const {data: getUserProfil} = useFetch(`/api/profil/getUserProfil`);
  const {data: getQuizAttempts} = useFetch(`/api/results/quizAttempts`);
  const {data: getBadgesUser} = useFetch(`/api/profil/getBadgesUser`);

  console.log(getBadgesUser, 'ok');

  const profileImage = computed(() => {
    return getUserProfil.value && getUserProfil.value.user 
    ? `/api/uploads/${getUserProfil.value.user.profile_image}` 
    : null;
  })
  const badgesUser = computed(() => getBadgesUser.value?.badges || []);
  const userData = computed(() => getUserProfil.value);
  const statsUserData = computed(() => statsUser.value?.statsUser || []);
  const statsUsersData = computed(() => statsUsers.value?.scores || []);
  const currentUser = computed(() => authStore.user.username);
  const getUsersCompletedQuizzes = computed(() => {
    const usersStats = {};

    statsUsersData.value.forEach(item => {
      if (item.score === item.totalquestions) {
        if (usersStats[item.username]) {
          usersStats[item.username].completedQuizzes += 1;
        } else {
          usersStats[item.username] = {
            user_id: item.user_id,
            username: item.username,
            completedQuizzes: 1,
            attempts: 0,
            average_time: 0
          };
        }
      }
    });

    if (getQuizAttempts.value && Array.isArray(getQuizAttempts.value.attempts)) {
        getQuizAttempts.value.attempts.forEach(attempt => {
            Object.values(usersStats).forEach(user => {
          if (user.user_id === attempt.user_id) {
            user.attempts = parseInt(attempt.quiz_attempts, 10);
            user.average_time = attempt.average_time;
          }
        });
      });
    } else {
      console.warn("Données de quizAttempts non disponibles ou attempts n'est pas un tableau.");
    }

    Object.values(usersStats).forEach(user => {
      if (user.attempts > 0) {
        user.successRate = (user.completedQuizzes / user.attempts) * 100;
      } else {
        user.successRate = 0;
      }
    });

    if (!usersStats[currentUser.value]) {
      usersStats[currentUser.value] = {
        username: currentUser.value,
        completedQuizzes: 0,
        attempts: 0,
        successRate: 0,
        average_time: 0
      };
    }

    return Object.values(usersStats)
      .sort((a,b) => b.completedQuizzes - a.completedQuizzes);
  });

  const getBadgeDescription = (badgeName) => {
    return badgeDescriptions[badgeName] || "Aucune description disponible";
  }

  const editProfil = () => {
    isModalOpen.value = true;
  }

  const closeModal = () => {
    isModalOpen.value = false;
  }

  const updateUserData = (updatedUser) => {
      userData.value.user.username = updatedUser.username;
      userData.value.user.email = updatedUser.email;
      userData.value.user.profile_image = updatedUser.profile_image;
  }

  const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      })
  }

  const badgeDescriptions = {
    "Débutant": "Tu as terminé au moins 1 quiz",
    "Intermédiaire": "Tu as terminé au moins 4 quiz",
    "Expert": "Tu as terminé au moins 7 quiz",
    "Explorateur": "Tu as joué au moins 1 fois aux quiz",
    "Challenger": "Tu as joué au moins 30 fois aux quiz",
    "Addict": "Tu as joué au moins 70 fois aux quiz"
  };
</script>

<template>
  <div class="profile-page" v-if="authStore.isAuthenticated">
    <template v-if="userData">
      <h1>Bienvenue sur ton profil</h1>
      <span>{{ userData?.user?.username }}</span>
      <p>Mail: {{ userData?.user?.email }}</p>
      <img 
        v-if="profileImage" 
        :src="profileImage" 
        alt="Photo de profil"
        class="profilImage"
      />
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
      <div class="containerGlobal">
        <div class="statsUser">
          <h3 v-if="statsUserData.length > 0">{{ statsUserData.length }} quiz terminés</h3>
          <template v-if="statsUserData.length > 0">
            <div v-for="statsUser in statsUserData" :key="statsUser.username" class="totalStatsUser">
              <div class="resultsUser">
                <p>{{ statsUser.name }}</p>
              </div>
              <p class="scoresUser">{{ statsUser.score }} / {{ statsUser.totalquestions }}</p>
              <div class="image">
                <img :src="statsUser.image" alt="image">
              </div>
            </div>
          </template>
        <p v-else>Tu n'as pas encore terminé de Quizz</p>
      </div>
        <div class="badgesUser">
          <h3> {{badgesUser.length}} badges obtenus</h3>
          <div v-for="badges in badgesUser" :key="badges.id">
            <div class="badges">
              <div class="nameBadges">
                <p class="name">{{badges.badge_name}}</p>
                <p>{{badges.badge_icon}}</p>
              </div>
              <p>{{ getBadgeDescription(badges.badge_name) }}</p>
              <p>Obtenu le {{formatDate(badges.created_at)}}</p>
            </div>
          </div>
        </div>
      
        <div class="positionUser">
          <h3>Classement par rapport aux autres</h3>
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Nom d'utilisateur</th>
                <th>Quiz terminés</th>
                <th>Tentatives aux quiz</th>
                <th>Pourcentage de réussite</th>
                <th>Réponse moyenne aux quiz</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(userStats, index) in getUsersCompletedQuizzes" 
                :key="userStats.id"
                :class="{'highlight-row': userStats.username === currentUser}"  
              >
                <td>{{ index + 1 }}</td>
                <td>{{ userStats.username }}</td>
                <td>{{ userStats.completedQuizzes }}</td>
                <td>{{ userStats.attempts }}</td>
                <td>{{ userStats.successRate.toFixed(2) }}%</td>
                <td>{{ userStats.average_time }}s</td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .profile-page {
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }

  .profile-page span {
    font-size: 20px;
    font-weight: bold;
  }

  .profilImage {
    margin-top: 5px;
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #ddd;
  }

  button {
    margin-top: 10px;
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
    margin-top: 10px;
    font-size: 11px;
  }

  .resultsUser p {
    font-weight: bold;
  }

  .scoresUser {
    display: flex;
    justify-content: center;
    font-size: 12px;
  }

  .image {
    display: flex;
    justify-content: center;
  }

  .totalStatsUser img {
    width: 86%;
    height: 100px;
    margin: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f4f4f4;
  }

  .highlight-row {
    background-color: rgba(248, 170, 170, 0.835);
  }

  .containerGlobal {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 40px;
    gap: 40px;
    width: 100%;
    max-width: 1200px;
    padding: 0 0;
  }

  .badges {
    margin-bottom: 16px;
  }

  .nameBadges {
    display: flex;
    gap: 5px;
  }

  .nameBadges .name{
    font-weight: bold;
  }

  .positionUser {
    flex: 1;
    background: #fff;
    border-radius: 10px;
  }

  .position table {
    width: 100%;
    border-collapse: collapse;
  }

  .positionUser th, .positionUser td {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
  }

  @media (max-width: 768px) {
    .containerGlobal {
      flex-direction: column;
      align-items: center;
    }

    .positionUser {
      width: 100%;
      max-width: 400px;
    }

    .positionUser table {
      font-size: 14px;
    }
  }
</style>
