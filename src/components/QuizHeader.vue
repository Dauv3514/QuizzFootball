<script setup>
    import {defineProps} from "vue"

    const {
        questionStatus, 
        barPercentage
    } = defineProps([
        "questionStatus", 
        "barPercentage"
    ])

</script>

<template>
    <header>
        <h4>Question {{ questionStatus}}</h4>
        <div class="bar">
            <div class="completion" :style="{width: barPercentage}">
            </div>
        </div>
    </header>
</template>

<style scoped>
    .bar {
        width: 300px;
        height: 50px;
        border: 3px solid rgb(39, 192, 212);
    }

    .completion {
        height: 100%;
        width: 0%;
        background-color: rgb(39, 192, 212);
    }
</style>