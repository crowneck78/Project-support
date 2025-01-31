const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Настройка подключения к базе данных
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qwerty050', // Убедитесь, что пароль соответствует вашему паролю от MySQL
  database: 'project_management'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
});

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Доступ запрещен');

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.status(403).send('Неверный токен');
    req.user = user;
    next();
  });
}

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send('Пользователь с таким email или именем уже существует.');
        }
        return res.status(500).send(`Ошибка регистрации: ${err.message}`);
      }
      res.status(201).send('Пользователь зарегистрирован');
    });
  } catch (error) {
    console.error('Ошибка хеширования пароля:', error);
    res.status(500).send('Ошибка регистрации');
  }
});

// Логин пользователя
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).send('Неверный email или пароль');
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).send('Неверный email или пароль');
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
  });
});

// Получение всех пользователей по email
app.get('/users/search', authenticateToken, (req, res) => {
  const email = req.query.email;
  const query = 'SELECT id, username, email FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).send(`Ошибка поиска пользователя: ${err.message}`);
    res.json(results);
  });
});

// Создание нового проекта
app.post('/projects', authenticateToken, (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;
  const query = 'INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)';
  db.query(query, [name, description || null, userId], (err, result) => {
    if (err) return res.status(500).send(`Ошибка создания проекта: ${err.message}`);
    
    // Добавляем владельца как участника проекта
    const projectId = result.insertId;
    const insertMemberQuery = 'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, "owner")';
    db.query(insertMemberQuery, [projectId, userId], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Ошибка добавления владельца:', insertErr);
        return res.status(500).send(`Ошибка добавления владельца: ${insertErr.message}`);
      }
      res.status(201).send('Проект создан');
    });
  });
});

// Получение проектов пользователя
app.get('/projects', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT p.* 
    FROM projects p 
    JOIN project_members pm ON p.id = pm.project_id
    WHERE pm.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(`Ошибка получения проектов: ${err.message}`);
    res.json(results);
  });
});

// Обновление проекта
app.patch('/projects/:projectId', authenticateToken, (req, res) => {
  const projectId = req.params.projectId;
  const { name, description } = req.body;
  // Проверяем, является ли пользователь владельцем проекта
  const checkOwnerQuery = 'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?';
  db.query(checkOwnerQuery, [projectId, req.user.id], (ownerErr, ownerResults) => {
    if (ownerErr) return res.status(500).send(`Ошибка при проверке владельца проекта: ${ownerErr.message}`);
    if (ownerResults.length === 0 || ownerResults[0].role !== 'owner') return res.status(403).send('Доступ запрещен');
    const updateQuery = 'UPDATE projects SET name = ?, description = ? WHERE id = ?';
    db.query(updateQuery, [name, description || null, projectId], (updateErr, updateResult) => {
      if (updateErr) return res.status(500).send(`Ошибка обновления проекта: ${updateErr.message}`);
      res.status(200).send('Проект обновлен');
    });
  });
});

// Удаление проекта
app.delete('/projects/:projectId', authenticateToken, (req, res) => {
  const projectId = req.params.projectId;
  // Проверяем, существует ли проект в базе данных
  const checkQuery = 'SELECT * FROM projects WHERE id = ?';
  db.query(checkQuery, [projectId], async (err, projectResults) => {
    if (err) {
      console.error('Ошибка при проверке существования проекта:', err);
      return res.status(500).send(`Ошибка проверки существования проекта: ${err.message}`);
    }
    if (projectResults.length === 0) {
      return res.status(404).send('Проект не найден');
    }
    // Проверяем, является ли пользователь владельцем проекта
    const checkOwnerQuery = 'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?';
    db.query(checkOwnerQuery, [projectId, req.user.id], (ownerErr, ownerResults) => {
      if (ownerErr) {
        console.error('Ошибка при проверке владельца проекта:', ownerErr);
        return res.status(500).send(`Ошибка при проверке владельца проекта: ${ownerErr.message}`);
      }
      if (ownerResults.length === 0 || ownerResults[0].role !== 'owner') {
        return res.status(403).send('Доступ запрещен');
      }
      // Проверяем, есть ли задачи в проекте
      const checkTasksQuery = 'SELECT * FROM tasks WHERE project_id = ?';
      db.query(checkTasksQuery, [projectId], async (tasksErr, tasksResults) => {
        if (tasksErr) {
          console.error('Ошибка при проверке задач проекта:', tasksErr);
          return res.status(500).send(`Ошибка проверки задач проекта: ${tasksErr.message}`);
        }
        if (tasksResults.length > 0) {
          // Удаляем все связанные задачи
          const deleteTasksQuery = 'DELETE FROM tasks WHERE project_id = ?';
          db.query(deleteTasksQuery, [projectId], (deleteTasksErr, deleteTasksResult) => {
            if (deleteTasksErr) {
              console.error('Ошибка удаления задач проекта:', deleteTasksErr);
              return res.status(500).send(`Ошибка удаления задач проекта: ${deleteTasksErr.message}`);
            }
            // Удаляем всех участников проекта
            const deleteMembersQuery = 'DELETE FROM project_members WHERE project_id = ?';
            db.query(deleteMembersQuery, [projectId], (deleteMembersErr, deleteMembersResult) => {
              if (deleteMembersErr) {
                console.error('Ошибка удаления участников проекта:', deleteMembersErr);
                return res.status(500).send(`Ошибка удаления участников проекта: ${deleteMembersErr.message}`);
              }
              // Удаляем сам проект
              const deleteProjectQuery = 'DELETE FROM projects WHERE id = ?';
              db.query(deleteProjectQuery, [projectId], (deleteProjectErr, deleteProjectResult) => {
                if (deleteProjectErr) {
                  console.error('Ошибка удаления проекта:', deleteProjectErr);
                  return res.status(500).send(`Ошибка удаления проекта: ${deleteProjectErr.message}`);
                }
                res.status(200).send('Проект удален');
              });
            });
          });
        } else {
          // Если задач нет, сразу удаляем участников и проект
          const deleteMembersQuery = 'DELETE FROM project_members WHERE project_id = ?';
          db.query(deleteMembersQuery, [projectId], (deleteMembersErr, deleteMembersResult) => {
            if (deleteMembersErr) {
              console.error('Ошибка удаления участников проекта:', deleteMembersErr);
              return res.status(500).send(`Ошибка удаления участников проекта: ${deleteMembersErr.message}`);
            }
            // Удаляем сам проект
            const deleteProjectQuery = 'DELETE FROM projects WHERE id = ?';
            db.query(deleteProjectQuery, [projectId], (deleteProjectErr, deleteProjectResult) => {
              if (deleteProjectErr) {
                console.error('Ошибка удаления проекта:', deleteProjectErr);
                return res.status(500).send(`Ошибка удаления проекта: ${deleteProjectErr.message}`);
              }
              res.status(200).send('Проект удален');
            });
          });
        }
      });
    });
  });
});

// Добавление пользователя в проект
app.post('/projects/:projectId/users', authenticateToken, (req, res) => {
  const projectId = req.params.projectId;
  const { userId } = req.body;
  const currentUserId = req.user.id;

  // Проверяем, является ли текущий пользователь участником проекта
  const checkMemberQuery = `
    SELECT * FROM project_members 
    WHERE project_id = ? AND user_id = ?
  `;
  db.query(checkMemberQuery, [projectId, currentUserId], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
    if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта.');

    // Проверяем, не является ли пользователь уже участником проекта
    const checkExistingMemberQuery = `
      SELECT * FROM project_members 
      WHERE project_id = ? AND user_id = ?
    `;
    db.query(checkExistingMemberQuery, [projectId, userId], (existingErr, existingResults) => {
      if (existingErr) return res.status(500).send(`Ошибка проверки участников проекта: ${existingErr.message}`);
      if (existingResults.length > 0) return res.status(400).send('Пользователь уже является участником проекта.');

      // Добавляем пользователя в проект
      const insertMemberQuery = `
        INSERT INTO project_members (project_id, user_id, role, added_by) 
        VALUES (?, ?, "member", ?)
      `;
      db.query(insertMemberQuery, [projectId, userId, currentUserId], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Ошибка добавления пользователя:', insertErr);
          return res.status(500).send(`Ошибка добавления пользователя: ${insertErr.message}`);
        }
        res.status(201).send('Пользователь добавлен в проект.');
      });
    });
  });
});

// Удаление пользователя из проекта
app.delete('/projects/:projectId/users/:userId', authenticateToken, (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;
  const currentUserId = req.user.id;

  // Проверяем, является ли текущий пользователь участником проекта
  const checkMemberQuery = `
    SELECT * FROM project_members 
    WHERE project_id = ? AND user_id = ?
  `;
  db.query(checkMemberQuery, [projectId, currentUserId], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
    if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта.');

    // Удаляем пользователя из проекта
    const deleteMemberQuery = `
      DELETE FROM project_members 
      WHERE project_id = ? AND user_id = ?
    `;
    db.query(deleteMemberQuery, [projectId, userId], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Ошибка удаления пользователя:', deleteErr);
        return res.status(500).send(`Ошибка удаления пользователя: ${deleteErr.message}`);
      }
      res.status(200).send('Пользователь удален из проекта.');
    });
  });
});

// Получение пользователей проекта
app.get('/projects/:projectId/users', authenticateToken, (req, res) => {
  const projectId = req.params.projectId;
  const currentUserId = req.user.id;

  // Проверяем, является ли текущий пользователь участником проекта
  const checkMemberQuery = `
    SELECT * FROM project_members 
    WHERE project_id = ? AND user_id = ?
  `;
  db.query(checkMemberQuery, [projectId, currentUserId], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
    if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта.');

    // Получаем список участников проекта
    const getUsersQuery = `
      SELECT u.id, u.username, u.email, pm.role, u2.username AS added_by_username 
      FROM users u 
      JOIN project_members pm ON u.id = pm.user_id 
      LEFT JOIN users u2 ON pm.added_by = u2.id 
      WHERE pm.project_id = ?
    `;
    db.query(getUsersQuery, [projectId], (err, results) => {
      if (err) {
        console.error('Ошибка получения пользователей проекта:', err);
        return res.status(500).send(`Ошибка получения пользователей проекта: ${err.message}`);
      }
      res.json(results);
    });
  });
});


// Создание новой задачи
app.post('/projects/:projectId/tasks', authenticateToken, (req, res) => {
  const { title, description, due_date } = req.body;
  const projectId = req.params.projectId;
  // Проверяем, является ли пользователь участником проекта
  const checkMemberQuery = `
    SELECT pm.role FROM project_members pm 
    WHERE pm.project_id = ? AND pm.user_id = ?
  `;
  db.query(checkMemberQuery, [projectId, req.user.id], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
    if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта');
    const query = 'INSERT INTO tasks (title, description, due_date, project_id, assigned_to) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [title, description || null, due_date || null, projectId, req.user.id], (err, result) => {
      if (err) return res.status(500).send(`Ошибка создания задачи: ${err.message}`);
       res.status(201).send('Задача создана');
    });
  });
});

// Получение задач проекта
app.get('/projects/:projectId/tasks', authenticateToken, (req, res) => {
  const projectId = req.params.projectId;
  // Проверяем, является ли пользователь участником проекта
  const checkMemberQuery = `
    SELECT pm.role FROM project_members pm 
    WHERE pm.project_id = ? AND pm.user_id = ?
  `;
  db.query(checkMemberQuery, [projectId, req.user.id], (checkErr, checkResults) => {
    if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
    if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта');
    const query = `
      SELECT t.*, u.username AS assigned_username 
      FROM tasks t 
      LEFT JOIN users u ON t.assigned_to = u.id 
      WHERE t.project_id = ?
    `;
    db.query(query, [projectId], (err, results) => {
      if (err) return res.status(500).send(`Ошибка получения задач: ${err.message}`);
      res.json(results);
    });
  });
});

// Изменение статуса задачи на "выполнено"
app.patch('/tasks/:taskId/complete', authenticateToken, (req, res) => {
  const taskId = req.params.taskId;
  // Проверяем, существует ли задача в базе данных
  const checkTaskQuery = 'SELECT project_id FROM tasks WHERE id = ?';
  db.query(checkTaskQuery, [taskId], (taskErr, taskResults) => {
    if (taskErr) return res.status(500).send(`Ошибка проверки задачи: ${taskErr.message}`);
    if (taskResults.length === 0) return res.status(404).send('Задача не найдена');
    const projectId = taskResults[0].project_id;
    // Проверяем, является ли пользователь участником проекта
    const checkMemberQuery = `
      SELECT pm.role FROM project_members pm 
      WHERE pm.project_id = ? AND pm.user_id = ?
    `;
    db.query(checkMemberQuery, [projectId, req.user.id], (checkErr, checkResults) => {
      if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
      if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта');
      const updateQuery = 'UPDATE tasks SET status = "completed" WHERE id = ?';
      db.query(updateQuery, [taskId], (err, result) => {
        if (err) return res.status(500).send(`Ошибка обновления статуса задачи: ${err.message}`);
        res.status(200).send('Статус задачи обновлен');
      });
    });
  });
});

// Изменение статуса задачи на "в работе"
app.patch('/tasks/:taskId/in-progress', authenticateToken, (req, res) => {
  const taskId = req.params.taskId;
  // Проверяем, существует ли задача в базе данных
  const checkTaskQuery = 'SELECT project_id FROM tasks WHERE id = ?';
  db.query(checkTaskQuery, [taskId], (taskErr, taskResults) => {
    if (taskErr) return res.status(500).send(`Ошибка проверки задачи: ${taskErr.message}`);
    if (taskResults.length === 0) return res.status(404).send('Задача не найдена');
    const projectId = taskResults[0].project_id;
    // Проверяем, является ли пользователь участником проекта
    const checkMemberQuery = `
      SELECT pm.role FROM project_members pm 
      WHERE pm.project_id = ? AND pm.user_id = ?
    `;
    db.query(checkMemberQuery, [projectId, req.user.id], (checkErr, checkResults) => {
      if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
      if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта');
      const updateQuery = 'UPDATE tasks SET status = "in_progress" WHERE id = ?';
      db.query(updateQuery, [taskId], (err, result) => {
        if (err) return res.status(500).send(`Ошибка обновления статуса задачи: ${err.message}`);
        res.status(200).send('Статус задачи обновлен');
      });
    });
  });
});

// Удаление задачи
app.delete('/tasks/:taskId', authenticateToken, (req, res) => {
  const taskId = req.params.taskId;
  // Проверяем, существует ли задача в базе данных
  const checkTaskQuery = 'SELECT project_id FROM tasks WHERE id = ?';
  db.query(checkTaskQuery, [taskId], (taskErr, taskResults) => {
    if (taskErr) return res.status(500).send(`Ошибка проверки задачи: ${taskErr.message}`);
    if (taskResults.length === 0) return res.status(404).send('Задача не найдена');
    const projectId = taskResults[0].project_id;
    // Проверяем, является ли пользователь участником проекта
    const checkMemberQuery = `
      SELECT pm.role FROM project_members pm 
      WHERE pm.project_id = ? AND pm.user_id = ?
    `;
    db.query(checkMemberQuery, [projectId, req.user.id], (checkErr, checkResults) => {
      if (checkErr) return res.status(500).send(`Ошибка проверки участника проекта: ${checkErr.message}`);
      if (checkResults.length === 0) return res.status(403).send('Вы не являетесь участником этого проекта');
      const deleteQuery = 'DELETE FROM tasks WHERE id = ?';
      db.query(deleteQuery, [taskId], (deleteErr, deleteResult) => {
        if (deleteErr) return res.status(500).send(`Ошибка удаления задачи: ${deleteErr.message}`);
        res.status(200).send('Задача удалена');
      });
    });
  });
});

// Аутентификация токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
} 

app.listen(5000, () => {
  console.log('Server running on port 5000');
});