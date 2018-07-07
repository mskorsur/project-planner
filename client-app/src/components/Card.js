import React from 'react';

import TaskContainer from '../containers/TaskContainer';

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditable: false,
            cardName: this.props.card.name
        }
    }

    handleCardNameChange = (event) => {
        this.setState({cardName: event.target.value});
    }

    handleCardNameSubmit = (event) => {
        event.preventDefault();

        const cardData = Object.assign({}, this.props.card, {name: this.state.cardName});
        delete cardData.tasks;
        this.props.edit(this.props.card.id, cardData);
        this.setState({isEditable: !this.state.isEditable});
    }

    handleEditClick = () => {
        this.setState({isEditable: !this.state.isEditable});
    }

    handleRemoveClick = () => {
        this.props.remove(this.props.card.id, this.props.card.project);
    }

    renderCardName = () => {
        if (this.state.isEditable) {
            return (
                <form className="form" onSubmit={this.handleCardNameSubmit}>
                    <label className="sr-only" htmlFor="card-name">Card name</label>
                    <input type="text" className="form-control mb-1 mr-sm-2" id="card-name" 
                    value={this.state.cardName} onChange={this.handleCardNameChange}/>
                </form>
            );
        }
        else {
            return <h5 className="heading-weight">{this.props.card.name}</h5>;
        }
    }

    render() {
        return (
            <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="card shadow">
                    <div className="card-header bg-secondary text-white">
                        {this.renderCardName()}
                        <div className="float-right">
                            <span className="mr-3" onClick={this.handleEditClick}><i className="fas fa-pencil-alt"></i></span>
                            <span onClick={this.handleRemoveClick}><i className="fas fa-times"></i></span>
                        </div>
                    </div>
                   <TaskContainer card={this.props.card}/>
                </div>
            </div>
        );
    }
}

export default Card