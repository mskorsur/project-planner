import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setCurrentProject } from '../redux/actions/currentSelectionActions';
import { removeProject } from '../redux/actions/projectActions';
import { activateModal } from '../redux/actions/uiActions';

import CardContainer from './CardContainer';

const mapStateToProps = (state, ownProps) => {
    return {
        currentProject: state.projects.byId[ownProps.match.params.projectId],
        currentUser: state.currentUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentProject: (project) => {dispatch(setCurrentProject(project))},
        removeProject: (projectId, userId) => {dispatch(removeProject(projectId, userId))},
        activateModal: (data) => {dispatch(activateModal(data))}
    }
}

class ProjectContainer extends React.Component {
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

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-5">
                        <h2 className="heading-weight heading-color">{this.props.currentProject.name}</h2>
                    </div>
                    <div className="col-3">
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