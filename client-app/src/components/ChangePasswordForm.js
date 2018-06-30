import React from 'react';
import { Input, FormFeedback } from 'reactstrap';

class ChangePasswordForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPassword: '',
            newPassword: '',
            repeatNewPassword: ''
        }
    }

    handleCurrentPasswordChange = (event) => {
        this.setState({currentPassword: event.target.value});
    }

    handleNewPasswordChange = (event) => {
        this.setState({newPassword: event.target.value});
    }

    handleRepeatPasswordChange = (event) => {
        this.setState({repeatNewPassword: event.target.value});
    }

    handleCancelButtonClick = () => {
        this.props.cancel();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        
        const {firstName, lastName, email} = this.props;
        let data = Object.assign({}, this.state, {firstName, lastName, email});
        this.props.update(this.props.id, data);
    }

    shouldPassBeInvalid = () => {
        if (this.state.newPassword === '' || this.state.repeatNewPassword === '') {
            return false;
        }

        if (this.state.newPassword !== this.state.repeatNewPassword) {
            return true;
        }
        else {
            return false;
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="ml-3">
                <div className="form-group">
                    <label htmlFor="user-current-password">Current password</label>
                    <input className="form-control" id="user-current-password" type="password" required
                    value={this.state.currentPassword} onChange={this.handleCurrentPasswordChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="user-new-password">New password</label>
                    <Input className="form-control" id="user-new-password" type="password" required
                    value={this.state.newPassword} invalid={this.shouldPassBeInvalid()} onChange={this.handleNewPasswordChange}/>
                    <FormFeedback>Passwords must match!</FormFeedback>
                </div>
                <div className="form-group">
                    <label htmlFor="user-repeat-password">Repeat new password</label>
                    <Input className="form-control" id="user-repeat-password" type="password" required
                    value={this.state.repeatNewPassword} invalid={this.shouldPassBeInvalid()} onChange={this.handleRepeatPasswordChange}/>
                    <FormFeedback>Passwords must match!</FormFeedback>
                </div>
                <button type="submit" className="btn btn-primary mx-1" disabled={this.shouldPassBeInvalid()}>
                    <i className="fas fa-check"></i> Submit
                </button>
                <button type="button" className="btn btn-outline-primary mx-1" onClick={this.handleCancelButtonClick}>Cancel</button>
            </form>
        );
    }
}

export default ChangePasswordForm