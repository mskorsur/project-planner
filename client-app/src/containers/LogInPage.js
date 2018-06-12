import React from 'react';

class LogInPage extends React.Component {
    render() {
        return (
            <main role="main" className="mt-5">
                <form className="form-log-in">
                    <h1 className="h3 mb-3 font-weight-normal text-center">Please log in</h1>
                    <label htmlFor="log-in-username" className="sr-only">Username</label>
                    <input type="text" id="log-in-username" className="form-control" placeholder="Username" required/>
                    <label htmlFor="log-in-password" className="sr-only">Password</label>
                    <input type="password" id="log-in-password" className="form-control" placeholder="Password" required/>
                    <button className="btn btn-lg btn-primary btn-block mt-2" type="submit">Log in</button>
                </form>
            </main>
        );
    }
}

export default LogInPage