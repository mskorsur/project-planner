import React from 'react';
import { ModalBody } from 'reactstrap';

class EditTaskForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name,
            description: this.props.description,
            label: this.props.label,
            dependencies: this.props.dependencies,
            card: this.props.card,
            allTasks: this.props.allTasks
        }
    }

    handleNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    handleLabelChange = (event) => {
        this.setState({label: event.target.value});
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
            name: this.state.allTasks.find(task => task.id === taskId).name
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
        const updatedTaskData = {...this.state};

        delete updatedTaskData.allTasks;
        updatedTaskData.dependencies = updatedTaskData.dependencies.map(dep => dep.id);

        this.props.toggle();
        this.props.update(this.props.id, updatedTaskData);
    }

    renderCardTasksAsCheckboxes = () => {
        return this.state.allTasks.filter(task => task.id !== this.props.id).map(task => {
            return (
                <div key={task.id} className="form-group form-check">
                    <input className="form-check-input" type="checkbox" 
                    value={task.id} id={task.id} checked={this.shouldBeChecked(task.id)} onChange={this.handleDependencyChange}/>
                    <label className="form-check-label" htmlFor={task.id}>
                       {task.name}
                    </label>
                </div>
            );
        });
    }

    shouldBeChecked = (taskId) => {
        const existingTask = this.state.dependencies.find(dep => dep.id === taskId);
        if (existingTask !== undefined) {
            return true;
        }
        else {
            return false;
        }
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
                            <option value="Default">Default</option>
                            <option value="Code">Code</option>
                            <option value="Design">Design</option>
                            <option value="Problem">Problem</option>
                            <option value="Info">Info</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-description">Description</label>
                        <textarea className="form-control" id="task-description" required placeholder="Enter description here"
                        value={this.state.description} onChange={this.handleDescriptionChange} />
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