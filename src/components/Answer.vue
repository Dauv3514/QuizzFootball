<script setup>
    import {defineProps} from "vue"

    const {message} = defineProps({
        message: {
            type: String,
            required:true,
        }
    })

</script>

<template>
    <div class="answer">
        <p> {{ message }}</p>
    </div>
</template>

<style scoped>
    p {
        text-align: center;
    }
</style>