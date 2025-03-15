import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useQuizTimeTaken = (defineStore, 'quiz', () => {
    const startTime = ref(null);

    const startQuiz = () => {
        startTime.value = Date.now();
    }

    return { startTime, startQuiz };
})