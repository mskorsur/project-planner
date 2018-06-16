const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

//User routes and handlers
router.get('/users/:id/projects', userController.getUserProjects);

router.put('/users/:id/projects', userController.updateUserProjects);

router.get('/users/:id', userController.getSingleUser);

router.put('/users/:id', userController.updateSingleUser);

router.delete('/users/:id', userController.deleteSingleUser);

router.get('/users', userController.getUserList);

router.post('/users', userController.createSingleUser);


module.exports = router;