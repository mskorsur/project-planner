const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');
const cardController = require('../controllers/cardController');
const projectController = require('../controllers/projectController');

//User routes and handlers
router.get('/users/:id/projects', userController.getUserProjects);

router.put('/users/:id/projects', userController.updateUserProjects);

router.get('/users/:id', userController.getSingleUser);

router.put('/users/:id', userController.updateSingleUser);

router.delete('/users/:id', userController.deleteSingleUser);

router.get('/users', userController.getUserList);

router.post('/users', userController.createSingleUser);

//Task routes and handlers
router.get('/tasks/:id', taskController.getSingleTask);

router.put('/tasks/:id', taskController.updateSingleTask);

router.delete('/tasks/:id', taskController.deleteSingleTask);

router.get('/tasks', taskController.getTaskList);

router.post('/tasks', taskController.createSingleTask);

//Card routes and handlers
router.get('/cards/:id/tasks', cardController.getCardTasks);

router.put('/cards/:id/tasks', cardController.updateCardTasks);

router.get('/cards/:id', cardController.getSingleCard);

router.put('/cards/:id', cardController.updateSingleCard);

router.delete('/cards/:id', cardController.deleteSingleCard);

router.get('/cards', cardController.getCardList);

router.post('/cards', cardController.createSingleCard);

//Project routes and handlers
router.get('/projects/:id/cards', projectController.getProjectCards);

router.put('/projects/:id/cards', projectController.updateProjectCards);

router.get('/projects/:id', projectController.getSingleProject);

router.put('/projects/:id', projectController.updateSingleProject);

router.delete('/projects/:id', projectController.deleteSingleProject);

router.get('/projects', projectController.getProjectList);

router.post('/projects', projectController.createSingleProject);

module.exports = router;