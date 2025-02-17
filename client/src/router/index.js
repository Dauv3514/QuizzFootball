import {createRouter, createWebHistory} from "vue-router"
import QuizsView from "../views/QuizsView.vue"
import QuizView from "../views/QuizView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "quizs",
            component: QuizsView
        },
        {
            path: "/quiz/:id",
            name: "quiz",
            component: QuizView
        }
    ]
})

export default router;