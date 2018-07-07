import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setCurrentProject } from '../redux/actions/currentSelectionActions';
import { updateProjectRequest, removeProjectRequest } from '../redux/actions/projectActions';
import { fetchProjectCards } from '../redux/actions/cardActions';
import { activateModal } from '../redux/actions/uiActions';

import CardContainer from './CardContainer';
import ProjectStatusSelect from '../components/ProjectStatusSelect';

const mapStateToProps = (state, ownProps) => {
    return {
        currentProject: state.projects.byId[ownProps.match.params.projectId],
        currentUser: state.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentProject: (projectId) => {dispatch(setCurrentProject(projectId))},
        fetchCards: (projectId) => {dispatch(fetchProjectCards(projectId))},
        updateProject: (projectId, data) => {dispatch(updateProjectRequest(projectId, data))},
        removeProject: (projectId, userId) => {dispatch(removeProjectRequest(projectId, userId))},
        activateModal: (data) => {dispatch(activateModal(data))}
    }
}

class ProjectContainer extends React.Component {
    componentWillMount() {
        this.props.fetchCards(this.props.match.params.projectId);
    }
    
    componentDidMount() {
        this.props.setCurrentProject(this.props.match.params.projectId);
    }

    handleDeleteButtonClick = () => {
        const deleteProjectModal = {
            modalType: 'Delete Project Modal',
            modalData: {name: this.props.currentProject.name},
            submit: this.handleDeleteProjectSubmit
        }

        this.props.activateModal(deleteProjectModal);
    }

    handleDeleteProjectSubmit = () => {
        this.props.removeProject(this.props.currentProject.id, this.props.currentUser);
        this.props.history.push('/project/all');
    }

    handleStatusUpdate = (status) => {
        const projectData = Object.assign({}, this.props.currentProject, 
            {status, lastModified: Date.now().toString()}
        );
        delete projectData.cards;
        this.props.updateProject(projectData.id, projectData);
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-5">
                        <h2 className="heading-weight heading-color">{this.props.currentProject.name}</h2>
                    </div>
                    <div className="col-4 ml-2">
                        <ProjectStatusSelect currentStatus={this.props.currentProject.status}
                                            changeStatus={this.handleStatusUpdate}/>
                        <button type="button" className="btn btn-primary mx-1 my-1"><i className="far fa-save"></i> Save</button>
                        <button type="button" className="btn btn-primary mx-1 my-1" onClick={this.handleDeleteButtonClick}>
                            <i className="far fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </div>
                <CardContainer currentProject={this.props.currentProject}/>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer)