import React from 'react';

class CardDeck extends React.Component {
    render() {
        return (
            <div id="card-deck" className="row mt-4">
                {this.props.cards}
            </div>
        );
    }
}

export default CardDeck