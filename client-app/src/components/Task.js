import React from 'react';

class Task extends React.Component {
    determineTaskBorderStyle = () => {
        if (this.props.task.label === undefined || this.props.task.label === 'Default') {
            return 'task-default';
        }
        else {
            return `task-${this.props.task.label.toLowerCase()}`
        }
    }

    isTaskDue = () => {
        const todayDate = new Date();
        const taskDate = new Date(this.props.task.dueDate);
        const isTaskDueToday = todayDate.toDateString() === taskDate.toDateString();

        return isTaskDueToday
        ? (
            <span className="text-warning ml-2">
                <i className="fas fa-exclamation-triangle"></i>
            </span>
          )
        : '' ;
    }

    render() {
        return (
            <div className={'task text-center my-3 ' + this.determineTaskBorderStyle()}>
                <h5 className="p-3 font-weight-light" task-id={this.props.task.id}>
                    {this.props.task.name} {this.isTaskDue()}
                </h5>
            </div>
        );
    }
}

export default Task