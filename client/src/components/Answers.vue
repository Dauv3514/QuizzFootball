<script setup>
    import {defineProps} from "vue"
    import {ref} from "vue"

    const answerResponses = ref(false)
    const showResults = () => {
        answerResponses.value = !answerResponses.value
    }

    const props = defineProps(["answersTrue", "userAnswers"]);

</script>

<template>
    <div class="answer">
        <button @click="showResults()">
            {{ answerResponses ? "Masquer les réponses" : 'Voir les réponses' }}
        </button>
        <div v-if="answerResponses" class="answersTrue">
            <div
                v-if="answerResponses"
                v-for="(answer, index) in props.answersTrue" 
                :key="index"
                class="answer-item"
            >
                <span>{{ index + 1 }} - {{ answer }}</span>
                <div v-if="props.answersTrue[index] === props.userAnswers[index]" class="checkmark"></div>
                <div v-else class="close-btn">x</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .answer {
        margin-top: 10px;
        text-align: center;
    }

    .answersTrue {
        display: flex;
        flex-direction: column;
        align-items: center;
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

    .answer-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        gap: 14px;
        position: relative; 
    }

    .checkmark {
        width: 20px;
        height: 20px;
        background-color: white;
        position: relative;
        border-radius: 50%;
    }

    .checkmark::before, .checkmark::after {
        content: "";
        position: absolute;
        background-color: #4CAF50;
        transition: all 0.3s;
    }

    .checkmark::before {
        width: 4px;
        height: 12px;
        left: 7px;
        top: 8px;
        transform: rotate(45deg);
    }

    .checkmark::after {
        width: 4px;
        height: 12px;
        left: -1px;
        top: 10px;
        transform: rotate(-45deg);
    }

    .close-btn {
        position: relative;
        color: #f44336;
        border: none;
        background: transparent;
        transition: color 0.3s ease;
        font-size: 24px;
        right: 6px;
    }

</style>