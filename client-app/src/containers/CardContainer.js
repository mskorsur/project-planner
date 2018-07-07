import React from 'react';
import { connect } from 'react-redux';
import { addCardRequest, updateCardRequest, removeCardRequest } from '../redux/actions/cardActions';

import CardDeck from '../components/CardDeck';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

const CARDS_PER_DECK = 4;

const mapStateToProps = (state, ownProps) => {
    return {
        cards: selectCurrentProjectCards(state.cards.byId, ownProps.currentProject.cards),
        isFetching: state.cards.isFetching
    }
}

const selectCurrentProjectCards = (stateCards, currentProjectCardIds) => {
    return currentProjectCardIds.map(card => {
        return stateCards[card];
    });
}

const mapDispatchToProps = dispatch => {
    return {
        addCard: (data) => {dispatch(addCardRequest(data))},
        updateCard: (id, data) => {dispatch(updateCardRequest(id, data))},
        removeCard: (cardId, projectId) => {dispatch(removeCardRequest(cardId, projectId))}
    }
}

class CardContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardName: ''
        }
    }

    handleCardNameChange = (event) => {
        this.setState({cardName: event.target.value});
    }

    handleAddCardButtonClick = () => {
        const newCard = {
            project: this.props.currentProject.id,
            name: this.state.cardName
        }
        this.props.addCard(newCard);
    }

    handleCardNameSubmit = (event) => {
        event.preventDefault();
    }

    renderCardContainerBody = () => {
        return this.props.isFetching
        ? <Spinner />
        : (
            <div>
                <div className="row mt-4">
                    <div className="col">
                        <form className="form-inline" onSubmit={this.handleCardNameSubmit}>
                            <label className="sr-only" htmlFor="card-name">Card name</label>
                            <input type="text" className="form-control mb-1 mr-sm-2" id="card-name" 
                            value={this.state.cardName} onChange={this.handleCardNameChange} placeholder="Enter card name" />
                            <button type="button" className="btn btn-outline-primary mb-1" onClick={this.handleAddCardButtonClick}><i className="fas fa-plus"></i> New Card</button>
                        </form>
                    </div>
                </div>
                {this.renderCardDecks()}
            </div>
        )
    }

    renderCardDecks = () => {
        const numberOfDecks = this.determineNumberOfCardDecks();
        let decks = [];

        for (let deckIndex = 0; deckIndex < numberOfDecks; deckIndex++) {
            const cardStartIndex = deckIndex * CARDS_PER_DECK;
            const cardEndIndex = cardStartIndex + CARDS_PER_DECK;
            const cards = this.props.cards.slice(cardStartIndex, cardEndIndex);

            console.log('prop cards', this.props.cards);
            let cardsToRender = cards.map(card => {
                return <Card key={card.id} card={card} edit={this.props.updateCard} remove={this.props.removeCard}/>
            });

            decks.push(<CardDeck key={deckIndex} cards={cardsToRender}/>);
        }

        return decks;
    }

    determineNumberOfCardDecks = () => {
        const numberOfCards = this.props.cards.length;
        return Math.ceil(numberOfCards / CARDS_PER_DECK);
    }

    render() {
        return (
           this.renderCardContainerBody()
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardContainer)