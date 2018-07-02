process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const User = require('../models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const api = require('../bin/www');
const should = chai.should();
chai.use(chaiHttp);

describe('User API endpoint', () => {
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
        User.remove({}, (err) => { 
           done();         
        });     
    });

    describe('GET /users', () => {
        it('should GET 0 users when collection is empty', done => {
            chai.request(api)
            .get('/api/users')
            .set('Authorization', 'Bearer ' + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.length.should.be.eql(0);
                done();
            });
        });

        it('should GET 5 users when collection has 5 users', done => {
            let users = [];
            for (let i = 0; i < 5; i++) {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    userName: 'example',
                    password: 'example',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com'
                });
                users.push(user);
            }
            User.create(users, (err, savedUsers) => {
                chai.request(api)
                .get('/api/users')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.length.should.be.eql(5);
                    done();
                });
            });
        });
    });

    describe('POST /users', () => {
        it('should not POST a user when username is missing', done => {
            const user = {
                id: 'id',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            }

            chai.request(api)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('userName');
                    done();
                });
        });
        
        it('should not POST a user when password is missing', done => {
            const user = {
                id: 'id',
                userName: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            }

            chai.request(api)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('password');
                    done();
                });
        });

        it('should not POST a user when email is missing', done => {
            const user = {
                id: 'id',
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
            }

            chai.request(api)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('email');
                    done();
                });
        });

        it('should not POST a user when first name is missing', done => {
            const user = {
                id: 'id',
                userName: 'example',
                password: 'example',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            }

            chai.request(api)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('firstName');
                    done();
                });
        });

        it('should not POST a user when last name is missing', done => {
            const user = {
                id: 'id',
                userName: 'example',
                password: 'example',
                firstName: 'John',
                email: 'john.doe@example.com'
            }

            chai.request(api)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('Error occurred');
                    res.body.should.have.property('error').which.is.an('array');
                    res.body.error[0].should.be.an('object');
                    res.body.error[0].should.have.property('location').eql('body');
                    res.body.error[0].should.have.property('param').eql('lastName');
                    done();
                });
        });

        it('should not POST a user when username is taken', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {
                const userWithSameUsername = {
                    userName: 'example',
                    password: 'example',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com'
                }
    
                chai.request(api)
                    .post('/api/users')
                    .send(userWithSameUsername)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Username already exists');
                        done();
                    });
            });
        });

        it('should POST and create a user when required data is supplied', done => {
            const user = {
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            }

            chai.request(api)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('message').eql('User created successfully');
                    res.body.should.have.property('user_data').which.is.an('object');
                    res.body.user_data.should.have.property('id');
                    res.body.user_data.should.have.property('userName');
                    res.body.user_data.should.have.property('email');
                    res.body.user_data.should.have.property('firstName');
                    res.body.user_data.should.have.property('lastName');
                    res.body.user_data.should.have.property('organization');
                    res.body.user_data.should.have.property('github');
                    res.body.user_data.should.have.property('projects').which.is.an('array');
                    done();
                });
        });
    });

    describe('GET /users/:id', () => {
        it('should GET a user when ID is valid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                organization: 'FESB',
                github: 'http://github.com/mskorsur'
            });

            user.save().then(savedUser => {
                chai.request(api)
                    .get('/api/users/' + savedUser._id)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('id').eql(savedUser._id.toString());
                        res.body.should.have.property('userName').eql(savedUser.userName);
                        res.body.should.not.have.property('password');
                        res.body.should.have.property('firstName').eql(savedUser.firstName);
                        res.body.should.have.property('lastName').eql(savedUser.lastName);
                        res.body.should.have.property('email').eql(savedUser.email);
                        res.body.should.have.property('organization').eql(savedUser.organization);
                        res.body.should.have.property('github').eql(savedUser.github);
                        res.body.should.have.property('projects').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return null when ID is invalid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                organization: 'FESB',
                github: 'http://github.com/mskorsur'
            });

            user.save().then(savedUser => {
                chai.request(api)
                    .get('/api/users/' + new mongoose.Types.ObjectId())
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.have.property('body').eql(null);
                        done();
                    });
            });
        });
    });

    describe('PUT /users/:id', () => {
        it('should not PUT a user when firstName is missing', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {
                const userWithMissingFirstName = {
                    id: 'id',
                    lastName: 'Doe',
                    email: 'john.doe@example.com'
                }
    
                chai.request(api)
                    .put('/api/users/' + savedUser._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(userWithMissingFirstName)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('firstName');
                        done();
                    });
            });
        });

        it('should not PUT a user when lastName is missing', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {
                const userWithMissingLastName = {
                    id: 'id',
                    firstName: 'John',
                    email: 'john.doe@example.com'
                }
    
                chai.request(api)
                    .put('/api/users/' + savedUser._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(userWithMissingLastName)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('lastName');
                        done();
                    });
            });
        });

        it('should not PUT a user when email is missing', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {
                const userWithMissingEmail = {
                    id: 'id',
                    firstName: 'John',
                    lastName: 'Doe',
                }
    
                chai.request(api)
                    .put('/api/users/' + savedUser._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(userWithMissingEmail)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Error occurred');
                        res.body.should.have.property('error').which.is.an('array');
                        res.body.error[0].should.be.an('object');
                        res.body.error[0].should.have.property('location').eql('body');
                        res.body.error[0].should.have.property('param').eql('email');
                        done();
                    });
            });
        });

        it('should PUT and update a user when required data is supplied', done => {
            const userId = new mongoose.Types.ObjectId();
            const user = new User({
                _id: userId,
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {
                const userWithFullInfo = {
                    id: userId,
                    firstName: 'John',
                    lastName: 'Johnny',
                    email: 'john.doe@gmail.com',
                    organization: 'FESB',
                    github: 'http://...'
                }
    
                chai.request(api)
                    .put('/api/users/' + savedUser._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(userWithFullInfo)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('User updated successfully');
                        res.body.should.have.property('user_data').which.is.an('object');
                        res.body.user_data.should.have.property('id').eql(savedUser._id.toString());
                        res.body.user_data.should.have.property('userName').eql(savedUser.userName);
                        res.body.user_data.should.not.have.property('password');
                        res.body.user_data.should.have.property('email').eql(userWithFullInfo.email);
                        res.body.user_data.should.have.property('firstName').eql(userWithFullInfo.firstName);
                        res.body.user_data.should.have.property('lastName').eql(userWithFullInfo.lastName);
                        res.body.user_data.should.have.property('organization').eql(userWithFullInfo.organization);
                        res.body.user_data.should.have.property('github');
                        res.body.user_data.should.have.property('projects').which.is.an('array');
                        done();
                    });
            });
        });

        it('should update only password when flag is set and passwords are correct', done => {
            const userId = new mongoose.Types.ObjectId();
            const user = new User({
                _id: userId,
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });
            user.password = user.generateHash(user.password);

            user.save().then(savedUser => {
                const userWithFullInfo = {
                    id: userId,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    currentPassword: 'example',
                    newPassword: 'marin',
                    repeatNewPassword: 'marin'
                }
    
                chai.request(api)
                    .put('/api/users/' + savedUser._id + '?password=true')
                    .set('Authorization', 'Bearer ' + token)
                    .send(userWithFullInfo)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('User updated successfully');
                        done();
                    });
            });
        });

        it('should not update password when passwords do not match', done => {
            const userId = new mongoose.Types.ObjectId();
            const user = new User({
                _id: userId,
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });
            user.password = user.generateHash(user.password);

            user.save().then(savedUser => {
                const userWithFullInfo = {
                    id: userId,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    currentPassword: 'example',
                    newPassword: 'marin',
                    repeatNewPassword: 'marin123'
                }
    
                chai.request(api)
                    .put('/api/users/' + savedUser._id + '?password=true')
                    .set('Authorization', 'Bearer ' + token)
                    .send(userWithFullInfo)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Password error');
                        done();
                    });
            });
        });

        it('should not update password when current password is wrong', done => {
            const userId = new mongoose.Types.ObjectId();
            const user = new User({
                _id: userId,
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });
            user.password = user.generateHash(user.password);

            user.save().then(savedUser => {
                const userWithFullInfo = {
                    id: userId,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    currentPassword: 'wrong',
                    newPassword: 'marin',
                    repeatNewPassword: 'marin'
                }
    
                chai.request(api)
                    .put('/api/users/' + savedUser._id + '?password=true')
                    .set('Authorization', 'Bearer ' + token)
                    .send(userWithFullInfo)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('Password error');
                        done();
                    });
            });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should DELETE a user when ID is valid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            });

            user.save().then(savedUser => {    
                chai.request(api)
                    .del('/api/users/' + savedUser._id)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(204);
                        res.should.have.property('body').which.is.empty;
                        done();
                    });
            });
        });

        it('should return error when ID is invalid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            });

            user.save().then(savedUser => {    
                chai.request(api)
                    .del('/api/users/' + new mongoose.Types.ObjectId())
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('User not deleted');
                        done();
                    });
            });
        });
    });

    describe('GET /users/:id/projects', () => {
        it('should GET an array of user projects when ID is valid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {    
                chai.request(api)
                    .get('/api/users/' + savedUser._id + '/projects')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('projects').which.is.an('array');
                        done();
                    });
            });
        });

        it('should return error when ID is invalid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {    
                chai.request(api)
                    .get('/api/users/' + new mongoose.Types.ObjectId() + '/projects')
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('User not found');
                        done();
                    });
            });
        });
    });

    describe('PUT /users/:id/projects', () => {
        it('should PUT and update user projects when ID is valid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                projects: []
            });

            user.save().then(savedUser => {
                chai.request(api)
                    .put('/api/users/' + savedUser._id + '/projects')
                    .set('Authorization', 'Bearer ' + token)
                    .send({projects: 'project1,project2'})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('User updated successfully');
                        res.body.should.have.property('user_data').which.is.an('array');
                        res.body.user_data.should.be.eql(['project1', 'project2']);
                        done();
                    });
            });
        });

        it('should return error when ID is invalid', done => {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: 'example',
                password: 'example',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com'
            });

            user.save().then(savedUser => {  
                chai.request(api)
                    .put('/api/users/' + new mongoose.Types.ObjectId() + '/projects')
                    .set('Authorization', 'Bearer ' + token)
                    .send({projects: 'projects,project2'})
                    .end((err, res) => {
                        res.should.have.status(409);
                        res.body.should.be.an('object');
                        res.body.should.have.property('message').eql('User not found');
                        done();
                    });
            });
        });
    });
});