<template>
  <div class="dashboard-container">
    <h2>Управление проектами</h2>
    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>
    <!-- Список проектов -->
    <section v-if="!isLoading && !selectedProject" class="projects-section">
      <h3>Ваши проекты</h3>
      <ul>
        <li
          v-for="project in projects"
          :key="project.id"
          class="project-item animate__animated animate__fadeIn"
        >
          <div class="project-info">
            <h4>{{ project.name }}</h4>
            <p>{{ project.description || 'Нет описания' }}</p>
          </div>
          <div class="project-actions">
            <button
              class="animated-button view-button animate__animated animate__pulse"
              @click="selectProject(project)"
            >
              Просмотреть
            </button>
            <button
              class="animated-button delete-button animate__animated animate__shakeX"
              @click="deleteProject(project.id)"
            >
              Удалить
            </button>
          </div>
        </li>
      </ul>
      <button
        class="animated-button create-button animate__animated animate__bounceIn"
        @click="showCreateProjectForm = true"
      >
        Создать новый проект
      </button>
    </section>
    <!-- Форма создания проекта -->
    <section v-if="showCreateProjectForm" class="create-project-form animate__animated animate__fadeIn">
      <h3>Создать новый проект</h3>
      <form @submit.prevent="createProject">
        <div class="form-group">
          <label for="projectName">Название проекта:</label>
          <input type="text" v-model="newProject.name" required class="input-field" />
        </div>
        <div class="form-group">
          <label for="projectDescription">Описание проекта:</label>
          <textarea v-model="newProject.description" rows="4" class="input-field"></textarea>
        </div>
        <button type="submit" class="animated-button">Создать проект</button>
        <button
          type="button"
          class="animated-button cancel-button animate__animated animate__fadeOut"
          @click="showCreateProjectForm = false"
        >
          Отмена
        </button>
      </form>
    </section>
    <!-- Просмотр выбранного проекта -->
    <section v-if="selectedProject" class="project-details animate__animated animate__fadeIn">
      <h3>Проект: {{ selectedProject.name }}</h3>
      <!-- Блок редактирования названия и описания проекта -->
      <div class="block edit-project-block animate__animated animate__fadeIn">
        <h4>Редактирование проекта</h4>
        <div class="form-group">
          <label for="editProjectName">Новое название:</label>
          <input
            type="text"
            v-model="selectedProject.name"
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label for="editProjectDescription">Новое описание:</label>
          <textarea
            v-model="selectedProject.description"
            rows="4"
            class="input-field"
          ></textarea>
        </div>
        <!-- Кнопка "Сохранить изменения" -->
        <button
          class="animated-button save-button"
          @click="saveProjectDetails"
        >
          Сохранить изменения
        </button>
      </div>
      <!-- Блок "Команда" -->
      <div
        v-if="!showAddUserToTeamForm && !showCreateTaskForm"
        class="block team-block animate__animated animate__fadeIn"
      >
        <h4>Команда</h4>
        <ul>
          <li
            v-for="user in teamUsers"
            :key="user.id"
            class="team-member animate__animated animate__fadeIn"
          >
            <span>{{ user.username }} ({{ user.email }})</span>
            <button
              v-if="isOwner()"
              class="animated-button delete-button"
              @click="removeUserFromTeam(user.id)"
            >
              Удалить
            </button>
          </li>
        </ul>
        <!-- Кнопка "Добавить пользователя" -->
        <button
          class="animated-button add-user-button animate__animated animate__pulse"
          @click="toggleAddUserToTeamForm"
        >
          Добавить пользователя
        </button>
      </div>
      <!-- Форма добавления пользователя в команду -->
      <section
        v-if="showAddUserToTeamForm"
        class="add-user-form animate__animated animate__fadeIn"
      >
        <h3>Добавить пользователя в команду</h3>
        <form @submit.prevent="addUserToTeam">
          <div class="form-group">
            <label for="userEmail">Email пользователя:</label>
            <input type="email" v-model="userEmail" required class="input-field" />
          </div>
          <button type="submit" class="animated-button">Добавить пользователя</button>
          <button
            type="button"
            class="animated-button cancel-button animate__animated animate__fadeOut"
            @click="showAddUserToTeamForm = false"
          >
            Отмена
          </button>
        </form>
      </section>
      <!-- Если пользователь не является владельцем, но пытается добавить пользователя -->
      <section
        v-if="showAddUserToTeamForm && !isOwner()"
        class="add-user-form animate__animated animate__fadeIn"
      >
        <h3>Ошибка</h3>
        <p>Вы не можете добавлять новых пользователей в этот проект.</p>
        <button
          type="button"
          class="animated-button cancel-button animate__animated animate__fadeOut"
          @click="showAddUserToTeamForm = false"
        >
          Закрыть
        </button>
      </section>
      <!-- Блок "Задачи" -->
      <div
        v-if="!showAddUserToTeamForm && !showCreateTaskForm"
        class="block tasks-block animate__animated animate__fadeIn"
      >
        <h4>Задачи</h4>
        <ul>
          <li
            v-for="task in tasks"
            :key="task.id"
            class="task-item animate__animated animate__fadeIn"
          >
            <div class="task-info">
              <p><strong>{{ task.title }}</strong></p>
              <p>Статус: {{ task.status }}</p>
              <p v-if="task.due_date">Дата выполнения: {{ new Date(task.due_date).toLocaleDateString() }}</p>
              <p v-if="task.assigned_username">Выдал: {{ task.assigned_username }}</p>
            </div>
            <div class="task-actions">
              <button
                class="animated-button view-button"
                @click="viewTaskDetails(task)"
              >
                Просмотреть
              </button>
              <button
                class="animated-button work-button"
                @click="markTaskAsInProgress(task.id)"
              >
                В работе
              </button>
              <button
                class="animated-button complete-button"
                @click="markTaskAsCompleted(task.id)"
              >
                Выполнено
              </button>
              <button
                class="animated-button delete-button"
                @click="deleteTask(task.id)"
              >
                Удалить
              </button>
            </div>
          </li>
        </ul>
        <button
          class="animated-button create-task-button animate__animated animate__pulse"
          @click="toggleCreateTaskForm"
        >
          Создать задачу
        </button>
      </div>
      <!-- Форма создания задачи -->
      <section
        v-if="showCreateTaskForm"
        class="create-task-form animate__animated animate__fadeIn"
      >
        <h3>Создать задачу</h3>
        <form @submit.prevent="createTask">
          <div class="form-group">
            <label for="taskTitle">Название задачи:</label>
            <input type="text" v-model="newTask.title" required class="input-field" />
          </div>
          <div class="form-group">
            <label for="taskDescription">Описание задачи:</label>
            <textarea v-model="newTask.description" rows="4" class="input-field"></textarea>
          </div>
          <div class="form-group">
            <label for="taskDueDate">Дата выполнения:</label>
            <input type="date" v-model="newTask.due_date" class="input-field" />
          </div>
          <button type="submit" class="animated-button">Создать задачу</button>
          <button
            type="button"
            class="animated-button cancel-button animate__animated animate__fadeOut"
            @click="showCreateTaskForm = false"
          >
            Отмена
          </button>
        </form>
      </section>
      <!-- Кнопка возврата к списку проектов -->
      <button
        class="animated-button back-button animate__animated animate__fadeIn"
        @click="deselectProject"
      >
        Назад к списку проектов
      </button>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import { ElNotification } from 'element-plus'; // Импортируем ElNotification

export default {
  name: 'DashboardMenu',
  data() {
    return {
      projects: [],
      showCreateProjectForm: false,
      newProject: {
        name: '',
        description: ''
      },
      selectedProject: null,
      teamUsers: [],
      tasks: [],
      showAddUserToTeamForm: false,
      userEmail: '',
      showCreateTaskForm: false,
      newTask: {
        title: '',
        description: '',
        due_date: ''
      },
      isLoading: true // Состояние загрузки
    };
  },
  computed: {
    currentUserId() {
      return this.$store.state.token.id;
    }
  },
  methods: {
    async fetchProjects() {
      try {
        const response = await axios.get('http://localhost:5000/projects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.projects = response.data;
      } catch (error) {
        console.error('Ошибка получения проектов:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось загрузить проекты.',
          duration: 3000,
        });
      } finally {
        this.isLoading = false; // Загрузка завершена
      }
    },
    async createProject() {
      try {
        await axios.post('http://localhost:5000/projects', this.newProject, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.showCreateProjectForm = false;
        this.newProject.name = '';
        this.newProject.description = '';
        this.fetchProjects();
        ElNotification.success({
          title: 'Успех',
          message: 'Проект успешно создан!',
          duration: 3000,
        });
      } catch (error) {
        console.error('Ошибка создания проекта:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось создать проект.',
          duration: 3000,
        });
      }
    },
    selectProject(project) {
      this.selectedProject = { ...project }; // Копируем объект, чтобы избежать мутаций
      this.fetchTeamUsers(project.id);
      this.fetchTasks(project.id);
    },
    deselectProject() {
      this.selectedProject = null;
      this.teamUsers = [];
      this.tasks = [];
      this.showAddUserToTeamForm = false;
      this.showCreateTaskForm = false;
    },
    async deleteProject(projectId) {
      if (!confirm('Вы уверены, что хотите удалить этот проект?')) return;
      try {
        await axios.delete(`http://localhost:5000/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.fetchProjects();
        ElNotification.success({
          title: 'Успех',
          message: 'Проект успешно удален!',
          duration: 3000,
        });
      } catch (error) {
        console.error('Ошибка удаления проекта:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось удалить проект.',
          duration: 3000,
        });
      }
    },
    async fetchTeamUsers(projectId) {
      try {
        const response = await axios.get(`http://localhost:5000/projects/${projectId}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.teamUsers = response.data;
      } catch (error) {
        console.error('Ошибка получения пользователей проекта:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось загрузить участников проекта.',
          duration: 3000,
        });
      }
    },
    async fetchTasks(projectId) {
      try {
        const response = await axios.get(`http://localhost:5000/projects/${projectId}/tasks`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.tasks = response.data;
      } catch (error) {
        console.error('Ошибка получения задач проекта:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось загрузить задачи проекта.',
          duration: 3000,
        });
      }
    },
    async addUserToTeam() {
      if (!this.isOwner()) {
        ElNotification.warning({
          title: 'Предупреждение',
          message: 'Только владелец проекта может добавлять новых пользователей.',
          duration: 3000,
        });
        this.showAddUserToTeamForm = false;
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/users/search?email=${this.userEmail}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.length === 0) {
          ElNotification.warning({
            title: 'Предупреждение',
            message: 'Пользователь с таким email не найден.',
            duration: 3000,
          });
          return;
        }
        const userId = response.data[0].id;
        await axios.post(
          `http://localhost:5000/projects/${this.selectedProject.id}/users`,
          { userId },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        ElNotification.success({
          title: 'Успех',
          message: 'Пользователь добавлен в команду.',
          duration: 3000,
        });
        this.fetchTeamUsers(this.selectedProject.id);
        this.showAddUserToTeamForm = false;
      } catch (error) {
        console.error('Ошибка добавления пользователя в команду:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось добавить пользователя в команду.',
          duration: 3000,
        });
      }
    },
    async removeUserFromTeam(userId) {
      if (!confirm('Вы уверены, что хотите удалить этого пользователя из команды?')) return;
      try {
        await axios.delete(`http://localhost:5000/projects/${this.selectedProject.id}/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        ElNotification.success({
          title: 'Успех',
          message: 'Пользователь удален из команды.',
          duration: 3000,
        });
        this.fetchTeamUsers(this.selectedProject.id);
      } catch (error) {
        console.error('Ошибка удаления пользователя из команды:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось удалить пользователя из команды.',
          duration: 3000,
        });
      }
    },
    async createTask() {
      try {
        await axios.post(`http://localhost:5000/projects/${this.selectedProject.id}/tasks`, this.newTask, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.showCreateTaskForm = false;
        this.newTask.title = '';
        this.newTask.description = '';
        this.newTask.due_date = '';
        this.fetchTasks(this.selectedProject.id);
        ElNotification.success({
          title: 'Успех',
          message: 'Задача успешно создана!',
          duration: 3000,
        });
      } catch (error) {
        console.error('Ошибка создания задачи:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось создать задачу.',
          duration: 3000,
        });
      }
    },
    async markTaskAsCompleted(taskId) {
      try {
        await axios.patch(`http://localhost:5000/tasks/${taskId}/complete`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        ElNotification.success({
          title: 'Успех',
          message: 'Задача помечена как выполненная!',
          duration: 3000,
        });
        this.fetchTasks(this.selectedProject.id);
      } catch (error) {
        console.error('Ошибка изменения статуса задачи:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось изменить статус задачи.',
          duration: 3000,
        });
      }
    },
    async markTaskAsInProgress(taskId) {
      try {
        await axios.patch(`http://localhost:5000/tasks/${taskId}/in-progress`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        ElNotification.success({
          title: 'Успех',
          message: 'Задача помечена как "в процессе".',
          duration: 3000,
        });
        this.fetchTasks(this.selectedProject.id);
      } catch (error) {
        console.error('Ошибка изменения статуса задачи:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось изменить статус задачи.',
          duration: 3000,
        });
      }
    },
    async deleteTask(taskId) {
      if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
      try {
        await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        ElNotification.success({
          title: 'Успех',
          message: 'Задача успешно удалена!',
          duration: 3000,
        });
        this.fetchTasks(this.selectedProject.id);
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось удалить задачу.',
          duration: 3000,
        });
      }
    },
    async saveProjectDetails() {
      try {
        await axios.patch(
          `http://localhost:5000/projects/${this.selectedProject.id}`,
          {
            name: this.selectedProject.name,
            description: this.selectedProject.description
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        ElNotification.success({
          title: 'Успех',
          message: 'Изменения успешно сохранены!',
          duration: 3000,
        });
      } catch (error) {
        console.error('Ошибка при сохранении изменений:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Не удалось сохранить изменения.',
          duration: 3000,
        });
      }
    },
    toggleAddUserToTeamForm() {
      this.showAddUserToTeamForm = !this.showAddUserToTeamForm;
      this.showCreateTaskForm = false; // Скрываем форму создания задачи при открытии формы добавления пользователя
    },
    toggleCreateTaskForm() {
      this.showCreateTaskForm = !this.showCreateTaskForm;
      this.showAddUserToTeamForm = false; // Скрываем форму добавления пользователя при открытии формы создания задачи
    },
    isOwner() {
      if (!this.selectedProject || !this.teamUsers) return false;
      return this.teamUsers.some(user => user.id === this.currentUserId && user.role === 'owner'); // Проверяем, является ли текущий пользователь владельцем проекта
    },
    isMember() {
      if (!this.selectedProject || !this.teamUsers) return false;
      return this.teamUsers.some(user => user.id === this.currentUserId); // Проверяем, является ли текущий пользователь участником проекта
    },
    viewTaskDetails(task) {
      ElNotification.info({
        title: 'Описание задачи',
        message: task.description || 'Нет описания',
        duration: 5000,
      });
    }
  },
  mounted() {
    this.fetchProjects();
  }
};
</script>
<style scoped>

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.task-info {
  flex: 1;
}

.task-info p {
  margin: 5px 0;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.task-actions button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view-button {
  background-color: #007bff;
  color: white;
}

.work-button {
  background-color: #ffc107;
  color: black;
}

.complete-button {
  background-color: #28a745;
  color: white;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.dashboard-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9);
  color: #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.projects-section,
.project-details,
.create-project-form,
.add-user-form,
.create-task-form {
  width: 100%;
  margin-bottom: 30px;
  max-width: 800px; /* Ограничиваем ширину блока */
  word-wrap: break-word; /* Перенос слов внутри блока */
}

h3 {
  margin-bottom: 15px;
  font-size: 20px;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 800px; /* Ограничиваем ширину блока */
  word-wrap: break-word; /* Перенос слов внутри блока */
}

.project-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.project-actions button {
  margin-left: 10px;
}

.block {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 800px; /* Ограничиваем ширину блока */
  word-wrap: break-word; /* Перенос слов внутри блока */
}

.block:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.block h4 {
  margin-bottom: 10px;
}

.team-member,
.task-item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px; /* Ограничиваем ширину блока */
  word-wrap: break-word; /* Перенос слов внутри блока */
}

.team-member:last-child,
.task-item:last-child {
  border-bottom: none;
}

.team-member:hover,
.task-item:hover {
  background-color: #e9ecef;
}

.task-actions {
  display: flex;
  gap: 10px;
}

.input-field {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  max-width: 800px; /* Ограничиваем ширину блока */
  word-wrap: break-word; /* Перенос слов внутри блока */
}

.input-field:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.animated-button {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-size: 16px;
}

.animated-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.delete-button {
  background-color: #ff0000;
}

.delete-button:hover {
  background-color: #cc0000;
}

.cancel-button {
  background-color: #6c757d;
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style>

<style>
@import '~animate.css/animate.min.css';
</style>