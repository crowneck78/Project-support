<template>
  <div id="app">
    <!-- Шапка будет отображаться только на определенных страницах -->
    <header v-if="showHeader" class="header">
      <nav class="navbar">
        <router-link to="/">Главная</router-link> <!-- Добавляем кнопку для перехода на главную страницу -->
        
        <template v-if="isLoggedIn">
          <router-link to="/dashboard">Управление проектами</router-link>
          <button @click="logout" class="navbar-button">Выйти из аккаунта</button> <!-- Кнопка для выхода -->
        </template>
        <template v-else>
          <router-link to="/login">Вход</router-link>
          <router-link to="/register">Регистрация</router-link>
        </template>
      </nav>
    </header>
    <div class="content">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <!-- Подвал будет отображаться только на определенных страницах -->
    <footer v-if="showFooter" class="footer">
      <p>&copy; 2025 Проектное управление</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false // Замените это на вашу логику проверки авторизации
    };
  },
  computed: {
    showHeader() {
      const currentRoute = this.$route.name;
      return ['HomePage', 'LoginMenu', 'RegisterMenu', 'DashboardMenu'].includes(currentRoute);
    },
    showFooter() {
      const currentRoute = this.$route.name;
      return ['HomePage', 'LoginMenu', 'RegisterMenu', 'DashboardMenu'].includes(currentRoute);
    }
  },
  methods: {
    logout() {
      // Логика выхода из системы
      this.isLoggedIn = false;
      localStorage.removeItem('token'); // Удаляем токен при выходе
      this.$router.push('/'); // Перенаправляем на главную страницу
    }
  },
  mounted() {
    // Пример проверки авторизации (замените на вашу реальную логику)
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    }
  }
}
</script>

<style>
/* Глобальные стили */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Montserrat', sans-serif;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header {
  background-color: #000000; /* Черный фон */
  padding: 20px;
  text-align: right;
  position: sticky;
  top: 0;
  z-index: 1000;
}
.navbar a, .navbar-button {
  color: #ffffff;
  text-decoration: none;
  margin-left: 20px;
  font-size: 18px;
}
.navbar button, .navbar-button {
  background-color: #007bff; /* Темно-синий фон */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 20px; /* Добавляем расстояние между кнопками */
}
.navbar button:hover, .navbar-button:hover {
  background-color: #0056b3; /* Темно-синий при наведении */
}
.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%; /* Убедимся, что занимает всю ширину экрана */
  box-sizing: border-box; /* Включаем внутренние отступы в размеры элемента */
}
.footer {
  background-color: #000000; /* Черный фон */
  padding: 20px;
  text-align: center;
  color: #ffffff; /* Белый текст */
  font-size: 16px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>