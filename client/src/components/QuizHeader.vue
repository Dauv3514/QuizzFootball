<script setup>
    import {defineProps} from "vue"
    import {RouterLink} from "vue-router"

    const {
        questionStatus, 
        barPercentage,
        lastQuestion
    } = defineProps([
        "questionStatus", 
        "barPercentage",
        "lastQuestion"
    ])

</script>

<template>
    <header>
        <h4>Question {{ questionStatus}}</h4>
        <div class="container">
            <div class="bar" :style="questionStatus === '0/3' ? {border: '2px solid black'} : {}">
                <div class="completion" :style="{width: barPercentage}">
                </div>
            </div>
            <span v-if="lastQuestion" class="message">
                <RouterLink to="/">Retour à l'accueil</RouterLink>
            </span>
        </div>
    </header>
</template>

<style scoped>
    .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .bar {
        width: 300px;
        height: 50px;
        border: 3px solid #003e66;
    }

    .completion {
        height: 100%;
        width: 0%;
        background-color: #003e66;
    }

    .message a {
        color: #003e66;
        text-decoration: none;
        font-weight: 600;
        font-size: 12px;
    }
</style>