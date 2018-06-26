import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/log-in', state: { from: props.location } }} />
    )} />
)

export default connect(mapStateToProps)(ProtectedRoute)