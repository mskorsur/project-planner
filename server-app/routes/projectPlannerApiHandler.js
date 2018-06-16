const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

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

router.post('/tasks', taskController.createSingleTask)

module.exports = router;