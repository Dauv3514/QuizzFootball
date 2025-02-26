<script setup>
    import {defineProps} from "vue"
    import {useRouter} from "vue-router"
    import { useAuthStore } from '../stores/auth'

    const { data, bestScore } = defineProps(['data', 'bestScore'])
    console.log(data, 'oui');
    console.log(bestScore, 'oui2');
    const router = useRouter()
    const authStore = useAuthStore()

    const navigateToQuiz = () => {
        router.push(`/quiz/${data.id}`)
    }

</script>

<template>
    <div class="card" @click="navigateToQuiz">
        <img :src="data.image" alt="">
        <div class="card-text">
            <h2>{{ data.name }}</h2>
            <p class="numberQuestions">{{ data.questions.length }} questions</p>
            <template v-if="authStore.isAuthenticated">
                <p v-if="bestScore === data.questions.length" class="best-score">
                    Bravo, tu as réussi le quizz ! 🎉
                </p>
                <p v-else>
                    Ton meilleur score :  <span>{{ bestScore }}</span> / {{ data.questions.length }}
                </p>
            </template>
        </div>
    </div>
</template>

<style scoped>
    .card {
        width: 310px;
        overflow: hidden;
        border-radius: 2%;
        box-shadow : 1px 1px 10px rgba(0,0,0,0.1);
        margin-bottom: 35px;
        margin-right: 20px;
        cursor: pointer;
    }

    .card img {
        width: 100%;
        height: 190px;
        margin: 0;
    }

    .card span {
        font-weight: bold;
    }

    .card .card-text {
        padding: 0px 5px 6px 5px;
    }

    .card .card-text h2 {
        font-weight: bold;
    }

    .numberQuestions {
        font-size: 18px;
    }
</style>