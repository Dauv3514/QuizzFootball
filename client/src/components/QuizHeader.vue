<script setup>
    import {defineProps} from "vue"

    const {
        questionStatus, 
        barPercentage,
    } = defineProps([
        "questionStatus", 
        "barPercentage",
    ])

</script>

<template>
    <header>
        <h4>Question {{ questionStatus}}</h4>
        <div class="bar" :style="questionStatus === '0/3' ? {border: '2px solid black'} : {}">
            <div class="completion" :style="{width: barPercentage}">
            </div>
        </div>
    </header>
</template>

<style scoped>
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
</style>