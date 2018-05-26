import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { addTask, removeTask, updateTask, moveTask } from '../redux/actions/taskActions';
import { activateModal } from '../redux/actions/uiActions';

import Task from '../components/Task';
import ModalContainer from './ModalContainer';

const mapStateToProps = (state, ownProps) => {
    return {
        tasks: selectCurrentCardTasks(state.tasks.byId, ownProps.card.tasks),
        moveTaskCards: selectCurrentProjectCards(state.cards.byId, state.currentProject)
    }
}

const selectCurrentCardTasks = (stateTasks, cardTasks) => {
    return cardTasks.map(task => {
        return stateTasks[task];
    });
}

const selectCurrentProjectCards = (cards, currentProjectId) => {
    let projectCards = [];
    for (let currentCard in cards) {
        if (cards.hasOwnProperty(currentCard) && cards[currentCard].project === currentProjectId) {
            projectCards.push({
                id: cards[currentCard].id,
                name: cards[currentCard].name
            });
        }
    }

    return projectCards;
}

const mapDispatchToProps = dispatch => {
    return {
        activateModal: (data) => {dispatch(activateModal(data))},
        addTask: (data) => {dispatch(addTask(data))},
        updateTask: (id, data) => {dispatch(updateTask(id, data))},
        moveTask: (taskId, srcCardId, destCardId) => {dispatch(moveTask(taskId, srcCardId, destCardId))},
        removeTask: (taskId, cardId) => {dispatch(removeTask(taskId, cardId))}
    }
}

class TaskContainer extends React.Component {
    handleTaskItemClick = (item) => {
        const clickedTaskId = item.target.getAttribute('task-id');
        const task = this.props.tasks.find(task => task.id === clickedTaskId);
        task.dependencies = this.mapTaskDependencyIds(task.dependencies);
        task.allTasks = this.mapAllTaskIds(this.props.tasks);
        task.moveTaskCards = this.props.moveTaskCards;

        const taskModal = {
            modalType: 'Task Modal',
            modalData: task,
            submit: [this.props.updateTask, this.props.removeTask, this.props.moveTask]
        }
        this.props.activateModal(taskModal);
    }

    mapTaskDependencyIds = (dependencyIds) => {
        return dependencyIds.map(dep => {
            return {
                id: dep,
                name: this.props.tasks.find(task => task.id === dep).name
            }
        });
    }

    mapAllTaskIds = (tasks) => {
        return tasks.map(task => {
            return {
                id: task.id,
                name: task.name
            }
        });
    }

    handleAddTaskButtonClick = () => {
        let newTask = {
            name: 'New Task',
            description: '',
            label: 'Default',
            card: this.props.card.id
        };

        this.props.addTask(newTask);
    }

    renderTaskItems = () => {
        return this.props.tasks.map(task => {
            return (
                <div key={task.id} onClick={this.handleTaskItemClick}>
                    <Task task={task}/>
                </div>
            );
        });
    }

    render() {
        return (
            <Fragment>
                <div className="card-body">
                {this.renderTaskItems()}
                </div>
                <div className="card-footer">
                    <button type="button" className="btn btn-link float-right" onClick={this.handleAddTaskButtonClick}>
                        <i className="fas fa-plus"></i> Add task
                    </button>
                </div>
                <ModalContainer />
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskContainer)