import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import DictionaryView from "../views/DictionaryView.vue";
import ConjugatorView from "../views/ConjugatorView.vue";
import TasksView from "../views/TasksView.vue";
import NotesView from "../views/NotesView.vue";
import FlashcardsView from "../views/FlashcardsView.vue";
import PredictorView from "../views/PredictorView.vue";
import KidsView from "../views/KidsView.vue";
import OrthographyView from "../views/OrthographyView.vue";
import VariantsView from "../views/VariantsView.vue";

export default createRouter({
  // Hash history works cleanly on GitHub Pages without server rewrite rules.
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/diccionario", component: DictionaryView },
    { path: "/traductor-conjugador", component: ConjugatorView },
    { path: "/tareas", component: TasksView },
    { path: "/notas", component: NotesView },
    { path: "/cartas", component: FlashcardsView },
    { path: "/predictor", component: PredictorView },
    { path: "/infantil", component: KidsView },
    { path: "/ortografia", component: OrthographyView },
    { path: "/variantes", component: VariantsView }
  ]
});
