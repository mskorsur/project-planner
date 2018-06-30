import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

class DisplaySuccessModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.shouldRender} toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Success</ModalHeader>
                <ModalBody>
                    <div className="text-center text-success">
                        <i className="fas fa-check-circle fa-3x"></i>
                    </div>
                    <div className="mt-3 alert alert-success text-center" role="alert">
                        <p className="h5">{this.props.modalData}</p>
                    </div>
                </ModalBody>
            </Modal>
        );
    }
}

export default DisplaySuccessModal