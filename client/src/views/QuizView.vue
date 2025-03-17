<script setup>
    import Question from "../components/Question.vue"
    import QuizHeader from "../components/QuizHeader.vue"
    import Result from "../components/Result.vue"
    import Answer from "../components/Answer.vue"
    import Answers from "../components/Answers.vue"
    import Index from "../components/Index.vue"
    import {useRoute} from "vue-router"
    import {ref, computed, watch, onMounted} from "vue"
    import useFetch from "../hooks/useFetch";
    import useFetchPost from "../hooks/useFetchPost";
    import {useQuizTimeTaken} from '../stores/quizTimeTaken';

     // Déclaration des variables de routage et de données
    const route = useRoute()
    const themeId = parseInt(route.params.id);

     // Récupération des données du quiz et des scores utilisateurs
    const {data, loading, error} = useFetch(`/api/themes/${themeId}`)
    const {data: allScoresUser, refetch: refetchScores} = useFetch(`/api/results/themes/${themeId}/scores`)

    // État du quiz
    const currentQuestionIndex = ref(0)
    const numberOfCorrectAnswers = ref(0)
    const answerMessage = ref('')
    const showResults = ref(false)
    const userAnswers = ref([])

    // Quiz store pour gérer le temps du quiz
    const quizStore = useQuizTimeTaken();

    // Calculs dérivés et métriques
    const lastQuestion = computed(()=> currentQuestionIndex.value === data.value.questions.length)
    const quizQuestionLength = computed(() => data.value?.questions?.length)
    const currentQuestion = computed(() => data.value?.questions?.[currentQuestionIndex.value])
    const questionStatus = computed(()=> `${currentQuestionIndex.value}/${data.value?.questions?.length}`)
    const barPercentage = computed(()=> `${currentQuestionIndex.value/data.value?.questions?.length * 100}%`)
    const formattedScores = computed(() => allScoresUser.value);
    const correctAnswers = computed(()=> 
        data.value?.questions?.map(question => {
            const correctOption = question.options.find(option => option.isCorrect === true)
            return correctOption.text;
        })
    )

    // Fonction pour réinitialiser le quiz
    const resetQuiz = () => {
        currentQuestionIndex.value = 0
        numberOfCorrectAnswers.value = 0
        userAnswers.value = []
        showResults.value = false
    }

    // Initialisation du quiz au montage
    onMounted(() => {
        if (!quizStore.startTime.value) {
            quizStore.startQuiz();
        }
    });
    
    // Sélection d'une option
    const onOptionSelected = async ({text, isCorrect, isLastQuestion}) => {
        userAnswers.value.push(text);
        updateAnswerMessage(isCorrect);

        if (isCorrect) numberOfCorrectAnswers.value++;
        
        if(data.value.questions.length - 1 === currentQuestionIndex.value) {
            showResults.value = true
        }
        currentQuestionIndex.value++;

        if(isLastQuestion) {
            await handleEndOfQuiz();
        }
    }

    // Mise à jour du message après chaque réponse
    const updateAnswerMessage = (isCorrect) => {
        answerMessage.value = isCorrect ? "Bonne réponse ! 🎉" : "Mauvaise réponse";
    };

    // Fin du quiz, enregistrement du score et des réponses
    const handleEndOfQuiz = async () => {
        if (!quizStore.startTime.value) {
            console.error("startTime n'est pas encore défini.");
            return;
        }

        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - quizStore.startTime.value) / 1000);

        try {
            const { postData } = useFetchPost(`/api/results/themes/${themeId}`);
            const payload = {
                score: numberOfCorrectAnswers.value,
                totalquestions: quizQuestionLength.value,
                userAnswers: userAnswers.value,
                timetaken: timeTaken
            };
            await postData(payload);
            await refetchScores();
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du score:', error);
        }
    };
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
                :formattedScores="formattedScores"
                @reset="resetQuiz"
            />
            <Index 
                v-if="!showResults && currentQuestion" 
                :question="currentQuestion"
            />
            <Answer :message="answerMessage"/>
            <Answers 
                v-if="showResults"
                :correctAnswers="correctAnswers"
                :userAnswers="userAnswers"
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