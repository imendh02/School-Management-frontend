<template>
  <div class="main">
    <div class="main-title">
      <font-awesome-icon icon="fa-solid fa-book" />
      <h1>{{ $t('classes.title') }}</h1>
    </div>
    <div class="main-header">
      <div class="left-header">
        <p>{{ filteredClasses.length }} {{ $t('classes.name') }}</p>
        <div class="vertical-line"></div>
        <a-input
          type="search"
          class="search-class"
          :placeholder="$t('classes.search')"
          v-model:value="searchQuery"
        >
          <template #prefix>
            <img src="../assets/search.svg" alt="Search" />
          </template>
        </a-input>
      </div>
      <div class="right-header">
        <a-space :size="30">
          <a-select
          class="select-filter"
          ref="select"
          v-model:value="selectedSort"
          :options="sortOptions"
          ></a-select>
          <a-button type="primary" shape="circle" class="export" @click="exportToExcel">
            <template #icon>
              <font-awesome-icon icon="fa-solid fa-download" />
            </template>
          </a-button>
          <div>
            <a-button shape="round" class="add-class" @click="openModalForAdd">
              <template #icon>
                <font-awesome-icon icon="plus" />
              </template>
              <span>{{ $t('classes.add') }}</span>
            </a-button>
            <a-modal centered 
            v-model:open="openModal" 
            :title="isEditMode ? $t('classes.edit') : $t('classes.add')">
              <template #footer>
                <a-button key="back" @click="openModal=false">{{ $t('buttons.cancel') }}</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">{{ isEditMode ? $t('buttons.edit') : $t('buttons.add') }}</a-button>
              </template>
              <a-form :layout="'vertical'">
                <a-form-item :validate-status="nameError ? 'error' : ''" :help="nameError ? $t('classes.nameRequired') : ''" class="form-input">
                  <span>{{ $t('classes.nameClass') }}</span>
                  <a-input :placeholder="$t('classes.nameClass')" class="input" v-model:value="name" @change="nameError=false"/>
                </a-form-item>
              </a-form>
            </a-modal>
          </div>
        </a-space>
      </div>
    </div>
    <a-alert :message="$t('classes.addSuccMsg')" type="success" show-icon style="margin-top: 40px;" v-if="showAddSuccMsg"/>
    <div class="list-classes">
      <a-empty v-if="filteredClasses.length===0">
        <template #description>
          <span>{{ $t('classes.noData') }}</span>
        </template>
      </a-empty>
      <a-row :gutter="[16, 50]" v-else>
          <a-col :span="8" v-for="classItem in filteredClasses" :key="classItem._id">
            <a-card class="class-card">
              <div class="card-title">
                <div>
                  <font-awesome-icon icon="fa-solid fa-graduation-cap" />
                  <span>{{ $t('classes.class') }}</span>
                </div>
                <a-dropdown placement="bottomRight" :trigger="['click']">
                  <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" class="class-menu"/>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="openModalForEdit(classItem)">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                        <span style="margin-left: 10px;">{{ $t('buttons.edit') }}</span>
                      </a-menu-item>
                      <a-menu-item @click="deleteClass(classItem._id)">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span style="margin-left: 10px;">{{ $t('buttons.delete') }}</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <h2>{{ classItem.name }}</h2>
              <div class="total-students">
                <font-awesome-icon icon="fa-solid fa-user-graduate" />
                <span>{{ classItem.students.length }} {{ $t('classes.students') }}</span>
              </div>
              <router-link :to="{ name: 'Students', params: { classId: classItem._id } }">{{ $t('classes.view') }}</router-link>
            </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      name: '',
      searchQuery: '',
      selectedSort: 'Newest',
      openModal: false,
      loading: false,
      nameError: false,
      showAddSuccMsg: false,
      isEditMode: false,
      currentClassId: null,
    }
  },
  computed: {
    sortOptions() {
      return [
        {
          value: 'Newest',
          label: this.$t('classes.newest'),
        },
        {
          value: 'Oldest',
          label: this.$t('classes.oldest'),
        },
      ];
    },
    ...mapGetters('classes', ['allClasses']),
    filteredClasses() {
      let classes = this.allClasses;
      if (this.searchQuery) {
        classes = classes.filter(classItem =>
          classItem.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      if (this.selectedSort === 'Newest') {
        classes = classes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (this.selectedSort === 'Oldest') {
        classes = classes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      return classes;
    },
  },
  mounted() {
    this.$store.dispatch('classes/fetchClasses')
  },
  methods: {
    openModalForAdd() {
      this.isEditMode = false;
      this.name = '';
      this.nameError = false;
      this.openModal = true;
    },
    openModalForEdit(classItem) {
      this.isEditMode = true;
      this.name = classItem.name;
      this.currentClassId = classItem._id;
      this.nameError = false;
      this.openModal = true;
    },
    async handleSubmit() {
      if (!this.name.trim()) {
        this.nameError = true;
        return;
      }
      this.loading = true
      try {
        if (this.isEditMode) {
          await this.$store.dispatch('classes/editClass', {
            id: this.currentClassId,
            name: this.name,
          });
          this.$store.dispatch('classes/fetchClasses')
        } else {
          const success = await this.$store.dispatch('classes/createClass', { name: this.name })
          if (success) {
            this.$store.dispatch('classes/fetchClasses')
            this.showAddSuccMsg = true
            setTimeout(() => {
              this.showAddSuccMsg = false;
            }, 3000); 
          }
        }
        this.openModal = false;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    deleteClass(id) {
      this.$swal.fire({
        title: this.$t('confirmAlert.text1'),
        text: this.$t('confirmAlert.text2'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t('buttons.delete'),
        cancelButtonText: this.$t('buttons.cancel'),
        reverseButtons: true
      }).then(async(result) => {
        if (result.isConfirmed) {
          const success = await this.$store.dispatch('classes/deleteClass', id)
          if (success) {
            this.$store.dispatch('classes/fetchClasses')
            this.$swal.fire({
              title: this.$t('confirmAlert.text3'),
              text: this.$t('confirmAlert.text4'),
              icon: "success"
            });
          }
        }
      });
    },
    exportToExcel() {
      const classes = this.allClasses.map(classe => ({
        Name: classe.name,
        Students: classe.students.length,
      }));
      const worksheet = XLSX.utils.json_to_sheet(classes);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Classes');
      XLSX.writeFile(workbook, 'classes_list.xlsx');
    }
  }
};
</script>

<style>
.main {
  padding: 50px 40px 50px 40px;
}
.main-title {
  display: flex;
  gap: 15px;
  font-size: 30px;
  color: var(--main-color);
}
.main-title h1 {
  font-size: 25px;
  font-style: italic;
  font-weight: bold;
}
.main .main-header {
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
}
.main .left-header {
  display: flex;
  align-items: center;
}
.main .left-header p {
  margin-bottom: 0 !important;
  color: #494949;
  font-size: 17px;
}
.main .left-header .vertical-line {
  width: 2px;
  height: 25px;
  background-color: #494949;
  margin-left: 15px;
}
/* Search Class */
.main .left-header .search-class {
  border: inherit !important;
  width: 400px;
}
.main .left-header .search-class .ant-input {
  font-size: 17px !important;
}
.main .left-header .search-class .ant-input::placeholder {
  color : #636363
}
.main .left-header .search-class .ant-input-prefix {
  margin-inline-end: 10px !important;
}
.main .left-header .ant-input-affix-wrapper-focused {
  box-shadow: none !important;
}
/* Search Class */
.main .main-header .export {
  height: 50px;
  width: 50px;
  background-color: var(--main-color);
}
.main .main-header .add-class {
  border: 1px solid var(--main-color);
  height: 50px;
  min-width: 210px;
  font-size: 17px;
  color: var(--main-color);
}
.main .main-header .add-class span {
  font-size: 15px;
  text-transform: uppercase;
  font-weight: 600;
  margin-left: 10px;
}
/* Select (Newest/Oldest) */
.select-filter .ant-select-selector {
  height: 50px !important;
  min-width: 110px !important;
  border: inherit !important;
  font-size: 17px;
  color: var(--secondary-color);
}
.select-filter .ant-select-selector .ant-select-selection-search-input {
  height: 50px !important;
}
.select-filter .ant-select-selector .ant-select-selection-item {
  line-height: 48px;
}
.select-filter .ant-select-arrow {
  color: var(--secondary-color) !important;
}
/* Class Card Detail */
.main .list-classes {
  margin-top: 50px;
}
.main .class-card {
  width: 350px;
  height: 200px;
  border: inherit;
  border-left: 6px solid var(--main-color);
  box-shadow: 2px 2px 4px 2px rgba(132, 132, 132, 0.25);
}
.main .class-card .card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  color: #004466;
}
.main .class-card .card-title span {
  font-size: 18px;
  font-weight: 500;
  margin-left: 8px;
}
.main .class-menu {
  cursor: pointer;
}
.main .ant-dropdown-open, .main .ant-dropdown-trigger {
  border: inherit !important;
  outline: none !important;
}
.main .class-card h2 {
  font-weight: 600;
  margin-top: 8px;
}
.main .class-card .total-students {
  font-size: 17px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--secondary-color)
}
.main .class-card .total-students span {
  font-weight: 500;
  font-size: 15px;
}
.main .class-card a {
  float: right;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: underline;
  color: var(--header-text-color)
}
.ant-dropdown-menu-item {
  font-size: 17px !important;
  font-weight: 600 !important;
  color: #494949 !important;
  padding: 10px 16px !important;

}
</style>