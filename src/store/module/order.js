import Api from "../../api/Api";
const order = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //define state orders
    orders: [],
    //define detail order
    detailOrder: {},
    //define product in order
    productInOrder: [],
    MoreExists: false,
    nextPage: 0,
  },

  //mutations
  mutations: {
    //GET ORDER
    GET_ORDER(state, orders) {
      state.orders = orders; // <-- assign state orders dari hasil response
    },

    //detail order
    DETAIL_ORDER(state, detailOrder) {
      state.detailOrder = detailOrder; // <-- assign state detailOrder dari hasil response
    },

    //product in order
    PRODUCT_IN_ORDER(state, product) {
      state.productInOrder = product; // <-- assign state productInOrder dari hasil response
    },

    GET_MORE_PRODUCTS(state, orders) {
      orders.forEach((data) => {
        state.orders.push(data);
      });
    },

    SET_MORE_EXISTS(state, data) {
      state.MoreExists = data;
    },

    SET_NEXT_PAGE(state, data) {
      state.NextExists = data;
    },
  },

  //actions
  actions: {
    //action getOrder
    getOrder({ commit }) {
      //define variable token
      const token = localStorage.getItem("token");

      Api.defaults.headers.common["Authorization"] = "Bearer " + token;
      Api.get("/order").then((response) => {
        if (response.data.data.data.length > 1) {
          commit("SET_MORE_EXISTS", true);
        }
        //commit ke mutation GET_ORDER
        commit("GET_ORDER", response.data.data.data);
      });
    },

    //action detailOrder
    detailOrder({ commit }, snap_token) {
      //define variable token
      const token = localStorage.getItem("token");

      Api.defaults.headers.common["Authorization"] = "Bearer " + token;
      Api.get(`order/${snap_token}`).then((response) => {
        //commit mutation DETAIL_ORDER
        commit("DETAIL_ORDER", response.data.data);

        //commit mutation PRODUCT_IN_ORDER
        commit("PRODUCT_IN_ORDER", response.data.product);
      });
    },

    //action
    getLoadmore({ commit }) {
      Api.get("/order?page=" + 2)
        .then((response) => {
          console.log("Loadmore " + response);
          if (response.data.data.current_page < response.data.data.last_page) {
            commit("SET_MORE_EXISTS", true);
            commit("SET_NEXT_PAGE", response.data.data.current_page + 1);
            commit("GET_MORE_PRODUCTS", response.data.orders);
          } else {
            commit("SET_MORE_EXISTS", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  //getters
  getters: {
    //getter getOrder
    getOrder(state) {
      return state.orders;
    },

    //getter detailOrder
    detailOrder(state) {
      return state.detailOrder;
    },

    //getter productInOrder
    productInOrder(state) {
      return state.productInOrder;
    },
  },
};

export default order;
