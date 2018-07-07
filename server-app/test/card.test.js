process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const Card = require('../models/card');
const Project = require('../models/project');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../bin/www');
const should = chai.should();
chai.use(chaiHttp);

describe('Card API endpoint', () => {
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
        Card.remove({}, (err) => { 
           done();         
        });     
    });

    beforeEach((done) => { 
        Project.remove({}, (err) => { 
           done();         
        });     
    });

    describe('GET /cards', () => {
        it('should GET 0 cards when collection is empty', done => {
            chai.request(api)
            .get('/api/cards')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });

        it('should GET 3 cards when collection has 3 cards', done => {
            let cards = [];
            for (let i = 0; i < 3; i++) {
                const card = new Card({
                    _id: new mongoose.Types.ObjectId(),
                    name: 'example',
                    project: new mongoose.Types.ObjectId()
                });
                cards.push(card);
            }

            Card.create(cards, (err, savedCards) => {
                chai.request(api)
                .get('/api/cards')
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

    describe('POST /cards', () => {
        it('should not POST a card when name is missing', done => {
            const card = {
                id: new mongoose.Types.ObjectId(),
                project: new mongoose.Types.ObjectId()
            }

            chai.request(api)
                .post('/api/cards')
                .set('Authorization', 'Bearer ' + token)
                .send(card)
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

        it('should not POST a card when projectID is missing', done => {
            const card = {
                id: new mongoose.Types.ObjectId(),
                name: 'example'
            }

            chai.request(api)
                .post('/api/cards')
                .set('Authorization', 'Bearer ' + token)
                .send(card)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('project');
                    done();
                });
        });

        it('should not create a card when project does not exist', done => {
            const card = {
                id: 'id',
                name: 'example',
                project: new mongoose.Types.ObjectId()
            }

            chai.request(api)
                .post('/api/cards')
                .set('Authorization', 'Bearer ' + token)
                .send(card)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Card not created, project update failed');
                    done();
                });
        });

        it('should POST and create a card when required data is supplied and project exists', done => {
            const projectId = new mongoose.Types.ObjectId();
            const card = {
                id: new mongoose.Types.ObjectId(),
                name: 'example',
                project: projectId
            }

            const project = new Project({
                _id: projectId,
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                .post('/api/cards')
                .set('Authorization', 'Bearer ' + token)
                .send(card)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Card created successfully');
                    res.body.should.have.property('card_data').which.is.an('object');
                    res.body.card_data.should.have.property('id');
                    res.body.card_data.should.have.property('name');
                    res.body.card_data.should.have.property('project');
                    res.body.card_data.should.have.property('tasks').which.is.an('array');
                    done();
                });
            });
        });
    });

    describe('GET /cards/:id', () => {
        it('should GET a card when ID is valid', done => {
            const card = new Card({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + savedCard._id)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('id').eql(savedCard._id.toString());
                        res.body.should.have.property('name').eql(savedCard.name);
                        res.body.should.have.property('project').eql(savedCard.project.toString());
                        res.body.should.have.property('tasks').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return null when ID is invalid', done => {
            const card = new Card({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + new mongoose.Types.ObjectId())
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.property('body').eql(null);
                        done();
                    });
            });
        });
    });

    describe('PUT /cards/:id', () => {
        it('should not PUT a card when name is missing', done => {
            const cardId = new mongoose.Types.ObjectId();
            const projectId = new mongoose.Types.ObjectId();
            const card = new Card({
                _id: cardId,
                name: 'example',
                project: projectId,
                tasks: []
            });

            card.save().then(savedCard => {
                const cardWithMissingName = {
                    id: cardId,
                    project: projectId
                }

                chai.request(api)
                    .put('/api/cards/' + savedCard._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(cardWithMissingName)
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

        it('should not PUT a card when projectID is missing', done => {
            const cardId = new mongoose.Types.ObjectId();
            const card = new Card({
                _id: cardId,
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            });

            card.save().then(savedCard => {
                const cardWithMissingProjectId = {
                    id: cardId,
                    name: 'example'
                }

                chai.request(api)
                    .put('/api/cards/' + savedCard._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(cardWithMissingProjectId)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('project');
                        done();
                    });
            });
        });

        it('should PUT and update a card when required data is supplied', done => {
            const cardId = new mongoose.Types.ObjectId();
            const projectId = new mongoose.Types.ObjectId();
            const card = new Card({
                _id: cardId,
                name: 'example',
                project: projectId,
                tasks: []
            });

            card.save().then(savedCard => {
                const cardWithFullInfo = {
                    id: cardId,
                    name: 'New Name',
                    project: projectId
                }

                chai.request(api)
                    .put('/api/cards/' + savedCard._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(cardWithFullInfo)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Card updated successfully');
                        res.body.should.have.property('card_data').which.is.an('object');
                        res.body.card_data.should.have.property('id').eql(savedCard._id.toString());
                        res.body.card_data.should.have.property('name').eql(cardWithFullInfo.name);
                        res.body.card_data.should.have.property('project').eql(cardWithFullInfo.project.toString());
                        res.body.card_data.should.have.property('tasks').which.is.an('array');
                        done();
                    });
            });
        });
    });

    describe('DELETE /cards/:id', () => {
        it('should DELETE a card when ID is valid', done => {
            const projectId = new mongoose.Types.ObjectId();
            const cardId = new mongoose.Types.ObjectId();
            const card = new Card({
                _id: cardId,
                name: 'example',
                project: projectId,
                tasks: []
            });

            const project = new Project({
                _id: projectId,
                name: 'Example',
                user: new mongoose.Types.ObjectId(),
                cards: [cardId]
            });

            project.save().then(savedProject => {
                card.save().then(savedCard => {
                    chai.request(api)
                        .del('/api/cards/' + savedCard._id)
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
            const projectId = new mongoose.Types.ObjectId();
            const cardId = new mongoose.Types.ObjectId();
            const card = new Card({
                _id: cardId,
                name: 'example',
                project: projectId,
                tasks: []
            });

            const project = new Project({
                _id: projectId,
                name: 'Example',
                user: new mongoose.Types.ObjectId(),
                cards: [cardId]
            });

            project.save().then(savedProject => {
                card.save().then(savedCard => {
                    chai.request(api)
                        .del('/api/cards/' + new mongoose.Types.ObjectId())
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').eql('Card not deleted');
                            done();
                        });
                });
            });
        });

        it('should not DELETE a card when project update fails', done => {
            const card = new Card({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                        .del('/api/cards/' + savedCard._id)
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').eql('Card not deleted, project update failed');
                            done();
                        });
            });
        });
    });

    describe('GET /cards/:id/tasks', () => {
        it('should GET an array of card tasks when ID is valid', done => {
            const card = new Card({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + savedCard._id + '/tasks')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('tasks').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return error when ID is invalid', done => {
            const card = new Card({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + new mongoose.Types.ObjectId() + '/tasks')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Card not found');
                        done();
                    });
            });
        });
    });

    describe('PUT /cards/:id/tasks', () => {
        it('should PUT and update card tasks when ID is valid', done => {
            const cardId = new mongoose.Types.ObjectId();
            const card = new Card({
                _id: cardId,
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: ['task1']
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .put('/api/cards/' + savedCard._id + '/tasks')
                    .set('Authorization', 'Bearer ' + token)
                    .send({tasks: 'task1,task2,task3'})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Card updated successfully');
                        res.body.should.have.property('card_data').which.is.an('array');
                        res.body.card_data.should.be.eql(['task1', 'task2', 'task3']);
                        done();
                    });
            });
        });

        it('should return error when ID is invalid', done => {
            const card = new Card({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                project: new mongoose.Types.ObjectId(),
                tasks: ['task1']
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .put('/api/cards/' + new mongoose.Types.ObjectId() + '/tasks')
                    .set('Authorization', 'Bearer ' + token)
                    .send({tasks: 'task1,task2,task3'})
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Card not found');
                        done();
                    });
            });
        });
    });
});