import React from 'react';
import { Modal, ModalHeader, ModalBody} from 'reactstrap';

import EditTaskForm from './EditTaskForm';
import MoveTaskForm from './MoveTaskForm';

const UPDATE_TASK = 0;
const REMOVE_TASK = 1;
const MOVE_TASK = 2;

class TaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            isMove: false
        }
    }

    handleEditButtonClick = () => {
        this.setState({isEdit: !this.state.isEdit});
    }

    handleMoveButtonClick = () => {
        this.setState({isMove: !this.state.isMove});
    }

    handleDeleteButtonClick = () => {
        const taskId = this.props.modalData.id;
        const cardId = this.props.modalData.card;
        this.props.submit[REMOVE_TASK](taskId, cardId);
        this.props.toggle();
    }

    renderTaskModalBody = () => {
        if (this.state.isEdit) {
            return <EditTaskForm {...this.props.modalData} 
                                update={this.props.submit[UPDATE_TASK]} 
                                cancel={this.handleEditButtonClick}
                                toggle={this.props.toggle}/>;
        }
        
        if (this.state.isMove) {
            return <MoveTaskForm {...this.props.modalData}
                                move={this.props.submit[MOVE_TASK]}
                                update={this.props.submit[UPDATE_TASK]}
                                cancel={this.handleMoveButtonClick}
                                toggle={this.props.toggle}/>;
        }
        
        return this.renderTaskData();
    }

    renderTaskData = () => {
        return (
            <ModalBody>
                <div className={'alert ' + this.determineTaskLabelStyle()} role="alert">
                    <h5 className="label-name">{this.props.modalData.label}</h5>
                </div>
                <div className="alert alert-border-only" role="alert">
                    <h5>Description</h5>
                    <p>{this.props.modalData.description}</p>
                </div>
                <div className="alert alert-border-only" role="alert">
                    <h5>Dependencies</h5>
                    {this.renderTaskDependenciesAsListItems()}
                </div>
                 <div className="float-right">
                    <button type="button" className="btn btn-primary mx-1" onClick={this.handleEditButtonClick}><i className="fas fa-pencil-alt"></i> Edit</button>
                    <button type="button" className="btn btn-primary mx-1" onClick={this.handleMoveButtonClick}><i className="fas fa-arrow-right"></i> Move</button>
                    <button type="button" className="btn btn-primary mx-1" onClick={this.handleDeleteButtonClick}><i className="far fa-trash-alt"></i> Delete</button>
                </div>
            </ModalBody>
        );
    }

    determineTaskLabelStyle = () => {
        if (this.props.modalData.label === undefined || this.props.modalData.label === 'Default') {
            return 'label-default';
        }
        else {
            return `label-${this.props.modalData.label.toLowerCase()}`
        }
    }

    renderTaskDependenciesAsListItems = () => {
        return (
            <ul>
                {this.props.modalData.dependencies.map(dep => {
                    return <li key={dep.id}>{dep.name}</li>
                })}
            </ul>
        );
    }

    render() {
        return (
            <Modal isOpen={this.props.shouldRender} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>{this.props.modalData.name}</ModalHeader>
                {this.renderTaskModalBody()}
            </Modal>
        );
    }
}

export default TaskModal