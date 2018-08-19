import React, { Fragment } from 'react';

class ProjectName extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditable: false,
            name: this.props.project.name || '',
        }
    }

    handleNameChange = (event) => {
        this.setState({name: event.target.value});
    }
    
    handleNameSubmit = (event) => {
        event.preventDefault();

        const projectData = Object.assign({}, this.props.project, 
            {name: this.state.name, lastModified: Date.now().toString()}
        );
        delete projectData.cards;
        
        this.props.changeName(projectData.id, projectData);
        this.setState({isEditable: !this.state.isEditable});
    }

    handleEditClick = () => {
        this.setState({isEditable: !this.state.isEditable});
    }

    renderName = () => {
        return this.state.isEditable
        ? (
            <form className="form-inline" onSubmit={this.handleNameSubmit}>
                <label className="sr-only" htmlFor="project-name">Project name</label>
                <input type="text" className="form-control mb-1 mr-sm-2" id="project-name" 
                value={this.state.name} onChange={this.handleNameChange}/>
                <span className="text-muted" onClick={this.handleEditClick}>
                    <i className="fas fa-pencil-alt"></i>
                </span>
            </form>
        )
        : (
            <h2 className="heading-weight heading-color">
                {this.state.name}
                <span className="ml-2 text-muted" onClick={this.handleEditClick}>
                    <i className="fas fa-xs fa-pencil-alt"></i>
                </span>
            </h2>
        )
    }

    render() {
        return (
            <div className="col-4">
                {this.renderName()}
            </div>
        );
    }
}

export default ProjectName