const express = require('express');
const router = express.Router();
const checkAuth = require('../auth/checkAuth');

const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const cardController = require('../controllers/cardController');
const projectController = require('../controllers/projectController');

//User routes and handlers
router.get('/users/:id/projects', checkAuth, userController.getUserProjects);

router.put('/users/:id/projects', checkAuth, userController.updateUserProjects);

router.get('/users/:id', checkAuth, userController.getSingleUser);

router.put('/users/:id', checkAuth, userController.updateSingleUser);

router.delete('/users/:id', checkAuth, userController.deleteSingleUser);

router.get('/users', checkAuth, userController.getUserList);

router.post('/users', userController.createSingleUser);

router.post('/login', userController.loginUser);

//Task routes and handlers
router.get('/tasks/:id', checkAuth, taskController.getSingleTask);

router.put('/tasks/:id', checkAuth, taskController.updateSingleTask);

router.delete('/tasks/:id', checkAuth, taskController.deleteSingleTask);

router.get('/tasks', checkAuth, taskController.getTaskList);

router.post('/tasks', checkAuth, taskController.createSingleTask);

//Card routes and handlers
router.get('/cards/:id/tasks', checkAuth, cardController.getCardTasks);

router.put('/cards/:id/tasks', checkAuth, cardController.updateCardTasks);

router.get('/cards/:id', checkAuth, cardController.getSingleCard);

router.put('/cards/:id', checkAuth, cardController.updateSingleCard);

router.delete('/cards/:id', checkAuth, cardController.deleteSingleCard);

router.get('/cards', checkAuth, cardController.getCardList);

router.post('/cards', checkAuth, cardController.createSingleCard);

//Project routes and handlers
router.get('/projects/:id/cards', checkAuth, projectController.getProjectCards);

router.put('/projects/:id/cards', checkAuth, projectController.updateProjectCards);

router.get('/projects/:id', checkAuth, projectController.getSingleProject);

router.put('/projects/:id', checkAuth, projectController.updateSingleProject);

router.delete('/projects/:id', checkAuth, projectController.deleteSingleProject);

router.get('/projects', checkAuth, projectController.getProjectList);

router.post('/projects', checkAuth, projectController.createSingleProject);

module.exports = router;