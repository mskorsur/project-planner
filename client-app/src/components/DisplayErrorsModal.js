import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class DisplayErrorsModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.shouldRender} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Error occurred</ModalHeader>
                <ModalBody>
                    <div className="text-center text-danger">
                        <i className="fas fa-exclamation-triangle fa-3x"></i>
                    </div>
                    <div className="mt-3 alert alert-danger text-center" role="alert">
                        <p className="h5">{this.props.modalData}</p>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

export default DisplayErrorsModal