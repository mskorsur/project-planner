import React, {Fragment} from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { activateModal } from '../redux/actions/uiActions';
import { addProject } from '../redux/actions/projectActions';
import { logout } from '../redux/actions/authActions';

import ModalContainer from '../containers/ModalContainer';
const mapStateToProps = state => {
    return {
        currentProject: state.currentProject,
        currentUser: {
            id: state.currentUser,
            name: state.users.byId[state.currentUser].userName
        },
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        activateModal: (data) => {dispatch(activateModal(data))},
        addProject: (data) => {dispatch(addProject(data))},
        logout: () => {dispatch(logout())}
    }
}

class Navbar extends React.Component {
    handleNewProjectClick = (event) => {
        event.preventDefault();
        const newProjectModal = {
            modalType: 'New Project Modal',
            modalData: {userId: this.props.currentUser.id},
            submit: this.handleNewProjectSubmit
        }

        this.props.activateModal(newProjectModal);
    }

    handleNewProjectSubmit = (projectData) => {
        projectData.history = this.props.history;
        this.props.addProject(projectData);
    }

    handleUserPageButtonClick = () => {
        this.props.history.push('/user');
    }

    handleLogOutButtonClick = () => {
        this.props.logout();
        this.props.history.push('/');
    }

    handleSignInButtonClick = () => {
        this.props.history.push('/sign-in');
    }

    handleLogInButtonClick = () => {
        this.props.history.push('/log-in');
    }

    renderNavigationButtons = () => {
        if (this.props.isAuthenticated) {
            return (
                <Fragment>
                    <li className="nav-item">
                        <a className="nav-link" href="/" onClick={this.handleNewProjectClick}><i className="fas fa-plus"></i> New project</a>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/project/all"><i className="fas fa-list-ul"></i> All projects</Link>
                    </li>
                </Fragment>
            );
        }
    }

    renderAccountButtons = () => {
        if (this.props.isAuthenticated) {
            return (
                <div className="justify-content-end">
                    <button type="button" className="btn btn-outline-warning mr-2" onClick={this.handleUserPageButtonClick}>
                        <i className="fas fa-user"></i> {this.props.currentUser.name}
                    </button>
                    <button type="button" className="btn btn-outline-warning" onClick={this.handleLogOutButtonClick}>
                        <i className="fas fa-sign-out-alt"></i> Log Out
                    </button>
                </div>
            );
        }
        else {
            return (
                <div className="float-right">
                    <button type="button" className="btn btn-outline-warning mr-2" onClick={this.handleSignInButtonClick}>
                        Sign In
                    </button>
                    <button type="button" className="btn btn-outline-warning" onClick={this.handleLogInButtonClick}>
                        <i className="fas fa-sign-in-alt"></i> Log In
                    </button>
                </div>
            );
        }
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-primary">
                <Link className="navbar-brand" to="/">Project Planner</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation-toggle" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navigation-toggle">
                    <ul className="navbar-nav mr-auto">
                        {this.renderNavigationButtons()}
                    </ul>
                    {this.renderAccountButtons()}
                </div>
                <ModalContainer />
            </nav>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Navbar))