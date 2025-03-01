<script setup>
    import Question from "../components/Question.vue"
    import QuizHeader from "../components/QuizHeader.vue"
    import Result from "../components/Result.vue"
    import Answer from "../components/Answer.vue"
    import Answers from "../components/Answers.vue"
    import Index from "../components/Index.vue"
    import {useRoute} from "vue-router"
    import {ref, computed, watch} from "vue"
    import useFetch from "../hooks/useFetch";
    import useFetchPost from "../hooks/useFetchPost";

    const route = useRoute()
    const themeId = parseInt(route.params.id);
    const {data, loading, error} = useFetch(`/api/themes/${themeId}`)
    console.log(data, 'lesdatas');
    const {data: allScoresUser, refetch: refetchScores} = useFetch(`/api/results/themes/${themeId}/scores`)
    watch(data, (newData) => {
        console.log("Données reçues :", newData);
    });

    const currentQuestionIndex = ref(0)
    const numberOfCorrectAnswers = ref(0)
    const answerMessage = ref('')
    const showResults = ref(false)
    const lastQuestion = computed(()=> currentQuestionIndex.value === data.value.questions.length)
    const quizQuestionLength = computed(() => data.value?.questions?.length)
    const currentQuestion = computed(() => data.value?.questions?.[currentQuestionIndex.value])
    const questionStatus = computed(()=> `${currentQuestionIndex.value}/${data.value?.questions?.length}`)
    const barPercentage = computed(()=> `${currentQuestionIndex.value/data.value?.questions?.length * 100}%`)
    const onOptionSelected = async ({isCorrect, isLastQuestion}) => {
        if(isCorrect) {
            numberOfCorrectAnswers.value++;
            answerMessage.value = "Bonne réponse ! 🎉"
        } else {
            answerMessage.value = "Mauvaise réponse"
        }
        if(data.value.questions.length - 1 === currentQuestionIndex.value) {
            showResults.value = true
        }
        currentQuestionIndex.value++
        if(isLastQuestion) {
            try {
                const {postData} = useFetchPost(`/api/results/themes/${themeId}`)
                const payload = {
                    score: numberOfCorrectAnswers.value,
                    totalquestions: quizQuestionLength.value
                }
                await postData(payload)
                await refetchScores()

            } catch (error) {
                console.error('Erreur lors de l\'enregistrement du score:', error)
            }
        }
    }
    const answersTrue = computed(()=> 
        data.value?.questions?.map(question => {
            const correctOption = question.options.find(option => option.isCorrect === true)
            return correctOption.text;
        })
    )
</script>

<template>
    <div>
        <QuizHeader 
            :questionStatus="questionStatus" 
            :barPercentage="barPercentage"
            :lastQuestion="lastQuestion"
        />
        <div v-if="loading" class="loading">
            Chargement du Quizz
        </div>
        <div v-else-if="error" class="error">
            Une erreur est survenue : {{ error }}
        </div>
        <div v-else>
            <Question
                v-if="!showResults && currentQuestion"
                :question="currentQuestion"
                @selectOption="onOptionSelected"
                :currentQuestionIndex="currentQuestionIndex"
                :quizQuestionLength="quizQuestionLength"
            />
            <Result 
                v-else 
                :quizQuestionLength="quizQuestionLength"
                :numberOfCorrectAnswers="numberOfCorrectAnswers"
                :scores="allScoresUser.scores || []"
            />
            <Index 
                v-if="!showResults && currentQuestion" 
                :question="currentQuestion"
            />
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