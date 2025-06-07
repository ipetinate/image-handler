import { createRouter, createWebHistory } from "vue-router";

import ProfileView from "../views/ProfileView.vue";
import PasswordResetView from "../views/PasswordResetView.vue";
import AboutView from "../views/AboutView.vue";
import FeaturesView from "../views/FeaturesView.vue";
import InstructionsView from "../views/InstructionsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => Promise.resolve({ template: "<div></div>" }), // Empty component for main app
    },
    {
      path: "/settings",
      children: [
        {
          path: "",
          redirect: "/settings/profile",
        },
        {
          path: "profile",
          name: "profile",
          component: ProfileView,
        },
        {
          path: "password-reset",
          name: "password-reset",
          component: PasswordResetView,
        },
        {
          path: "features",
          name: "features",
          component: FeaturesView,
        },
        {
          path: "instructions",
          name: "instructions",
          component: InstructionsView,
        },
        {
          path: "about",
          name: "about",
          component: AboutView,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
