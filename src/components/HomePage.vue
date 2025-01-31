<template>
  <div id="home-page">
    <div class="background-container" :style="backgroundStyle"></div>
    <!-- Герой -->
    <section class="hero-section">
      <div class="content-wrapper">
        <div class="left-content">
          <h1 class="site-title">TeamSyncer</h1>
        </div>
        <div class="right-content">
          <p class="welcome-text">Войдите или зарегистрируйтесь:</p>
          <div class="buttons">
            <router-link to="/login" class="animated-button">Войти</router-link>
            <router-link to="/register" class="animated-button">Регистрация</router-link>
          </div>
        </div>
      </div>
      <!-- Раздел с кнопками информации -->
      <div class="info-buttons">
        <button @click="toggleInfo('about')" @mouseover="showInfo('about')" @mouseleave="hideInfo('about')" :class="{ active: activeInfo === 'about' }" class="info-button">О нас</button>
        <button @click="toggleInfo('features')" @mouseover="showInfo('features')" @mouseleave="hideInfo('features')" :class="{ active: activeInfo === 'features' }" class="info-button">Наши возможности</button>
        <button @click="toggleInfo('instructions')" @mouseover="showInfo('instructions')" @mouseleave="hideInfo('instructions')" :class="{ active: activeInfo === 'instructions' }" class="info-button">Инструкция</button>
      </div>
      <!-- Информация О нас -->
      <transition name="fade">
        <div v-if="activeInfo === 'about'" class="info-text">
          <h2>О нас</h2>
          <p>TeamSyncer — это современная платформа для управления проектами, разработанная для повышения производительности и координации работы команд. Мы понимаем, что успешное выполнение проектов требует не только эффективного планирования, но и четкого взаимодействия между всеми участниками. Наш сервис предлагает все необходимые инструменты для достижения этих целей.</p>
        </div>
      </transition>
      <!-- Информация Наши возможности -->
      <transition name="fade">
        <div v-if="activeInfo === 'features'" class="info-text">
          <h2>Наши возможности</h2>
          <ul>
            <li><strong>Создание и управление проектами:</strong> Создавайте новые проекты, добавляйте описание и управляйте их статусом. Наши инструменты позволяют легко редактировать и обновлять информацию о проектах в любое время.</li>
            <li><strong>Управление командой:</strong> Пригласите новых участников в свой проект и назначьте им роли. Управляйте доступом к проектам и контролируйте активность каждого члена команды.</li>
            <li><strong>Создание и отслеживание задач:</strong> Создавайте задачи для каждого проекта, назначайте их исполнителям и отслеживайте прогресс. Вы можете добавлять дедлайны, описания и приоритеты для каждой задачи.</li>
            <li><strong>Координация работы:</strong> Наша платформа позволяет легко координировать работу всей команды, обеспечивая прозрачность и контроль над всеми аспектами проекта. Всегда будьте в курсе того, кто выполняет какую задачу и когда она будет завершена.</li>
            <li><strong>Интеграция с системами контроля версий:</strong> TeamSyncer поддерживает интеграцию с такими популярными системами контроля версий, как GitHub, Subversion и Mercurial. Это позволяет вам легко управлять изменениями в коде и документации, а также отслеживать историю изменений.</li>
            <li><strong>Отчеты и аналитика:</strong> Получайте подробные отчеты о состоянии ваших проектов и задач. Наша аналитика поможет вам принимать более обоснованные решения и оптимизировать рабочие процессы.</li>
            <li><strong>Удобный интерфейс:</strong> Интуитивно понятный интерфейс TeamSyncer делает управление проектами простым и удобным. Независимо от вашего уровня подготовки, вы сможете быстро освоиться и начать продуктивную работу.</li>
            <li><strong>Поддержка различных устройств:</strong> Наш сайт адаптирован для использования на различных устройствах, включая мобильные телефоны и планшеты. Работайте с проектами в любом месте и в любое время.</li>
          </ul>
        </div>
      </transition>
      <!-- Инструкция -->
      <transition name="fade">
        <div v-if="activeInfo === 'instructions'" class="info-text">
          <h2>Инструкция</h2>
          <p>Чтобы начать пользоваться нашей платформой для управления проектами, следуйте этим шагам:</p>
          <ol>
            <li>Зарегистрируйтесь или войдите в свою учетную запись.</li>
            <li>Создайте новый проект, указав его название и описание.</li>
            <li>Добавьте участников в ваш проект и назначьте им роли.</li>
            <li>Создайте задачи для каждого проекта, назначьте их исполнителям и установите дедлайны.</li>
            <li>Отслеживайте прогресс выполнения задач и проектов в реальном времени.</li>
            <li>Используйте наши интеграции с системами контроля версий для управления изменениями в коде и документации.</li>
            <li>Анализируйте отчеты и используйте данные для оптимизации процессов.</li>
          </ol>
          <p>Наша платформа позволяет вам легко и удобно управлять всеми аспектами проекта, обеспечивая высокую продуктивность и прозрачность.</p>
        </div>
      </transition>
      <h2 class="main-text">Мы работаем с:</h2>
      <div class="features-grid">
        <div class="feature-item">
          <a href="https://github.com" target="_blank">
            <img src="@/assets/GitHub.svg" alt="GitHub Logo" class="logo animated-logo"></a>
        </div>
        <div class="feature-item">
          <a href="https://subversion.apache.org" target="_blank">
            <img src="@/assets/Subversion.svg" alt="Subversion Logo" class="logo subversion-logo animated-logo"></a>
        </div>
        <div class="feature-item">
          <a href="https://www.mercurial-scm.org" target="_blank">
            <img src="@/assets/Mercurial.svg" alt="Mercurial Logo" class="logo animated-logo"></a>
        </div>
      </div>
    </section>
    <!-- Раздел отзывов -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="main-text">Отзывы наших клиентов</h2>
        <div class="testimonials-grid">
          <div class="testimonial-item">
            <p class="main-text">"Это лучший сервис, который я когда-либо использовал! Он помог мне организовать мою команду и значительно повысить продуктивность."</p>
            <h4 class="main-text">Иван Иванов</h4>
          </div>
          <div class="testimonial-item">
            <p class="main-text">"Я очень доволен работой этой команды. Все функции работают безупречно, и это значительно облегчило нам жизнь."</p>
            <h4 class="main-text">Мария Петрова</h4>
          </div>
        </div>
      </div>
    </section>
    <!-- Раздел команды -->
    <section class="team-section">
      <div class="container">
        <h2 class="main-text">Наша команда</h2>
        <div class="team-grid">
          <div class="team-member">
            <img src="" alt="Team Member 1">
            <h4 class="main-text">Алексей Смирнов</h4>
            <p class="main-text">Основатель и CEO</p>
          </div>
          <div class="team-member">
            <img src="" alt="Team Member 2">
            <h4 class="main-text">Екатерина Иванова</h4>
            <p class="main-text">Руководитель отдела разработки</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      activeInfo: null,
      clickedButton: null,
      backgroundImageUrl: require('@/assets/Main.png') 
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url(${this.backgroundImageUrl})`,
        backgroundSize: 'cover', // Масштабирует фон так, чтобы он покрывал весь контейнер
        backgroundPosition: 'center', // Центрирует фон
        backgroundRepeat: 'no-repeat', // Убирает повторение фона
        width: '100%', // Полная ширина
        height: '100vh', // Полная высота экрана
        position: 'fixed', // Фиксированное позиционирование
        top: 0, // Позиция от верхнего края
        left: 0, // Позиция от левого края
        zIndex: -1 // Помещает фон за остальные элементы
      };
    }
  },
  methods: {
    showInfo(info) {
      if (!this.clickedButton || this.clickedButton !== info) {
        this.activeInfo = info;
      }
    },
    hideInfo(info) {
      if (this.activeInfo === info && !this.clickedButton) {
        this.activeInfo = null;
      }
    },
    toggleInfo(info) {
      if (this.clickedButton === info) {
        this.clickedButton = null;
        this.activeInfo = null;
      } else {
        this.clickedButton = info;
        this.activeInfo = info;
      }
    }
  }
}
</script>

<style scoped>
/* Подключение шрифта Docker */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');



/* Глобальные стили */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', sans-serif; /* Единый шрифт */
  color: #333; /* Единый цвет текста */
}

/* Убираем отступы у фоновой картинки */
#home-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  padding: 0; /* Убираем отступы вокруг фона */
  box-sizing: border-box;
}

/* Установка единого цвета и шрифта для текста */
.main-text {
  font-family: 'Roboto', sans-serif; /* Единый шрифт */
  color: #1d67ac; /* Единый цвет текста */
}

/* Если есть другие специфичные классы или элементы, добавляем их здесь */
h2.main-text, h4.main-text, p.main-text {
  font-family: 'Roboto', sans-serif; /* Единый шрифт */
  color: #1368b2; /* Единый цвет текста */
}

.hero-section {
  padding: 0; /* Убираем отступы сверху и снизу для секции героя */
  text-align: center; /* Центрируем текст внутри секции героя */
  width: 100%;
  box-sizing: border-box;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto; /* Центрируем контент по горизонтали */
  display: flex;
  justify-content: space-between; /* Располагаем блоки по краям (можно изменить на center для центрирования) */
  align-items: center; /* Выравнивание вертикальное по центру */
  padding: 0; /* Убираем отступы слева и справа для контента */
}


.left-content{
  width: 50%; /* Ширина каждого блока */
  display: flex;
  flex-direction: column;
  align-items: center; /* Горизонтальное выравнивание содержимого */
  text-align: center; /* Центрируем текст внутри блоков */
  padding: 40px; /* Добавляем внутренние отступы для блоков */
}

.right-content {
  width: 50%; /* Ширина каждого блока */
  
  flex-direction: column;
   /* Горизонтальное выравнивание содержимого */
 /* Центрируем текст внутри блоков */
  /* Добавляем внутренние отступы для блоков */
}

.site-title {
  font-size: 6em; /* Размер шрифта */
  font-weight: bold; /* Жирный шрифт */
  margin-right: 300px;
  margin-bottom: 50px; /* Отступ снизу от заголовка */
  color: black; /* Цвет текста */
  background: linear-gradient(to right, black, #007bff); /* Градиент для эффекта */
  -webkit-background-clip: text; /* Применяем градиент к тексту */
  -webkit-text-fill-color: transparent; /* Делаем текст прозрачным */
  background-size: 200% 100%; /* Размер фона */
  background-position: 100%; /* Позиция фона */
  transition: background-position 1s ease-in-out; /* Анимация перехода */
}

.site-title:hover {
  background-position: -100%; /* Изменение позиции фона при наведении */
  animation: shimmer 5s infinite alternate; /* Анимация переливания */
}

.welcome-text {
  font-size: 3em; /* Размер шрифта */
  font-weight: bold; /* Жирный шрифт */
  margin-bottom: 20px; /* Отступ снизу от текста */
  color: rgb(31, 82, 190); /* Цвет текста */
  margin-left:200px;
}

.buttons {
  display: flex;
  justify-content: center; /* Центрируем кнопки */
  gap: 20px; /* Отступ между кнопками */
  margin-top: 20px; /* Отступ сверху от кнопок */
  margin-left:200px;
}

.animated-button {
  padding: 12px 20px; /* Внутренние отступы кнопок */
  background-color: #007bff; /* Фон кнопок */
  color: white; /* Цвет текста кнопок */
  border: none; /* Убираем границу */
  border-radius: 5px; /* Закругление углов */
  cursor: pointer; /* Курсор указывает на кликабельность */
  transition: background-color 0.3s ease, transform 0.3s ease; /* Анимация перехода */
  font-size: 16px; /* Размер шрифта */
  text-decoration: none; /* Убираем подчеркивание ссылок */
}

.animated-button:hover {
  background-color: #0056b3; /* Изменение цвета фона при наведении */
  transform: scale(1.05); /* Масштабирование при наведении */
}

.info-buttons {
  display: flex;
  justify-content: center; /* Центрируем кнопки информации */
  gap: 20px; /* Отступ между кнопками */
  margin: 40px 0; /* Отступы сверху и снизу */
}

.info-button {
  padding: 12px 20px; /* Внутренние отступы кнопок */
  background-color: #007bff; /* Фон кнопок */
  color: white; /* Цвет текста кнопок */
  border: none; /* Убираем границу */
  border-radius: 5px; /* Закругление углов */
  cursor: pointer; /* Курсор указывает на кликабельность */
  transition: background-color 0.3s ease, transform 0.3s ease; /* Анимация перехода */
  font-size: 16px; /* Размер шрифта */
  text-decoration: none; /* Убираем подчеркивание ссылок */
  text-align: center; /* Центрируем текст внутри кнопок */
}

.info-button:hover {
  background-color: #0056b3; /* Изменение цвета фона при наведении */
  transform: scale(1.05); /* Масштабирование при наведении */
}

.info-button.active {
  background-color: #0056b3; /* Цвет фона активной кнопки */
}

.features-grid {
  display: flex;
  justify-content: center; /* Центрируем логотипы */
  flex-wrap: wrap; /* Перенос элементов на новую строку при необходимости */
  margin-bottom: 40px; /* Отступ снизу от сетки */
  gap: 40px; /* Отступ между элементами */
}

.feature-item {
  text-align: center; /* Центрируем текст внутри элементов */
  flex: 1 0 30%; /* Ширина элементов и возможность сжатия */
}

.logo {
  width: 100px; /* Ширина логотипа */
  height: auto; /* Сохранение пропорций */
  transition: transform 0.3s ease, filter 0.3s ease; /* Анимация перехода */
}

.logo:hover {
  transform: scale(1.1); /* Масштабирование при наведении */
  animation: logo-shimmer 1.5s infinite alternate; /* Анимация переливания */
}

@keyframes logo-shimmer {
  from {
    filter: drop-shadow(0 0 10px rgba(0, 123, 255, 0)); /* Начальный эффект тени */
  }
  to {
    filter: drop-shadow(100px 0 10px rgba(0, 123, 255, 1)); /* Конечный эффект тени */
  }
}

.subversion-logo {
 width: 200px;
 margin-top: 30px;
}

.about-text, .info-text {
  font-size: 1.5em;
  margin-top: 40px; /* Отступ сверху от текста */
  max-width: 800px; /* Максимальная ширина текста */
  margin-left: auto; /* Выравнивание слева */
  margin-right: auto; /* Выравнивание справа */
  text-align: left; /* Выравнивание текста слева */
  color: #1368b2; /* Цвет текста */
  font-weight: bold; /* Жирный шрифт */
}

.testimonials-section, .team-section {
  background-color: white; /* Фон секций */
  padding: 40px 20px; /* Отступы внутрь секций */
  color: black; /* Цвет текста */
}

.testimonials-section h2, .team-section h2 {
  text-align: center; /* Центрируем заголовки */
  margin-bottom: 40px; /* Отступ снизу от заголовков */
}

.testimonials-grid {
  display: flex;
  justify-content: space-around; /* Располагаем элементы равномерно */
  flex-wrap: wrap; /* Перенос элементов на новую строку при необходимости */
}

.testimonial-item {
  width: 45%; /* Ширина элементов */
  margin-bottom: 40px; /* Отступ снизу от элементов */
  text-align: center; /* Центрируем текст внутри элементов */
  background-color: rgba(255, 255, 255, 0.9); /* Полупрозрачный фон */
  padding: 20px; /* Внутренние отступы */
  border-radius: 10px; /* Закругление углов */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Тень */
}

.team-section h2 {
  text-align: center; /* Центрируем заголовок */
  margin-bottom: 40px; /* Отступ снизу от заголовка */
}

.team-grid {
  display: flex;
  justify-content: space-around; /* Располагаем элементы равномерно */
  flex-wrap: wrap; /* Перенос элементов на новую строку при необходимости */
}

.team-member {
  width: 30%; /* Ширина элементов */
  text-align: center; /* Центрируем текст внутри элементов */
  background-color: rgba(255, 255, 255, 0.9); /* Полупрозрачный фон */
  padding: 20px; /* Внутренние отступы */
  border-radius: 10px; /* Закругление углов */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Тень */
}

.team-member img {
  width: 100px; /* Ширина изображения */
  height: 100px; /* Высота изображения */
  border-radius: 50%; /* Круглая форма */
  object-fit: cover; /* Сохранение пропорций */
}



/* Анимация появления текста */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease; /* Анимация перехода прозрачности */
}

.fade-enter-from, .fade-leave-to {
  opacity: 0; /* Начальное состояние прозрачности */
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column; /* Изменение направления блоков на вертикальное */
    align-items: center; /* Выравнивание по центру */
  }

  .left-content, .right-content {
    width: 100%; /* Полная ширина блоков */
    text-align: center; /* Центрируем текст */
  }

  .buttons {
    justify-content: center; /* Центрируем кнопки */
  }

  .info-buttons {
    flex-direction: column; /* Изменение направления кнопок на вертикальное */
    align-items: center; /* Выравнивание по центру */
    gap: 10px; /* Отступ между кнопками */
  }

  .features-grid {
    gap: 20px; /* Отступ между элементами */
  }

  .about-text, .info-text {
    text-align: center; /* Центрируем текст */
  }
}
</style>