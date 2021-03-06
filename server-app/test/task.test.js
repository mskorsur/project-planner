process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const Task = require('../models/task');
const Card = require('../models/card');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../bin/www');
const should = chai.should();
chai.use(chaiHttp);

describe('Task API endpoint', () => {
    let token = "";
    //create the token, so that tests can pass auth control
    before((done) => {
        User.remove({}, (err) => { 
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example123',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });
            user.password = user.generateHash(user.password);
    
            user.save().then(savedUser => {
                chai.request(api)
                .post('/api/login')
                .send({userName: 'example', password: 'example123'})
                .end((err,res) => {
                    token = res.body.token;
                    done();
                });
            });   
        }); 
    });

    beforeEach((done) => { 
        Task.remove({}, (err) => { 
           done();         
        });     
    });

    beforeEach((done) => { 
        Card.remove({}, (err) => { 
           done();         
        });     
    }); 

    describe('GET /tasks', () => {
        it('should GET 0 tasks when collection is empty', done => {
            chai.request(api)
            .get('/api/tasks')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });

        it('should GET 3 tasks when collection has 3 tasks', done => {
            let tasks = [];
            for (let i = 0; i < 3; i++) {
                const task = new Task({
                    _id: new mongoose.Types.ObjectId(),
                    name: 'example',
                    description: 'example desc',
                    label: 'Default',
                    card: new mongoose.Types.ObjectId()
                });
                tasks.push(task);
            }

            Task.create(tasks, (err, savedTasks) => {
                chai.request(api)
                .get('/api/tasks')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(3);
                    done();
                });
            });
        });
    });

    describe('POST /tasks', () => {
        it('should not POST a task when name is missing', done => {
            const task = {
                id: new mongoose.Types.ObjectId(),
                description: 'example desc',
                label: 'Default',
                card: new mongoose.Types.ObjectId()
            }

            chai.request(api)
                .post('/api/tasks')
                .set('Authorization', 'Bearer ' + token)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('name');
                    done();
                });
        });

        it('should not POST a task when description is missing', done => {
            const task = {
                id: new mongoose.Types.ObjectId(),
                name: 'example',
                label: 'Default',
                card: new mongoose.Types.ObjectId()
            }

            chai.request(api)
                .post('/api/tasks')
                .set('Authorization', 'Bearer ' + token)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('description');
                    done();
                });
        });

        it('should not POST a task when label is missing', done => {
            const task = {
                id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                card: new mongoose.Types.ObjectId()
            }

            chai.request(api)
                .post('/api/tasks')
                .set('Authorization', 'Bearer ' + token)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('label');
                    done();
                });
        });

        it('should not POST a task when cardID is missing', done => {
            const task = {
                id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                label: 'Default'
            }

            chai.request(api)
                .post('/api/tasks')
                .set('Authorization', 'Bearer ' + token)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('card');
                    done();
                });
        });

        it('should not create a task when card does not exist', done => {
            const task = {
                id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: new mongoose.Types.ObjectId()
            }

            chai.request(api)
                .post('/api/tasks')
                .set('Authorization', 'Bearer ' + token)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Task not created, card update failed');
                    done();
                });
        });

        it('should POST and create a task when required data is supplied and card exists', done => {
            const cardId = new mongoose.Types.ObjectId();
            const task = {
                id: new mongoose.Types.ObjectId().toString(),
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId.toString()
            }

            const card = new Card({
                _id: cardId,
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            })

            card.save().then(savedCard => {
                chai.request(api)
                .post('/api/tasks')
                .set('Authorization', 'Bearer ' + token)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Task created successfully');
                    res.body.should.have.property('task_data').which.is.an('object');
                    res.body.task_data.should.have.property('id');
                    res.body.task_data.should.have.property('name');
                    res.body.task_data.should.have.property('description');
                    res.body.task_data.should.have.property('label');
                    res.body.task_data.should.have.property('card');
                    res.body.task_data.should.have.property('dependencies').which.is.an('array');
                    done();
                });
            });
        });
    });

    describe('GET /tasks/:id', () => {
        it('should GET a task when ID is valid', done => {
            const task = new Task({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                label: 'Default',
                dueDate: Date.now().toString(),
                card: new mongoose.Types.ObjectId()
            });

            task.save().then(savedTask => {
                chai.request(api)
                    .get('/api/tasks/' + savedTask._id)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('id').eql(savedTask._id.toString());
                        res.body.should.have.property('name').eql(savedTask.name);
                        res.body.should.have.property('description').eql(savedTask.description);
                        res.body.should.have.property('label').eql(savedTask.label);
                        res.body.should.have.property('card').eql(savedTask.card.toString());
                        res.body.should.have.property('dueDate');
                        res.body.should.have.property('dependencies').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return null when ID is invalid', done => {
            const task = new Task({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: new mongoose.Types.ObjectId()
            });

            task.save().then(savedTask => {
                chai.request(api)
                    .get('/api/tasks/' + new mongoose.Types.ObjectId())
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.property('body').eql(null);
                        done();
                    });
            });
        });
    });

    describe('PUT /tasks/:id', () => {
        const taskId = new mongoose.Types.ObjectId();
        const cardId = new mongoose.Types.ObjectId();
        it('should not PUT a task when name is missing', done => {
            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId
            });

            task.save().then(savedTask => {
                const taskWithMissingName = {
                    id: taskId.toString(),
                    description: 'example desc',
                    label: 'Default',
                    card: cardId.toString()
                }

                chai.request(api)
                    .put('/api/tasks/' + savedTask._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(taskWithMissingName)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('name');
                        done();
                    });
            });
        });

        it('should not PUT a task when description is missing', done => {
            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId
            });

            task.save().then(savedTask => {
                const taskWithMissingDesc = {
                    id: taskId.toString(),
                    name: 'example',
                    label: 'Default',
                    card: cardId.toString()
                }

                chai.request(api)
                    .put('/api/tasks/' + savedTask._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(taskWithMissingDesc)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('description');
                        done();
                    });
            });
        });

        it('should not PUT a task when label is missing', done => {
            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId
            });

            task.save().then(savedTask => {
                const taskWithMissingLabel = {
                    id: taskId.toString(),
                    name: 'example',
                    description: 'example desc',
                    card: cardId.toString()
                }

                chai.request(api)
                    .put('/api/tasks/' + savedTask._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(taskWithMissingLabel)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('label');
                        done();
                    });
            });
        });

        it('should not PUT a task when cardID is missing', done => {
            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId
            });

            task.save().then(savedTask => {
                const taskWithMissingCardId = {
                    id: taskId.toString(),
                    name: 'example',
                    description: 'example desc',
                    label: 'Default'
                }

                chai.request(api)
                    .put('/api/tasks/' + savedTask._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(taskWithMissingCardId)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('card');
                        done();
                    });
            });
        });

        it('should PUT and update a task when required data is supplied and card did not change', done => {
            const task = new Task({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId,
                dependencies: []
            });

            const card = new Card({
                _id: cardId,
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: [taskId]
            });

            card.save().then(savedCard => {
                task.save().then(savedTask => {
                    const taskWithFullInfo = {
                        id: taskId.toString(),
                        name: 'New name',
                        description: 'example description',
                        label: 'Code',
                        dueDate: Date.now().toString(),
                        card: cardId.toString(),
                        dependencies: new mongoose.Types.ObjectId().toString()
                    }

                    chai.request(api)
                        .put('/api/tasks/' + savedTask._id)
                        .set('Authorization', 'Bearer ' + token)
                        .send(taskWithFullInfo)
                        .end((err,res) => {
                            res.should.have.status(200);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').eql('Task updated successfully');
                            res.body.should.have.property('task_data').which.is.an('object');
                            res.body.task_data.should.have.property('id').eql(savedTask._id.toString());
                            res.body.task_data.should.have.property('name').eql(taskWithFullInfo.name);
                            res.body.task_data.should.have.property('description').eql(taskWithFullInfo.description);
                            res.body.task_data.should.have.property('label').eql(taskWithFullInfo.label);
                            res.body.task_data.should.have.property('dueDate');
                            res.body.task_data.should.have.property('card').eql(taskWithFullInfo.card.toString());
                            res.body.task_data.should.have.property('dependencies').which.is.an('array');
                            done();
                        });
                });
            });
        })

        it('should not update a task if source card does not exist', done => {
            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: new mongoose.Types.ObjectId(),
                dependencies: []
            });

            const destCardId = new mongoose.Types.ObjectId();
            const destCard = new Card({
                _id: destCardId,
                name: 'Source',
                project: new mongoose.Types.ObjectId()
            });

            destCard.save().then(savedCard => {
                task.save().then(savedTask => {
                    const taskWithFullInfo = {
                        id: taskId.toString(),
                        name: 'example',
                        description: 'example desc',
                        label: 'Default',
                        card: destCardId.toString(),
                        dependencies: new mongoose.Types.ObjectId().toString()
                    }
                    chai.request(api)
                        .put('/api/tasks/' + savedTask._id)
                        .set('Authorization', 'Bearer ' + token)
                        .send(taskWithFullInfo)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').eql('Task not updated, cards updates failed');
                            done();
                        });
                });
            });
        });

        it('should not update a task if destination card does not exist', done => {
            const srcCardId = new mongoose.Types.ObjectId();
            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: srcCardId,
                dependencies: []
            });

            const srcCard = new Card({
                _id: srcCardId,
                name: 'Source',
                project: new mongoose.Types.ObjectId()
            });

            srcCard.save().then(savedCard => {
                task.save().then(savedTask => {
                    const taskWithFullInfo = {
                        id: taskId.toString(),
                        name: 'example',
                        description: 'example desc',
                        label: 'Default',
                        card: new mongoose.Types.ObjectId(),
                        dependencies: new mongoose.Types.ObjectId().toString()
                    }
                    chai.request(api)
                        .put('/api/tasks/' + savedTask._id)
                        .set('Authorization', 'Bearer ' + token)
                        .send(taskWithFullInfo)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').eql('Task not updated, cards updates failed');
                            done();
                        });
                });
            });
        });

        it('should PUT and update a task when required data is supplied and cards exist', done => {
            const srcCardId = new mongoose.Types.ObjectId();
            const destCardId = new mongoose.Types.ObjectId();

            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: srcCardId,
                dependencies: []
            });

            const srcCard = new Card({
                _id: srcCardId,
                name: 'Source',
                project: new mongoose.Types.ObjectId(),
                tasks: [taskId]
            });

            const destCard = new Card({
                _id: destCardId,
                name: 'Source',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            });

            destCard.save().then(savedDestCard => {
                srcCard.save().then(savedSrcCard => {
                    task.save().then(savedTask => {
                        const taskWithFullInfo = {
                            id: taskId.toString(),
                            name: 'New name',
                            description: 'example description',
                            label: 'Code',
                            dueDate: Date.now().toString(),
                            card: destCardId.toString(),
                            dependencies: new mongoose.Types.ObjectId().toString()
                        }
                        chai.request(api)
                            .put('/api/tasks/' + savedTask._id)
                            .set('Authorization', 'Bearer ' + token)
                            .send(taskWithFullInfo)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.an('object');
                                res.body.should.have.property('message').eql('Task updated successfully');
                                res.body.should.have.property('task_data').which.is.an('object');
                                res.body.task_data.should.have.property('id').eql(savedTask._id.toString());
                                res.body.task_data.should.have.property('name').eql(taskWithFullInfo.name);
                                res.body.task_data.should.have.property('description').eql(taskWithFullInfo.description);
                                res.body.task_data.should.have.property('label').eql(taskWithFullInfo.label);
                                res.body.task_data.should.have.property('dueDate');
                                res.body.task_data.should.have.property('card').eql(taskWithFullInfo.card);
                                res.body.task_data.should.have.property('dependencies').which.is.an('array');
                                done();
                            });
                    });
                });
            });
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should DELETE a task when ID is valid', done => {
            const cardId = new mongoose.Types.ObjectId();
            const taskId = new mongoose.Types.ObjectId();
            const task = new Task({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId,
                dependencies: []
            });

            const card = new Card({
                _id: cardId,
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: [taskId]
            });

            card.save().then(savedCard => {
                task.save().then(savedTask => {
                    chai.request(api)
                        .del('/api/tasks/' + savedTask._id)
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(204);
                            res.should.have.property('body').which.is.empty;
                            done();
                        });
                });
            });
        });

        it('should return error when ID is invalid', done => {
            const taskId = new mongoose.Types.ObjectId();
            const cardId = new mongoose.Types.ObjectId();
            const task = new Task({
                _id: taskId,
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: cardId,
                dependencies: []
            });

            const card = new Card({
                _id: cardId,
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: [taskId]
            });

            card.save().then(savedCard => {
                task.save().then(savedTask => {
                    chai.request(api)
                        .del('/api/tasks/' + new mongoose.Types.ObjectId())
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').eql('Task not deleted');
                            done();
                        });
                });
            });
        });

        it('should not DELETE a task when card update fails', done => {
            const task = new Task({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                description: 'example desc',
                label: 'Default',
                card: new mongoose.Types.ObjectId(),
                dependencies: []
            });

            task.save().then(savedTask => {
                chai.request(api)
                    .del('/api/tasks/' + savedTask._id)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Task not deleted, card update failed');
                        done();
                    });
            });
        });
    });
});