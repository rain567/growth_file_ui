export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    username: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateUsername (state, username) {
      state.username = username
    }
  }
}
