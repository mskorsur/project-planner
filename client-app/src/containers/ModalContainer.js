import React from 'react';
import { connect } from 'react-redux';
import { deactivateModal } from '../redux/actions/uiActions';

import TaskModal from '../components/TaskModal';
import NewProjectModal from '../components/NewProjectModal';

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
            default: return;
        }
    }
    
    renderTaskModal = () => {
        return <TaskModal {...this.props.currentModal} toggle={this.props.deactivateModal}/>;
    }

    renderNewProjectModal = () => {
        return <NewProjectModal {...this.props.currentModal} toggle={this.props.deactivateModal}/>;
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