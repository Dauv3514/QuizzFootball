<script setup>
    import Question from "../components/Question.vue"
    import QuizHeader from "../components/QuizHeader.vue"
    import {useRoute} from "vue-router"
    import { ref, computed } from "vue"
    import quizs from "../data/quiz.json"

    const route = useRoute()
    const quizId = parseInt(route.params.id)
    const quiz = quizs.find(q => q.id === quizId)
    const currentQuestionIndex = ref(0)
    // const questionStatus = ref(`${currentQuestionIndex.value}/${quiz.questions.length}`)
    // watch(()=> currentQuestionIndex.value, () => {
    //     questionStatus.value = `${currentQuestionIndex.value}/${quiz.questions.length}`
    // })
    const questionStatus = computed(()=> `${currentQuestionIndex.value}/${quiz.questions.length}`)
</script>

<template>
    <div>
        <QuizHeader :questionStatus="questionStatus"/>
        <div>
            <Question :question="quiz.questions[currentQuestionIndex]"/>
        </div>
        <button @click="currentQuestionIndex++">Question suivante</button>
    </div>
</template>

<style scoped>
    header {
        margin-top: 20px;
    }

    header h4 {
        font-size: 30px;
    }
</style>