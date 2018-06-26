import React from 'react';
import { connect } from 'react-redux';
import { loginRequest } from '../redux/actions/authActions';

const mapStateToProps = state => {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        isAuthenticated: state.auth.isAuthenticated,
        message: state.auth.message
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (data) => {dispatch(loginRequest(data))}
    }
}

class LogInPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: '',
            password: ''
        }
    }

    handleUsernameChange = (event) => {
        this.setState({userName: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.props.login(this.state);
    }

    renderMessageBlock = () => {
        if (this.props.isLoggingIn) {
            return (
                <div className="mt-5 alert alert-warning text-center" role="alert">
                   You're currently being logged in
                </div>
            );
        }
        else if (this.props.isAuthenticated) {
            return (
                <div className="mt-5 alert alert-success text-center" role="alert">
                    {this.props.message}
                </div>
            );
        }
        else if (this.props.message !== '') {
            return (
                <div className="mt-5 alert alert-danger text-center" role="alert">
                {this.props.message}
                </div>
            );
        }
    }

    render() {
        return (
            <main role="main" className="mt-5">
                <form className="form-log-in" onSubmit={this.handleSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal text-center">Please log in</h1>
                    <label htmlFor="log-in-username" className="sr-only">Username</label>
                    <input type="text" id="log-in-username" className="form-control" placeholder="Username" required
                    value={this.state.userName} onChange={this.handleUsernameChange}/>
                    <label htmlFor="log-in-password" className="sr-only">Password</label>
                    <input type="password" id="log-in-password" className="form-control" placeholder="Password" required
                    vale={this.state.password} onChange={this.handlePasswordChange}/>
                    <button className="btn btn-lg btn-primary btn-block mt-2" type="submit">Log in</button>
                    {this.renderMessageBlock()}
                </form>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogInPage)