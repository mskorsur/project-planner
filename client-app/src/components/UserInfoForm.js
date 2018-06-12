import React from 'react';

class UserInfoForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: this.props.userName || '',
            firstName: this.props.firstName || '',
            lastName: this.props.lastName || '',
            email: this.props.email || '',
            organization: this.props.organization || '',
            github: this.props.github || ''
        }
    }

    handleUsernameChange = (event) => {
        this.setState({userName: event.target.value});
    }

    handleFirstNameChange = (event) => {
        this.setState({firstName: event.target.value});
    }

    handleLastNameChange = (event) => {
        this.setState({lastName: event.target.value});
    }

    handleEmailChange = (event) => {
        this.setState({email: event.target.value});
    }

    handleOrganizationChange = (event) => {
        this.setState({organization: event.target.value});
    }

    handleGithubLinkChange = (event) => {
        this.setState({github: event.target.value});
    }

    handleCancelButtonClick = () => {
        this.props.cancel();
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.props.hasOwnProperty('update')) {
            this.props.update(this.props.id, this.state);
            this.props.cancel();
        }
        else if (this.props.hasOwnProperty('add')) {
            this.props.add(this.state);
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="ml-3 mb-3">
                <div className="form-row">
                    <div className="form-group col-5">
                        <label htmlFor="user-username">Username</label>
                        <input className="form-control" id="user-username" type="text" required
                        value={this.state.userName} onChange={this.handleUsernameChange}/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-5">
                        <label htmlFor="user-firstname">First name</label>
                        <input className="form-control" id="user-firstname" type="text" required
                        value={this.state.firstName} onChange={this.handleFirstNameChange} />
                    </div>
                    <div className="form-group col-5">
                        <label htmlFor="user-lastname">Last name</label>
                        <input className="form-control" id="user-lastname" type="text" required
                        value={this.state.lastName} onChange={this.handleLastNameChange} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-5">
                        <label htmlFor="user-email">E-mail</label>
                        <input className="form-control" id="user-email" type="email" required
                        value={this.state.email} onChange={this.handleEmailChange} />
                    </div>
                    <div className="form-group col-5">
                        <label htmlFor="user-organization">Organization</label>
                        <input className="form-control" id="user-organization" type="text"
                        value={this.state.organization} onChange={this.handleOrganizationChange} />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-5">
                        <label htmlFor="user-github">GitHub</label>
                        <input className="form-control" id="user-github" type="text"
                        value={this.state.github} onChange={this.handleGithubLinkChange} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mx-1"><i className="fas fa-check"></i> Submit</button>
                <button type="button" className="btn btn-outline-primary mx-1" onClick={this.handleCancelButtonClick}>Cancel</button>
            </form>
        );
    }
}

export default UserInfoForm