import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class DeleteProjectModal extends React.Component {
    handleConfirmButtonClick = () => {
        this.props.toggle();
        this.props.submit();
    }

    render() {
        return (
            <Modal isOpen={this.props.shouldRender} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Delete project?</ModalHeader>
                <ModalBody>
                    <h5>Are you sure you want to delete project <strong>{this.props.modalData.name}</strong>?</h5>
                    <div className="float-right">
                        <button type="submit" className="btn btn-primary mx-1"onClick={this.handleConfirmButtonClick}>Confirm</button>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

export default DeleteProjectModal