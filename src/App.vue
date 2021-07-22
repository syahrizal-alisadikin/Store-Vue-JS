<template>
  <Header />
  <router-view />
  <Footer />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "vuex"; // store Vuex
import Api from "./api/Api";
import { useRouter } from "vue-router";

export default {
  components: {
    Header,
    Footer,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const token = localStorage.getItem("token");
    // console.log(token);
    // console.log(token);
    Api.defaults.headers.common["Authorization"] = "Bearer " + token;
    Api.get("/user")
      .then((response) => {
        //commit ke mutatuin GET_USER dengan hasil response
        console.log(response);
      })
      .catch((error) => {
        if (error.response.data.message === "Unauthenticated.") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (token === null) {
            return router.push({ name: "login" });
          }
        } else {
          console.log(error.response.data.message);
        }
      });

    return {
      store,
    };
  },
};
</script>
