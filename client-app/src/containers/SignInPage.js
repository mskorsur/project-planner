import React from 'react';
import { connect } from 'react-redux';
import { addUser } from '../redux/actions/userActions';

import UserInfoForm from '../components/UserInfoForm';

const mapDispatchToProps = dispatch => {
    return {
        addUser: (data) => {dispatch(addUser(data))}
    }
}

class SignInPage extends React.Component {
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
                    <UserInfoForm add={this.props.addUser}
                                cancel={this.handleCancelSignIn}/>
                </div>
            </main>
        );
    }
}

export default connect(null, mapDispatchToProps)(SignInPage)