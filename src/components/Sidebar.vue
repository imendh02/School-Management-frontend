<template>
    <div class="sidebar">
        <div class="sidebar-logo">
            <img src="../assets/logo.svg" alt="logo" width="40px"/>
            <h1>School</h1>
        </div>
        <ul>
            <router-link to="/" tag="li" class="sidebar-item">
                <div class="item-icon"><font-awesome-icon icon="fa-solid fa-table-columns" /></div>
                <span>{{ $t('sidebar.dashboard') }}</span>
            </router-link>
            <router-link to="/classes" tag="li" class="sidebar-item">
                <div class="item-icon"><font-awesome-icon icon="fa-solid fa-book" /></div>
                <span>{{ $t('sidebar.classes') }}</span>
            </router-link>
        </ul>
    </div>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
    background-color: var(--main-color);
    width: 20%;
    color: white;
}
.sidebar .sidebar-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 35px;
}
.sidebar .sidebar-logo h1 {
    margin-bottom: 0 !important;
    font-family: "Permanent Marker", cursive;
    font-weight: 400;
    font-style: normal;
    font-size: 33px;
}
.sidebar ul {
    margin-top: 100px;
}
.sidebar .sidebar-item {
    margin: 20px 24px;
    list-style: none;
    height: 60px;
    border-radius: 50px;
    padding-left: 30px;
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
}
.sidebar .sidebar-item .item-icon {
    width: 47px;
    font-size: 27px;
}
.sidebar .sidebar-item span {
    font-size: 21px;
    font-weight: 500;
}
.sidebar .sidebar-item:hover {
    color: var(--light-blue-color);
}
.router-link-active {
    background-color: var(--light-blue-color);
    color: var(--header-text-color) !important;
}
</style>