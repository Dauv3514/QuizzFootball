<script setup>
    import {defineProps} from "vue"
    import {ref} from "vue"

    const {question} = defineProps(['question'])
    const questionIndice = ref(false)
    const oneIndice = () => {
        questionIndice.value = !questionIndice.value
    }

</script>

<template>
    <div class="indice">
        <button @click="oneIndice()">
            {{ questionIndice ? "Masquer l'indice" : "Avoir un indice" }}
        </button>
        <p v-if="questionIndice">{{ question.indice }} </p>
    </div>
</template>

<style scoped>
    .indice {
        text-align: center;
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