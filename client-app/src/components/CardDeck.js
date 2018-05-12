import React from 'react';

class CardDeck extends React.Component {
    render() {
        return (
            <div className="card-deck mt-2">
                {this.props.cards}
            </div>
        );
    }
}

export default CardDeck