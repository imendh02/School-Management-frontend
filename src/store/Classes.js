import axios from 'axios';

export default {
    namespaced: true,
    state: {
        classes: [],
        classe: {}
    },
    mutations: {
        SET_CLASSES(state, classes) {
            state.classes = [...classes];
        },
        SET_CLASS(state, classe) {
            state.classe = classe;
        },
    },
    actions: {
        async fetchClasses({ commit }) {
            try {
                const response = await axios.get('http://localhost:3000/api/classes');
                commit('SET_CLASSES', response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        },
        async fetchClassById({ commit }, id) {
            try {
                const response = await axios.get(`http://localhost:3000/api/classes/${id}`);
                commit('SET_CLASS', response.data);
            } catch (error) {
                console.error('Error fetching class:', error);
            }
        },
        async createClass({}, classData) {
            try {
                const response = await axios.put('http://localhost:3000/api/classes', classData);
                return response.data && response.data.message==='Class created successfully'
            } catch (error) {
              console.error('Error creating class:', error);
            }
        },
        async editClass({}, {id, name}) {
            try {
                const response = await axios.patch(`http://localhost:3000/api/classes/${id}`, { name });
                return response.data && response.data.message==='Class edited successfully'
            } catch (error) {
              console.error('Error editing class:', error);
            }
        },
        async deleteClass({}, id) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/classes/${id}`);
                return response.data && response.data.message==='Class deleted successfully'
            } catch (error) {
              console.error('Error deleting class:', error);
            }
        }
    },
    getters: {
        allClasses: (state) => state.classes,
        classe: (state) => state.classe,
    },
};

