import React from 'react';
import { connect } from 'react-redux';
import { addCard, removeCard, updateCard } from '../redux/actions/cardActions';
//import { addTask } from '../redux/actions/taskActions';

import CardDeck from '../components/CardDeck';
import Card from '../components/Card';

const CARDS_PER_DECK = 4;
let exampleCard = { 
    project: 'example'
}

const mapStateToProps = state => {
    return {
        cardsbyId: state.cards.byId,
        allCards: state.cards.allIds
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addCard: (data) => {dispatch(addCard(data))},
        removeCard: (id, project) => {dispatch(removeCard(id, project))},
        updateCard: (id, data) => {dispatch(updateCard(id, data))}
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
        exampleCard.name = this.state.cardName;
        this.props.addCard(exampleCard);
    }

    handleCardNameSubmit = (event) => {
        event.preventDefault();
    }

    renderCardDecks = () => {
        const numberOfDecks = this.determineNumberOfCardDecks();
        let decks = [];

        for (let deckIndex = 0; deckIndex < numberOfDecks; deckIndex++) {
            const cardStartIndex = deckIndex * CARDS_PER_DECK;
            const cardEndIndex = cardStartIndex + CARDS_PER_DECK;
            const cards = this.props.allCards.slice(cardStartIndex, cardEndIndex);

            let cardsToRender = cards.map(card => {
                return <Card key={card} card={this.props.cardsbyId[card]} edit={this.props.updateCard} remove={this.props.removeCard}/>
            });

            decks.push(<CardDeck key={deckIndex} cards={cardsToRender}/>);
        }

        return decks;
    }

    determineNumberOfCardDecks = () => {
        const numberOfCards = this.props.allCards.length;
        return Math.ceil(numberOfCards / CARDS_PER_DECK);
    }

    render() {
        return (
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
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardContainer)