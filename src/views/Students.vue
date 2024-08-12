<template>
    <div class="main">
      <div class="main-title">
        <font-awesome-icon icon="fa-solid fa-book" />
        <h1>{{ $t('students.title') }}
          <span v-if="classe && classe.name">
            {{ classe.name }}
          </span>
        </h1>
      </div>
      <div class="main-header">
        <div class="left-header">
          <p v-if="classe && classe.students">{{ classe.students.length }} {{ $t('students.name') }}</p>
          <div class="vertical-line"></div>
          <a-input
            type="search"
            class="search-class"
            :placeholder="$t('students.search')"
            v-model:value="searchQuery"
          >
            <template #prefix>
              <img src="../assets/search.svg" alt="Search" />
            </template>
          </a-input>
        </div>
        <div class="right-header">
          <a-space :size="30">
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
                <span>{{ $t('students.add') }}</span>
              </a-button>
              <a-modal centered 
              v-model:open="openModal" 
              :title="isEditMode ? $t('students.edit') : $t('students.add')">
                <template #footer>
                  <a-button key="back" @click="openModal=false">{{ $t('buttons.cancel') }}</a-button>
                  <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">{{ isEditMode ? $t('buttons.edit') : $t('buttons.add') }}</a-button>
                </template>
                <a-form :layout="'vertical'">
                  <a-form-item :validate-status="firstNameError ? 'error' : ''" :help="firstNameError ? `${$t('students.firstName')} ${$t('buttons.required')}` : ''" class="form-input">
                    <span>{{ $t('students.firstName') }}</span>
                    <a-input :placeholder="$t('students.firstName')" class="input" v-model:value="student.firstName" @change="firstNameError=false"/>
                  </a-form-item>
                  <a-form-item :validate-status="lastNameError ? 'error' : ''" :help="lastNameError ? `${$t('students.lastName')} ${$t('buttons.required')}` : ''" class="form-input">
                    <span>{{ $t('students.lastName') }}</span>
                    <a-input :placeholder="$t('students.lastName')" class="input" v-model:value="student.lastName" @change="lastNameError=false"/>
                  </a-form-item>
                  <a-form-item :validate-status="emailError ? 'error' : ''" :help="emailError ? emailTextError() : ''" class="form-input">
                    <span>{{ $t('students.email') }}</span>
                    <a-input :placeholder="$t('students.email')" class="input" v-model:value="student.email" @change="emailError=false"/>
                  </a-form-item>
                </a-form>
              </a-modal>
            </div>
          </a-space>
        </div>
      </div>
      <a-alert :message="$t('students.addSuccMsg')" type="success" show-icon style="margin-top: 40px;" v-if="showAddSuccMsg"/>
      <div class="list-students">
        <a-table 
        :columns="columns"   
        :data-source="paginatedStudents"
        :pagination="paginationConfig" 
        class="students-table">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <a-avatar :size="40" :style="{ backgroundColor: getAvatarColor(getInitials(record.firstName, record.lastName)) }">
                  {{ getInitials(record.firstName, record.lastName) }}
              </a-avatar>
            </template>
            <template v-if="column.key === 'actions'">
              <a-dropdown placement="bottomRight" :trigger="['click']">
                  <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" class="class-menu"/>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="openModalForEdit(record)">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                        <span style="margin-left: 10px;">{{ $t('buttons.edit') }}</span>
                      </a-menu-item>
                      <a-menu-item @click="deleteStudent(record._id)">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                        <span style="margin-left: 10px;">{{ $t('buttons.delete') }}</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
            </template>
          </template>
        </a-table>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { useRoute } from 'vue-router';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      student : {
        firstName : '',
        lastName : '',
        email : '',
        classId : null,
      },
      students : [],
      openModal: false,
      loading: false,
      showAddSuccMsg: false,
      isEditMode: false,
      firstNameError: false,
      lastNameError: false,
      emailError: false,
      emailExists: false,
      searchQuery: '',
      originalEmail: '',
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0,
      },
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '',
          dataIndex: 'image',
          key: 'image',
          align: 'center',
        },
        {
          title: this.$t('students.firstName'), 
          dataIndex: 'firstName',
          key: 'firstName',
        },
        {
          title: this.$t('students.lastName'), 
          dataIndex: 'lastName',
          key: 'lastName',
        },
        {
          title: this.$t('students.email'), 
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: '',
          dataIndex: 'actions',
          key: 'actions',
          align: 'right',
        }
      ]},
    ...mapGetters('students', ['allStudents']),
    ...mapGetters('classes', ['classe']),
    filteredStudents() {
    if (this.classe && this.classe.students) {
      let studentsData = this.classe.students;
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        return studentsData.filter(student =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query)
        );
      }
      return studentsData;
    }
    return [];
  },
    paginatedStudents() {
    const { current, pageSize } = this.pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return this.filteredStudents.slice(start, end);
  },
  paginationConfig() {
    return {
      current: this.pagination.current,
      pageSize: this.pagination.pageSize,
      total: this.filteredStudents.length,
      onChange: (page, pageSize) => {
        this.pagination.current = page;
        this.pagination.pageSize = pageSize;
      },
    };
  },
  },
  async mounted() {
    const classId = useRoute().params.classId
    this.$store.dispatch('classes/fetchClassById', classId)
    this.student.classId = classId
  },
  methods: {
    getInitials(firstName, lastName) {
      const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
      const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
      return `${firstInitial}${lastInitial}`;
    },
    getAvatarColor(initials) {
      const hash = Array.from(initials).reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      const color = `hsl(${hash % 360}, 70%, 40%)`;
      return color;
    },
    openModalForAdd() {
      this.isEditMode = false;
      this.openModal = true;
      this.firstNameError = false
      this.lastNameError = false
      this.emailError = false
      this.emailExists = false
      this.student.firstName = ''
      this.student.lastName = ''
      this.student.email = ''
    },
    openModalForEdit(student) {
      this.originalEmail = student.email
      this.student = { ...student }
      this.isEditMode = true;
      this.openModal = true;
      this.firstNameError = false
      this.lastNameError = false
      this.emailError = false
      this.emailExists = false
    },
    async validateForm() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.firstNameError = !this.student.firstName.trim();
      this.lastNameError = !this.student.lastName.trim();
      this.emailError = !this.student.email.trim() || !emailPattern.test(this.student.email);
      if (this.emailError) {
        return false;
      }
      if (this.originalEmail!==this.student.email) {
        this.emailExists = await this.$store.dispatch('students/checkEmail', this.student.email)
        this.emailError = this.emailExists
      }
      return !(this.nameError || this.firstNameError || this.lastNameError || this.emailError)
    },
    emailTextError() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.student.email.trim()) {
        return `${this.$t('students.email')} ${this.$t('buttons.required')}`          
      }
      if (!emailPattern.test(this.student.email)) {
        return this.$t('students.validEmail')
      }
      if (this.originalEmail!==this.student.email && this.emailExists) {
        return this.$t('students.emailExists')
      }
    },
    async handleSubmit() {
      if (! await this.validateForm()) {
        return;
      }
      this.loading = true
      try {
        if (this.isEditMode) {
          await this.$store.dispatch('students/editStudent', this.student);
          this.$store.dispatch('classes/fetchClassById', this.student.classId)
        } else {
          const success = await this.$store.dispatch('students/addStudent', this.student)
          if (success) {
            this.$store.dispatch('classes/fetchClassById', this.student.classId)
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
    deleteStudent(id) {
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
          const success = await this.$store.dispatch('students/deleteStudent', id)
          if (success) {
            this.$store.dispatch('classes/fetchClassById', this.student.classId)
            this.$swal.fire({
              title: this.$t('confirmAlert.text3'),
              text: this.$t('confirmAlert.text5'),
              icon: "success"
            });
          }
        }
      });
    },
    exportToExcel() {
      const studentsData = this.classe.students.map(student => ({
        FirstName: student.firstName,
        LastName: student.lastName,
        Email: student.email,
      }));
      const worksheet = XLSX.utils.json_to_sheet(studentsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
      const className = this.classe.name.replace(/\s+/g, '_');
      const fileName = `${className}_students_list.xlsx`;
      XLSX.writeFile(workbook, fileName);
    },
  }
}
</script>

<style>
.students-table th {
  background-color: transparent !important;
  border-bottom: 1px solid #00141F !important;
  color: #00141F !important
}
.students-table {
  margin-top: 35px;
}
</style>