import React from 'react';

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-blue">
                <a className="navbar-brand" href="/">Project Planner</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation-toggle" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navigation-toggle">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/"><i className="fas fa-plus"></i> New project</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/"><i className="fas fa-list-ul"></i> All projects</a>
                        </li>
                    </ul>
                    <div className="justify-content-end">
                        <button type="button" className="btn btn-outline-warning mr-2"><i class="fas fa-user"></i> Marin</button>
                        <button type="button" className="btn btn-outline-warning">Log out</button>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar