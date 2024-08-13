<template>
    <div class="dashboard">
        <div style="display: flex; justify-content: space-between;">
            <a-card class="dashboard-card">
                <div class="card-detail">
                    <div class="left-card"><font-awesome-icon icon="fa-solid fa-book" /></div>
                    <div class="right-card">
                        <h3>{{ $t('dashboard.totalClasses') }}</h3>
                        <p>{{ allClasses.length }}</p>
                    </div>
                </div>
            </a-card>
            <a-card class="dashboard-card">
                <div class="card-detail">
                    <div class="left-card"><font-awesome-icon icon="fa-solid fa-people-group" /></div>
                    <div class="right-card">
                        <h3>{{ $t('dashboard.totalStudents') }}</h3>
                        <p>{{ allStudents.length }}</p>
                    </div>
                </div>
            </a-card>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
        }
    },
    computed : {
        ...mapGetters('classes', ['allClasses']),
        ...mapGetters('students', ['allStudents'])
    },
    mounted() {
        this.$store.dispatch('classes/fetchClasses')
        this.$store.dispatch('students/fetchStudents')
    },
}
</script>

<style scoped>
.dashboard {
    margin: 50px 70px 0 70px;
}
.dashboard-card {
    width: 520px;
    height: 150px;
    display: flex;
    align-items: center;
    border: 1px solid rgb(220, 220, 220);
    border-radius: 10px !important;
}
.dashboard .card-detail {
    display: flex;
    gap: 20px;
}
.dashboard-card .left-card {
    background-color: var(--light-blue-color);
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
}
.dashboard-card .right-card h3 {
    font-size: 22px;
    font-weight: 600;
    color: var(--header-text-color)
}
.dashboard-card .right-card p {
    font-size: 17px;
    color: rgb(119, 119, 119)
}
</style>