process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const Card = require('../models/card');
const Project = require('../models/project');

const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../bin/www');
const should = chai.should();
chai.use(chaiHttp);

describe('Card API endpoint', () => {
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
                    _id: i.toString(),
                    name: 'example',
                    project: 'exampleID' + i
                });
                cards.push(card);
            }

            Card.create(cards, (err, savedCards) => {
                chai.request(api)
                .get('/api/cards')
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
        it('should not POST a card when ID is missing', done => {
            const card = {
                name: 'example',
                project: 'exampleID'
            }

            chai.request(api)
                .post('/api/cards')
                .send(card)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occured');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('id');
                    done();
                });
        });

        it('should not POST a card when name is missing', done => {
            const card = {
                id: 'id',
                project: 'exampleID'
            }

            chai.request(api)
                .post('/api/cards')
                .send(card)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occured');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('name');
                    done();
                });
        });

        it('should not POST a card when projectID is missing', done => {
            const card = {
                id: 'id',
                name: 'example'
            }

            chai.request(api)
                .post('/api/cards')
                .send(card)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occured');
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
                project: 'exampleID'
            }

            chai.request(api)
                .post('/api/cards')
                .send(card)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Card not created, project update failed');
                    done();
                });
        });

        it('should POST and create a card when required data is supplied and project exists', done => {
            const card = {
                id: 'id',
                name: 'example',
                project: 'projectID'
            }

            const project = new Project({
                _id: 'projectID',
                name: 'example',
                user: 'exampleID',
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                .post('/api/cards')
                .send(card)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Card created successfully');
                    res.body.should.have.property('card_data').which.is.an('object');
                    res.body.card_data.should.have.property('_id');
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
                _id: 'id',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + savedCard._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('_id').eql(savedCard._id);
                        res.body.should.have.property('name').eql(savedCard.name);
                        res.body.should.have.property('project').eql(savedCard.project);
                        res.body.should.have.property('tasks').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return null when ID is invalid', done => {
            const card = new Card({
                _id: 'id',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + savedCard._id + '1')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.property('body').eql(null);
                        done();
                    });
            });
        });
    });

    describe('PUT /cards/:id', () => {
        it('should not PUT a card when ID is missing', done => {
            const card = new Card({
                _id: 'id',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                const cardWithMissingId = {
                    name: 'example',
                    project: 'projectId'
                }

                chai.request(api)
                    .put('/api/cards/' + savedCard._id)
                    .send(cardWithMissingId)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occured');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('id');
                        done();
                    });
            });
        });

        it('should not PUT a card when name is missing', done => {
            const card = new Card({
                _id: 'id',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                const cardWithMissingName = {
                    id: 'id',
                    project: 'projectId'
                }

                chai.request(api)
                    .put('/api/cards/' + savedCard._id)
                    .send(cardWithMissingName)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occured');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('name');
                        done();
                    });
            });
        });

        it('should not PUT a card when projectID is missing', done => {
            const card = new Card({
                _id: 'id',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                const cardWithMissingProjectId = {
                    id: 'id',
                    name: 'example'
                }

                chai.request(api)
                    .put('/api/cards/' + savedCard._id)
                    .send(cardWithMissingProjectId)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occured');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('project');
                        done();
                    });
            });
        });

        it('should PUT and update a card when required data is supplied', done => {
            const card = new Card({
                _id: 'id',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                const cardWithFullInfo = {
                    id: 'id',
                    name: 'New Name',
                    project: 'projectId'
                }

                chai.request(api)
                    .put('/api/cards/' + savedCard._id)
                    .send(cardWithFullInfo)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Card updated successfully');
                        res.body.should.have.property('card_data').which.is.an('object');
                        res.body.card_data.should.have.property('_id').eql(savedCard._id);
                        res.body.card_data.should.have.property('name').eql(cardWithFullInfo.name);
                        res.body.card_data.should.have.property('project').eql(cardWithFullInfo.project);
                        res.body.card_data.should.have.property('tasks').which.is.an('array');
                        done();
                    });
            });
        });
    });

    describe('DELETE /cards/:id', () => {
        it('should DELETE a card when ID is valid', done => {
            const card = new Card({
                _id: 'card1',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            const project = new Project({
                _id: 'projectId',
                name: 'Example',
                user: 'userId',
                cards: ['card1']
            });

            project.save().then(savedProject => {
                card.save().then(savedCard => {
                    chai.request(api)
                        .del('/api/cards/' + savedCard._id)
                        .end((err, res) => {
                            res.should.have.status(204);
                            res.should.have.property('body').which.is.empty;
                            done();
                        });
                });
            });
        });

        it('should return error when ID is invalid', done => {
            const card = new Card({
                _id: 'card1',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            const project = new Project({
                _id: 'projectId',
                name: 'Example',
                user: 'userId',
                cards: ['card1']
            });

            project.save().then(savedProject => {
                card.save().then(savedCard => {
                    chai.request(api)
                        .del('/api/cards/' + savedCard._id  + '1')
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
                _id: 'card1',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                        .del('/api/cards/' + savedCard._id)
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
                _id: 'card1',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + savedCard._id + '/tasks')
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
                _id: 'card1',
                name: 'example',
                project: 'projectId',
                tasks: []
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .get('/api/cards/' + savedCard._id + '1' + '/tasks')
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
            const card = new Card({
                _id: 'card1',
                name: 'example',
                project: 'projectId',
                tasks: ['task1']
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .put('/api/cards/' + savedCard._id + '/tasks')
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
                _id: 'card1',
                name: 'example',
                project: 'projectId',
                tasks: ['task1']
            });

            card.save().then(savedCard => {
                chai.request(api)
                    .put('/api/cards/' + savedCard._id + '1' + '/tasks')
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