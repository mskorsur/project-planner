import React from 'react';
import { ModalBody } from 'reactstrap';

const TASK = 0;
const MOVE_CARDS = 2;

class MoveTaskForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sourceCardId: this.props[TASK].card,
            destinationCardId: ''
        }
    }

    handleDestinationCardIdChange = (event) => {
        this.setState({destinationCardId: event.target.value});
    }

    handleCancelButtonClick = () => {
        this.props.cancel();
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.props.toggle();
        this.props.update(this.props[TASK].id, {card: this.state.destinationCardId});
        this.props.move(this.props[TASK].id, this.state.sourceCardId, this.state.destinationCardId);
    }

    renderCurrentCard = () => {
        return this.props[MOVE_CARDS].map(card => {
            if (card.id === this.state.sourceCardId) {
                return <option key={card.id} value={card.id}>{card.name}</option>;
            }
        });
    }

    renderOtherCardsAsOptions = () => {
        return this.props[MOVE_CARDS].map(card => {
            if (card.id !== this.state.sourceCardId) {
                return <option key={card.id} value={card.id}>{card.name}</option>;
            }
        });
    }

    shouldSubmitButtonBeDisabled = () => {
        return (this.state.destinationCardId === '' || this.state.destinationCardId === 'initial')
        ? true
        : false
    }

    render() {
        return (
            <ModalBody>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="task-source-card">From</label>
                        <select className="form-control" id="task-source-card" value={this.state.sourceCardId} disabled>
                            {this.renderCurrentCard()}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="task-destination-card">To</label>
                        <select className="form-control" id="task-destination-card" value={this.state.destinationCardId} onChange={this.handleDestinationCardIdChange}>
                            <option value="initial">Choose a card</option>
                            {this.renderOtherCardsAsOptions()}
                        </select>
                    </div>
                    <div className="float-right">
                        <button type="submit" className="btn btn-primary mx-1" disabled={this.shouldSubmitButtonBeDisabled()}>
                            <i className="fas fa-check"></i> Submit
                        </button>
                        <button type="button" className="btn btn-outline-primary mx-1" onClick={this.handleCancelButtonClick}>Cancel</button>
                    </div>
                </form>
            </ModalBody>
        );
    }
}

export default MoveTaskForm