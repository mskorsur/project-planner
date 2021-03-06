process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const Project = require('../models/project');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../bin/www');
const should = chai.should();
chai.use(chaiHttp);

describe('Project API endpoint', () => {
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
        Project.remove({}, (err) => { 
           done();         
        });     
    });

    beforeEach((done) => { 
        User.remove({}, (err) => { 
           done();         
        });     
    });

    describe('GET /projects', () => {
        it('should GET 0 projects when collection is empty', done => {
            chai.request(api)
            .get('/api/projects')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });

        it('should GET 3 projects when collection has 3 projects', done => {
            let projects = [];
            for (let i = 0; i < 3; i++) {
                const project = new Project({
                    _id: new mongoose.Types.ObjectId(),
                    name: 'example',
                    user: new mongoose.Types.ObjectId(),
                });
                projects.push(project);
            }
            Project.create(projects, (err, savedProjects) => {
                chai.request(api)
                .get('/api/projects')
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

    describe('POST /projects', () => {
        it('should not POST a project when name is missing', done => {
            const project = {
                id: 'id',
                user: 'exampleID'
            }

            chai.request(api)
                .post('/api/projects')
                .set('Authorization', 'Bearer ' + token)
                .send(project)
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

        it('should not POST a project when userID is missing', done => {
            const project = {
                id: 'id',
                name: 'example',
            }

            chai.request(api)
                .post('/api/projects')
                .set('Authorization', 'Bearer ' + token)
                .send(project)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('user');
                    done();
                });
        });

        it('should not create a project when user does not exist', done => {
            const project = {
                id: 'id',
                name: 'example',
                user: new mongoose.Types.ObjectId()
            }

            chai.request(api)
                .post('/api/projects')
                .set('Authorization', 'Bearer ' + token)
                .send(project)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Project not created, user update fail');
                    done();
                });
        });

        it('should POST and create a project when required data is supplied and user exists', done => {
            const userId = new mongoose.Types.ObjectId();
            const project = {
                id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: userId
            }

            const user = new User({
                _id: userId,
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                projects: []
            });

            user.save().then(savedUser => {
                chai.request(api)
                .post('/api/projects')
                .set('Authorization', 'Bearer ' + token)
                .send(project)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Project created successfully');
                    res.body.should.have.property('project_data').which.is.an('object');
                    res.body.project_data.should.have.property('id');
                    res.body.project_data.should.have.property('name');
                    res.body.project_data.should.have.property('user');
                    res.body.project_data.should.have.property('status');
                    res.body.project_data.should.have.property('lastModified');
                    res.body.project_data.should.have.property('cards').which.is.an('array');
                    done();
                });
            });
        });
    });

    describe('GET /projects/:id', done => {
        it('should GET a project when ID is valid', done => {
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                lastModified: Date.now(),
                status: 'Active',
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                    .get('/api/projects/' + savedProject._id)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('id').eql(savedProject._id.toString());
                        res.body.should.have.property('name').eql(savedProject.name);
                        res.body.should.have.property('user').eql(savedProject.user.toString());
                        res.body.should.have.property('lastModified');
                        res.body.should.have.property('status').eql(savedProject.status);
                        res.body.should.have.property('cards').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return null when ID is invalid', done => {
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                lastModified: Date.now(),
                status: 'Active',
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                    .get('/api/projects/' + new mongoose.Types.ObjectId())
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.property('body').eql(null);
                        done();
                    });
            });
        });
    });

    describe('PUT /projects/:id', () => {
        it('should not PUT a project when name is missing', done => {
            const projectId = new mongoose.Types.ObjectId();
            const project = new Project({
                _id: projectId,
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                lastModified: Date.now(),
                status: 'Active',
                cards: []
            });

            project.save().then(savedProject => {
                const projectWithMissingName = {
                    id: projectId,
                    user: 'exampleID'
                }

                chai.request(api)
                    .put('/api/projects/' + savedProject._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(projectWithMissingName)
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

        it('should not PUT a project when userID is missing', done => {
            const projectId = new mongoose.Types.ObjectId();
            const project = new Project({
                _id: projectId,
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                lastModified: Date.now(),
                status: 'Active',
                cards: []
            });

            project.save().then(savedProject => {
                const projectWithMissingUserId = {
                    id: projectId,
                    name: 'example',
                }

                chai.request(api)
                    .put('/api/projects/' + savedProject._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(projectWithMissingUserId)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('user');
                        done();
                    });
            });
        });

        it('should PUT and update a project when required data is supplied', done => {
            const projectId = new mongoose.Types.ObjectId();
            const userId = new mongoose.Types.ObjectId();
            const project = new Project({
                _id: projectId,
                name: 'example',
                user: userId,
                lastModified: Date.now().toString(),
                status: 'Active',
                cards: []
            });

            project.save().then(savedProject => {
                const projectWithFullInfo = {
                    id: projectId,
                    name: 'newName',
                    user: userId,
                    lastModified: Date.now().toString(),
                    status: 'Done'
                }

                chai.request(api)
                    .put('/api/projects/' + savedProject._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(projectWithFullInfo)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Project updated successfully');
                        res.body.should.have.property('project_data').which.is.an('object');
                        res.body.project_data.should.have.property('id').eql(savedProject._id.toString());
                        res.body.project_data.should.have.property('name').eql(projectWithFullInfo.name);
                        res.body.project_data.should.have.property('user').eql(projectWithFullInfo.user.toString());
                        res.body.project_data.should.have.property('status').eql(projectWithFullInfo.status);
                        res.body.project_data.should.have.property('lastModified');
                        res.body.project_data.should.have.property('cards').which.is.an('array');
                        done();
                    });
            });
        });
    });

    describe('DELETE /projects/:id', () => {
        it('should DELETE a project when ID is valid', done => {
            const projectId = new mongoose.Types.ObjectId();
            const userId = new mongoose.Types.ObjectId();
            const user = new User({
                _id: userId,
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                projects: [projectId]
            });

            const project = new Project({
                _id: projectId,
                name: 'example',
                user: userId
            });

            user.save().then(savedUser => {
                project.save().then(savedProject => {
                    chai.request(api)
                        .del('/api/projects/' + savedProject._id)
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
            const userId = new mongoose.Types.ObjectId();
            const projectId = new mongoose.Types.ObjectId();
            const user = new User({
                _id: userId,
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                projects: []
            });

            const project = new Project({
                _id: projectId,
                name: 'example',
                user: userId
            });

            user.save().then(savedUser => {
                project.save().then(savedProject => {
                    chai.request(api)
                        .del('/api/projects/' + new mongoose.Types.ObjectId())
                        .set('Authorization', 'Bearer ' + token)
                        .end((err, res) => {
                            res.should.have.status(409);
                            res.body.should.be.an('object');
                            res.body.should.have.property('message').eql('Project not deleted');
                            done();
                        });
                });
            });
        });

        it('should not DELETE a project when user update fails', done => {
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: new mongoose.Types.ObjectId()
            });

            project.save().then(savedProject => {
                chai.request(api)
                    .del('/api/projects/' + savedProject._id)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Project not deleted, user update failed');
                        done();
                    });
            });
        });
    });

    describe('GET /projects/:id/cards', () => {
        it('should GET an array of project cards when ID is valid', done => {
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                    .get('/api/projects/' + savedProject._id + '/cards')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('cards').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return error when ID is invalid', done => {
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                    .get('/api/projects/' + new mongoose.Types.ObjectId() + '/cards')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Project not found');
                        done();
                    });
            });
        });
    });

    describe('PUT /projects/:id/cards', () => {
        it('should PUT and update project cards when ID is valid', done => {
            const cardId = new mongoose.Types.ObjectId().toString();
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                    .put('/api/projects/' + savedProject._id + '/cards')
                    .set('Authorization', 'Bearer ' + token)
                    .send({cards: cardId})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Project updated successfully');
                        res.body.should.have.property('project_data').which.is.an('array');
                        res.body.project_data.should.be.eql([cardId]);
                        done();
                    });
            });
        });

        it('should return error when ID is invalid', done => {
            const project = new Project({
                _id: new mongoose.Types.ObjectId(),
                name: 'example',
                user: new mongoose.Types.ObjectId(),
                cards: []
            });

            project.save().then(savedProject => {
                chai.request(api)
                    .put('/api/projects/' + new mongoose.Types.ObjectId() + '/cards')
                    .set('Authorization', 'Bearer ' + token)
                    .send({cards: 'card1,card2'})
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Project not found');
                        done();
                    });
            });
        });
    });
});