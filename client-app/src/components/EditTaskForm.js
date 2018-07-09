import React from 'react';
import { ModalBody } from 'reactstrap';

const TASK = 0;
const ALL_TASKS = 1;

const labelSelectOptions = [
    {value: 'Default'},
    {value: 'Code'},
    {value: 'Design'},
    {value: 'Problem'},
    {value: 'Info'},
    {value: 'Other'}
];

class EditTaskForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props[TASK].name,
            description: this.props[TASK].description,
            label: this.props[TASK].label,
            dueDate: this.props[TASK].dueDate,
            dependencies: this.props[TASK].dependencies,
            card: this.props[TASK].card,
        }
    }

    handleNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    handleLabelChange = (event) => {
        this.setState({label: event.target.value});
    }

    handleDueDateChange = (event) => {
        this.setState({dueDate: event.target.value});
    }

    handleDescriptionChange = (event) => {
        this.setState({description: event.target.value});
    }

    handleDependencyChange = (event) => {
        const taskId = event.target.value;
        const isChecked = event.target.checked;
        let newDependencies = [];
        let task = {
            id: taskId,
            name: this.props[ALL_TASKS].find(task => task.id === taskId).name
        };

        if (isChecked) {
            newDependencies = [...this.state.dependencies, task];
        }
        else {
            newDependencies = this.state.dependencies.filter(dep => dep.id !== taskId);
        }

        this.setState({dependencies: newDependencies});
    }

    handleCancelButtonClick = () => {
        this.props.cancel();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let updatedTaskData = {...this.state};
        updatedTaskData.dueDate = new Date(updatedTaskData.dueDate);
        updatedTaskData.dependencies = updatedTaskData.dependencies.map(dep => dep.id).join(',');

        this.props.toggle();
        this.props.update(this.props[TASK].id, updatedTaskData);
    }

    renderCardTasksAsCheckboxes = () => {
        let cardTasksWithoutCurrentTask = this.props[ALL_TASKS].filter(task => task.id !== this.props[TASK].id);
        return this.renderCheckboxes(cardTasksWithoutCurrentTask);
    }

    renderLabelSelectOptions = () => {
        return labelSelectOptions.map(option => {
            return <option key={option.value} value={option.value}>{option.value}</option>;
        });
    }

    renderCheckboxes = (tasks) => {
        return tasks.map(task => {
            return (
                <div key={task.id} className="form-group form-check">
                    <input className="form-check-input" type="checkbox" 
                    value={task.id} id={task.id} checked={this.isTaskADependency(task.id)} onChange={this.handleDependencyChange}/>
                    <label className="form-check-label" htmlFor={task.id}>
                       {task.name}
                    </label>
                </div>
            );
        });
    }

    isTaskADependency = (taskId) => {
        return this.state.dependencies.find(dep => dep.id === taskId) !== undefined
        ? true
        : false
    }

    render() {
        return (
            <ModalBody>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="task-name">Name</label>
                        <input className="form-control" id="task-name" type="text" required placeholder="Enter name here"
                        value={this.state.name} onChange={this.handleNameChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-label">Label</label>
                        <select className="form-control" id="task-label" value={this.state.label} onChange={this.handleLabelChange}>
                            {this.renderLabelSelectOptions()}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea className="form-control" id="task-description" required placeholder="Enter description here"
                        value={this.state.description} onChange={this.handleDescriptionChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-date">Due date</label>
                        <input className="form-control" id="task-date" type="date" 
                        value={this.state.dueDate} onChange={this.handleDueDateChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-label">Dependencies</label>
                        {this.renderCardTasksAsCheckboxes()}
                    </div>
                    <div className="float-right">
                        <button type="submit" className="btn btn-primary mx-1"><i className="fas fa-check"></i> Submit</button>
                        <button type="button" className="btn btn-outline-primary mx-1" onClick={this.handleCancelButtonClick}>Cancel</button>
                    </div>
                </form>
            </ModalBody>
        );
    }
}

export default EditTaskForm