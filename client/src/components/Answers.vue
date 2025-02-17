<script setup>
    import {defineProps} from "vue"
    import {ref} from "vue"

    const {answersTrue} = defineProps(['answersTrue'])
    const answerResponses = ref(false)
    const showResults = () => {
        answerResponses.value = !answerResponses.value
    }

</script>

<template>
    <div class="answer">
        <button @click="showResults()">
            {{ answerResponses ? "Masquer les réponses" : 'Voir les réponses' }}
        </button>
        <div v-if="answerResponses" class="answersTrue" v-for="(answer, index) in answersTrue" :key="index">
            <span>{{ index + 1 }} - {{ answer }}</span>
        </div>
    </div>
</template>

<style scoped>
    .answer {
        margin-top: 50px;
        text-align: center;
    }

    .answersTrue {
        margin-top: 10px;
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