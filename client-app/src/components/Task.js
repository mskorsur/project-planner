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

    render() {
        return (
            <div className={'task text-center my-3 ' + this.determineTaskBorderStyle()}>
                <h5 className="p-3 font-weight-light" task-id={this.props.task.id}>{this.props.task.name}</h5>
            </div>
        );
    }
}

export default Task