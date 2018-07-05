import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class NewProjectModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ''
        }
    }

    handleNameChange = (event) => {
        this.setState({name: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const newProject = {
            name: this.state.name,
            status: 'Active',
            user: this.props.modalData.userId
        }
        console.log(this.props.modalData);
        this.props.toggle();
        this.props.submit(newProject);
    }

    render() {
        return (
            <Modal isOpen={this.props.shouldRender} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Create new project</ModalHeader>
                <ModalBody>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="project-name">Name</label>
                            <input className="form-control" id="project-name" type="text" required placeholder="Enter name here"
                            value={this.state.name} onChange={this.handleNameChange}/>
                        </div>
                        <div className="float-right">
                            <button type="submit" className="btn btn-primary mx-1"><i className="fas fa-check"></i> Create</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        );
    }
}

export default NewProjectModal