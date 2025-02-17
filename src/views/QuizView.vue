<script setup>
    import Question from "../components/Question.vue"
    import QuizHeader from "../components/QuizHeader.vue"
    import Result from "../components/Result.vue"
    import Answer from "../components/Answer.vue"
    import Answers from "../components/Answers.vue"
    import Index from "../components/Index.vue"
    import {useRoute} from "vue-router"
    import { ref, computed } from "vue"
    import quizs from "../data/quiz.json"

    const route = useRoute()
    const quizId = parseInt(route.params.id)
    const quiz = quizs.find(q => q.id === quizId)
    const currentQuestionIndex = ref(0)
    const numberOfCorrectAnswers = ref(0)
    const answerMessage = ref('')
    const showResults = ref(false)
    // const questionStatus = ref(`${currentQuestionIndex.value}/${quiz.questions.length}`)
    // watch(()=> currentQuestionIndex.value, () => {
    //     questionStatus.value = `${currentQuestionIndex.value}/${quiz.questions.length}`
    // })
    const questionStatus = computed(()=> `${currentQuestionIndex.value}/${quiz.questions.length}`)
    const barPercentage = computed(()=> `${currentQuestionIndex.value/quiz.questions.length * 100}%`)
    const onOptionSelected = (isCorrect) => {
        console.log("emitted event", isCorrect)
        if(isCorrect) {
            numberOfCorrectAnswers.value++;
            answerMessage.value = "Bonne réponse ! 🎉"
        } else {
            answerMessage.value = "Mauvaise réponse"
        }
        if(quiz.questions.length - 1 === currentQuestionIndex.value) {
            showResults.value = true
        }
        console.log("n", numberOfCorrectAnswers)
        currentQuestionIndex.value++
        console.log("n2", currentQuestionIndex)
    }
    console.log(quiz.questions, 'oui');
    const answersTrue = computed(()=> 
        quiz.questions.map(question => {
            const correctOption = question.options.find(option => option.isCorrect === true)
            return correctOption.text;
        })
    )
    console.log('Réponses correctes:', answersTrue.value);
</script>

<template>
    <div>
        <QuizHeader 
            :questionStatus="questionStatus" 
            :barPercentage="barPercentage"
        />
        <div>
            <Question
                v-if="!showResults"
                :question="quiz.questions[currentQuestionIndex]"
                @selectOption="onOptionSelected"
            />
            <Result 
                v-else 
                :quizQuestionLength="quiz.questions.length"
                :numberOfCorrectAnswers="numberOfCorrectAnswers"
            />
            <Index v-if="!showResults" :question="quiz.questions[currentQuestionIndex]"/>
            <Answer :message="answerMessage"/>
            <Answers 
                v-if="showResults"
                :answersTrue="answersTrue"
            />
        </div>
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