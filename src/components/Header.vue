<template>
    <div class="header">
        <div class="header-left">
            <h1>{{ pageTitle }}</h1>
            <hr />
        </div>
        <div class="header-right">
            <font-awesome-icon icon="fa-regular fa-bell" class="notification-icon"/>
            <div class="avatar">
                <img src="../assets/person.svg" alt="avatar" width="50px"/>
                <span>admin</span>
            </div>
            <a-button 
            type="primary" 
            shape="round" 
            class="language-button" 
            @click="toggleLanguage">
            {{ currentLanguage }}
            </a-button>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

export default {
    data() {
        return {
        currentLanguage: this.getInitialLanguage(),
        pageTitle: ''
        };
    },
    watch: {
        '$route.meta.title'(newTitle) {
            this.updatePageTitle(newTitle);
        }
    },
    mounted() {
        this.updatePageTitle(this.$route.meta.title)
    },
    methods: {
        toggleLanguage() {
            const newLocale = this.$i18n.locale === 'en' ? 'fr' : 'en';
            this.$i18n.locale = newLocale;
            this.currentLanguage = newLocale === 'en' ? 'English' : 'Français';
            localStorage.setItem('language', newLocale);
            this.updatePageTitle(this.$route.meta.title)
        },
        getInitialLanguage() {
            const storedLanguage = localStorage.getItem('language');
            if (storedLanguage) {
                this.$i18n.locale = storedLanguage;
                return storedLanguage === 'en' ? 'English' : 'Français';
            } else {
                return this.$i18n.locale === 'en' ? 'English' : 'Français';
            }
        },
        updatePageTitle(title) {
            if (title === "Dashboard") {
                this.pageTitle = this.$t('sidebar.dashboard');
            } else if (title === "Classes") {
                this.pageTitle = this.$t('sidebar.classes');
            } else if (title === "Students") {
                this.pageTitle = this.$t('students.name');
            } else {
                this.pageTitle = '';
            }
        }
    },
    created() {
        this.currentLanguage = this.getInitialLanguage();
    }
};
</script>

<style>
.header {
    padding: 30px 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.header .header-left {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.header .header-left h1 {
    font-size: 28px;
    color: var(--header-text-color);
    font-weight: 700;
}
.header .header-left hr {
    width: 90px;
    border: 2px solid var(--header-text-color);
    margin-top: -8px;
    border-radius: 50px;
}
.header .header-right {
    display: flex;
    align-items: center;
    gap: 50px;
}
.header .header-right .search {
    width: 300px;
}
.header .header-right .notification-icon {
    font-size: 25px;
    color: #595959;
}
.header .header-right .avatar {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 500;
}
.header .header-right .language-button {
    background-color: var(--main-color);
    height: 45px;
    width: 125px;
    font-size: 17px;
}
</style>