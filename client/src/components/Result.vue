<script setup>
    import {defineProps} from "vue"
    const {quizQuestionLength, numberOfCorrectAnswers, scores} = defineProps(["quizQuestionLength", "numberOfCorrectAnswers", "scores"])
    console.log(scores,'fff');
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }
</script>

<template>
    <div class="results">
        <h3>Votre résultat</h3>
        <p v-if="numberOfCorrectAnswers === quizQuestionLength"> Bravo, tu as réussi entièrement le quizz ! 🎉 </p>
        <h1>{{numberOfCorrectAnswers}}/{{quizQuestionLength}}</h1>
        <span>Vos derniers résultats</span>
        <div class="containerScores">
            <div class="scores" v-for="(score) in scores" :key="score.id">
                <small>Le {{formatDate(score.created_at)}}</small>
                <p><span>{{score.score}}</span>/{{ score.totalquestions}}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .results {
        text-align: center;
        padding: 100px 0;
        display: flex;
        flex-direction: column;
    }

    p {
        font-size: 16px;
    }

    h1 {
        font-size: 80px;
    }

    .scores {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
    }

    .scores span {
        font-weight: bold;
    }
</style>