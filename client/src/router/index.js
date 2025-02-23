import {createRouter, createWebHistory} from "vue-router"
import QuizsView from "../views/QuizsView.vue"
import QuizView from "../views/QuizView.vue"
import LoginView from "../views/Connexion.vue"
import RegisterView from "../views/Inscription.vue"

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
        },
        {
            path: "/connexion",
            name: "connexion",
            component: LoginView
        },
        {
            path: "/inscription",
            name: "inscription",
            component: RegisterView
        }
    ]
})

export default router;