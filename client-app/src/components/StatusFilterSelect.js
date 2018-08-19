import React from 'react';
import { connect } from 'react-redux';
import { setStatusFilter } from  '../redux/actions/uiActions';

const filterOptions = [
    {value: 'All'},
    {value: 'Active'},
    {value: 'Paused'},
    {value: 'Done'}
]

const mapStateToProps = state => {
    return {
        statusFilter: state.ui.statusFilter
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setFilter: (filter) => {dispatch(setStatusFilter(filter))}
    }
}

class StatusFilterSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: this.props.statusFilter
        }
    }

    handleFilterChange = (event) => {
        this.setState({filter: event.target.value});

        this.props.setFilter(event.target.value);
    }

    renderFilterOptions = () => {
        return filterOptions.map(option => {
            return <option key={option.value} value={option.value}>{option.value}</option>;
        });
    }

    render() {
        return (
            <select className="form-control status-select" value={this.state.filter} onChange={this.handleFilterChange}>
                {this.renderFilterOptions()}
            </select>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusFilterSelect)