import React from 'react';
import { connect } from 'react-redux';
import { deactivateModal } from '../redux/actions/uiActions';

import TaskModal from '../components/TaskModal';
import NewProjectModal from '../components/NewProjectModal';
import DeleteProjectModal from '../components/DeleteProjectModal';
import DisplayErrorsModal from '../components/DisplayErrorsModal';
import DisplaySuccessModal from '../components/DisplaySuccessModal';

const mapStateToProps = state => {
    return {
        currentModal: state.ui.currentModal
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deactivateModal: () => {dispatch(deactivateModal())}
    }
}

class ModalContainer extends React.Component {
    state = {
        shouldRender: false
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.shouldRender !== nextProps.currentModal.shouldRender) {
            return {
                shouldRender: nextProps.currentModal.shouldRender
            }
        }

        return null;
    }

    shouldRenderModal = () => {
        if (this.state.shouldRender) {
            return this.renderModalBasedOnType();
        }
    }

    renderModalBasedOnType = () => {
        switch(this.props.currentModal.modalType) {
            case 'Task Modal': return this.renderTaskModal();
            case 'New Project Modal': return this.renderNewProjectModal();
            case 'Delete Project Modal': return this.renderDeleteProjectModal();
            case 'Display Errors Modal': return this.renderDisplayErrorsModal();
            case 'Display Success Modal': return this.renderDisplaySuccessModal();
            default: return;
        }
    }
    
    renderTaskModal = () => {
        return <TaskModal {...this.props.currentModal} toggle={this.props.deactivateModal}/>;
    }

    renderNewProjectModal = () => {
        return <NewProjectModal {...this.props.currentModal} toggle={this.props.deactivateModal}/>;
    }

    renderDeleteProjectModal = () => {
        return <DeleteProjectModal {...this.props.currentModal} toggle={this.props.deactivateModal}/>;
    }

    renderDisplayErrorsModal = () => {
        return <DisplayErrorsModal {...this.props.currentModal} toggle={this.props.deactivateModal}/>;
    }

    renderDisplaySuccessModal = () => {
        return <DisplaySuccessModal {...this.props.currentModal} toggle={this.props.deactivateModal}/>
    }

    render() {
        return (
            <div>
            {this.shouldRenderModal()}
            </div>   
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer)