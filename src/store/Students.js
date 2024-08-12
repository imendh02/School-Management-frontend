import axios from 'axios';

export default {
    namespaced: true,
    state: {
        students: [],
        studentsById: [],
    },
    mutations: {
        SET_STUDENTS(state, students) {
            state.students = students;
        },
    },
    actions: {
        async fetchStudents({ commit }) {
            try {
                const response = await axios.get(`http://localhost:3000/api/students`);
                commit('SET_STUDENTS', response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        },
        async checkEmail({}, email) {
            try {
                const response = await axios.get(`http://localhost:3000/api/students/email-check?email=${email}`);
                return response.data.exists
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        },
        async addStudent({}, student) {
            try {
                const response = await axios.put('http://localhost:3000/api/students', student);
                return response.data && response.data.message==='Student created successfully'
            } catch (error) {
              console.error('Error adding student:', error);
            }
        },
        async editStudent({}, student) {
            const id = student._id
            try {
                const response = await axios.patch(`http://localhost:3000/api/students/${id}`, student);
                return response.data && response.data.message==='Student edited successfully'
            } catch (error) {
              console.error('Error editing student:', error);
            }
        },
        async deleteStudent({}, id) {
            try {
                const response = await axios.delete(`http://localhost:3000/api/students/${id}`);
                return response.data && response.data.message==='Student deleted successfully'
            } catch (error) {
              console.error('Error deleting student:', error);
            }
        }
    },
    getters: {
        allStudents: (state) => state.students,
    },
};