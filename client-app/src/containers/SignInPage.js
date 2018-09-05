import React from 'react';
import { connect } from 'react-redux';
import { addUserRequest } from '../redux/actions/userActions';

import UserInfoForm from '../components/UserInfoForm';

const mapDispatchToProps = dispatch => {
    return {
        addUser: (data) => {dispatch(addUserRequest(data))}
    }
}

class SignInPage extends React.Component {
    handleSignInUser = (userData) => {
        this.props.addUser(userData);
        this.props.history.push('/');
    }

    handleCancelSignIn = () => {
        this.props.history.push('/');
    }

    render() {
        return (
            <main role="main" className="container mt-5">
                <div className="row">
                    <div className="col-7">
                        <h2 className="heading-color">Sign in for Project Planner application</h2>
                    </div>
                </div>
                <div className="row mt-4">
                    <UserInfoForm add={this.handleSignInUser}
                                cancel={this.handleCancelSignIn}/>
                </div>
            </main>
        );
    }
}

export default connect(null, mapDispatchToProps)(SignInPage)