import React from 'react';
import { ModalBody } from 'reactstrap';

class MoveTaskForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sourceCardId: this.props.card,
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
        this.props.update(this.props.id, {card: this.state.destinationCardId});
        this.props.move(this.props.id, this.state.sourceCardId, this.state.destinationCardId);
    }

    renderCurrentCard = () => {
        return this.props.moveTaskCards.map(card => {
            if (card.id === this.props.card) {
                return <option key={card.id} value={card.id}>{card.name}</option>;
            }
        });
    }

    renderOtherCardsAsOptions = () => {
        return this.props.moveTaskCards.map(card => {
            if (card.id !== this.props.card) {
                return <option key={card.id} value={card.id}>{card.name}</option>;
            }
        });
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
                        <button type="submit" className="btn btn-primary mx-1"><i className="fas fa-check"></i> Submit</button>
                        <button type="button" className="btn btn-outline-primary mx-1" onClick={this.handleCancelButtonClick}>Cancel</button>
                    </div>
                </form>
            </ModalBody>
        );
    }
}

export default MoveTaskForm