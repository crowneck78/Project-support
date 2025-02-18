<template>
  <div class="login-menu-container">
    <h2>Вход</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" class="animated-button">Войти</button>
    </form>

  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElNotification } from 'element-plus';

export default {
  name: 'LoginMenu',
  components: {
    
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const store = useStore();
    const router = useRouter();

    const login = async () => {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email: email.value,
          password: password.value,
        });
        const token = response.data.token;
        store.dispatch('login', token);
        router.push('/dashboard');
        ElNotification.success({
          title: 'Успех',
          message: 'Вы успешно вошли в систему!',
          duration: 2000,
        });
      } catch (error) {
        console.error('Ошибка входа:', error);
        ElNotification.error({
          title: 'Ошибка',
          message: 'Неверный email или пароль',
          duration: 3000,
        });
      }
    };

    return {
      email,
      password,
      login,
    };
  },
};
</script>

<style scoped>
.custom-notification {
  background-color: #000000; /* Черный фон */
  color: #ffffff; /* Белый текст */
  border: 1px solid #007bff; /* Синяя рамка */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-notification .el-notification__title {
  font-size: 16px;
  font-weight: bold;
  color: #ffffff; /* Белый заголовок */
}

.custom-notification .el-notification__content {
  font-size: 14px;
  color: #ffffff; /* Белый текст */
}

.custom-notification .el-notification__closeBtn {
  color: #ffffff; /* Белая кнопка закрытия */
}


.login-menu-container {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.9); /* Прозрачный белый фон */
  color: #000000; /* Черный текст */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box; /* Включаем внутренние отступы в размеры элемента */
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
}

input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  background-color: #ffffff; /* Белый фон */
  color: #000000; /* Черный текст */
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.animated-button {
  padding: 12px 20px;
  background-color: #007bff; /* Синий фон */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 16px;
}

.animated-button:hover {
  background-color: #0056b3; /* Темно-синий при наведении */
}

@media (max-width: 600px) {
  .login-menu-container {
    padding: 20px;
  }

  input {
    padding: 10px;
  }

  .animated-button {
    padding: 10px 15px;
  }
}
</style>

<!-- Импорт animate.css -->
<style>
@import '~animate.css/animate.min.css';
</style>