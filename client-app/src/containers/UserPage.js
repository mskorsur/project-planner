import React from 'react';
import { connect } from 'react-redux';
import { updateUser } from '../redux/actions/userActions';

import UserInfoForm from '../components/UserInfoForm';
import ChangePasswordForm from '../components/ChangePasswordForm';

const mapStateToProps = state => {
    return {
        currentUser: state.users.byId[state.currentUser]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (id, data) => {dispatch(updateUser(id, data))}
    }
}

class UserPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEdit: false,
            isChangePass: false
        }
    }

    handleEditButtonClick = () => {
        this.setState({isEdit: !this.state.isEdit, isChangePass: false});
    }

    handleChangePasswordButtonClick = () => {
        this.setState({isChangePass: !this.state.isChangePass, isEdit: false});
    }

    renderUserPageBody = () => {
        if (this.state.isEdit) {
            return <UserInfoForm {...this.props.currentUser}
                                update={this.props.updateUser} 
                                cancel={this.handleEditButtonClick}/>;
        }
        
        if (this.state.isChangePass) {
            return <ChangePasswordForm userId={this.props.currentUser.id}
                                    update={this.props.updateUser}
                                    cancel={this.handleChangePasswordButtonClick}/>
        }

        return this.renderUserData();
    }

    renderUserData = () => {
        return (
            <table className="table">
                <tbody>
                    <tr>
                        <th scope="row" className="h5 font-weight-bold">First name</th>
                        <td className="h5">{this.props.currentUser.firstName}</td>
                    </tr>
                    <tr>
                        <th scope="row" className="h5 font-weight-bold">Last name</th>
                        <td className="h5">{this.props.currentUser.lastName}</td>
                    </tr>
                    <tr>
                        <th scope="row" className="h5 font-weight-bold">Email</th>
                        <td className="h5">{this.props.currentUser.email}</td>
                    </tr>
                    <tr>
                        <th scope="row" className="h5 font-weight-bold">Organization</th>
                        <td className="h5">{this.props.currentUser.organization}</td>
                    </tr>
                    <tr>
                        <th scope="row" className="h5 font-weight-bold">GitHub</th>
                        <td className="h5">
                            <a href={this.props.currentUser.github} target="blank">
                            Profile <i className="fas fa-external-link-alt"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <main role="main" className="container mt-5">
                <div className="row">
                    <div className="col-5">
                        <h2 className="heading-weight heading-color">{this.props.currentUser.userName}</h2>
                    </div>
                    <div className="col-4 ml-2">
                        <button type="button" className="btn btn-primary mx-1 my-1" onClick={this.handleEditButtonClick}>
                            <i className="fas fa-pencil-alt"></i> Edit
                        </button>
                        <button type="button" className="btn btn-primary mx-1 my-1" onClick={this.handleChangePasswordButtonClick}>
                            <i className="fas fa-key"></i> Change password
                        </button>
                    </div>
                </div>
                <div className="row mt-4">
                    {this.renderUserPageBody()}
                </div>
            </main>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage)