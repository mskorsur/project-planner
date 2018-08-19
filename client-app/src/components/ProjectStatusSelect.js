import React from 'react';

const statusOptions = [
    {value: 'Active'},
    {value: 'Paused'},
    {value: 'Done'}
]

class ProjectStatusSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: this.props.project.status
        }
    }

    handleStatusChange = (event) => {
        this.setState({status: event.target.value});

        const projectData = Object.assign({}, this.props.project, 
            {status: event.target.value, lastModified: Date.now().toString()}
        );
        delete projectData.cards;

        this.props.changeStatus(projectData.id, projectData);
    }

    renderStatusOptions = () => {
        return statusOptions.map(option => {
            return <option key={option.value} value={option.value}>{option.value}</option>
        });
    }

    render() {
        return (
            <select className="form-control status-select mx-1 my-1" value={this.state.status} onChange={this.handleStatusChange}>
                {this.renderStatusOptions()}
            </select>
        );
    }
}

export default ProjectStatusSelect