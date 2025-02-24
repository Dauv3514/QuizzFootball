<script setup>
    import {defineProps} from "vue"
    import {RouterLink} from "vue-router"
    const {quizQuestionLength, numberOfCorrectAnswers} = defineProps(["quizQuestionLength", "numberOfCorrectAnswers"])
</script>

<template>
    <div class="results">
        <p> Vos résultats </p>
        <h1>{{numberOfCorrectAnswers}}/{{quizQuestionLength}}</h1>
        <p v-if="numberOfCorrectAnswers === quizQuestionLength"> Bravo, tu as réussi entièrement le quizz ! 🎉 </p>
        <span class="message">
            <RouterLink to="/"> Retour à l'accueil</RouterLink>
        </span>
    </div>
</template>

<style scoped>
    .results {
        text-align: center;
        padding: 100px 0;
    }

    p {
        font-size: 25px;
    }

    h1 {
        font-size: 80px;
    }
    
    .message a {
        color: #003e66;
        text-decoration: none;
        font-weight: 600;
    }
</style>