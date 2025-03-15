<script setup>
    import {defineProps} from "vue"
    const {
            quizQuestionLength, 
            numberOfCorrectAnswers, 
            formattedScores
        } = defineProps(["quizQuestionLength", "numberOfCorrectAnswers", "formattedScores"])
    
    const emit = defineEmits();
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const resetQuiz = () => {
        emit('reset')
    }

    console.log(formattedScores.scores, 'hein');
</script>

<template>
    <div class="results">
        <h3>Votre résultat</h3>
        <p v-if="numberOfCorrectAnswers === quizQuestionLength"> Bravo, tu as réussi entièrement le quizz ! 🎉 </p>
        <h1>{{numberOfCorrectAnswers}}/{{quizQuestionLength}}</h1>
        <span v-if="numberOfCorrectAnswers != quizQuestionLength" class="message">
            <button @click="resetQuiz">Recommencer le Quiz</button>
        </span>
        <span>Vos derniers résultats</span>
        <div class="containerScores">
            <div class="scores" v-for="(score) in formattedScores.scores" :key="score.id">
                <small>Le {{ formatDate(score.created_at) }}</small>
                <p><span>{{ score.score }}</span>/{{ score.totalquestions }}</p>
                <p>⏱️ en {{ score.timetaken }} secondes</p>
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

    .message {
        margin-bottom: 20px;
    }

    button {
        margin-bottom: 10px;
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