<template>
    <div class="layout">
        <Sidebar/>
        <div class="main-content">
            <HeaderNav/>
            <router-view />
        </div>
    </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import HeaderNav from '../components/Header.vue';

export default {
    components: {
        Sidebar,
        HeaderNav
    }
};
</script>

<style scoped>
.layout {
    background-color: white;
    min-height: 100vh;
    width: 100%;
    display: flex;
}
.main-content {
    width: 80%;
}
</style>