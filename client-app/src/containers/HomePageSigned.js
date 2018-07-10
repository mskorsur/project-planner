import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const mapStateToProps = state => {
    const currentUser = state.users.byId[state.currentUser];
    return {
        userFullName: currentUser.firstName + ' ' + currentUser.lastName,
        userProjects: selectCurrentUserProjects(state.projects.byId, currentUser.projects)
    }
}

const selectCurrentUserProjects = (stateProjects, userProjects) => {
    return userProjects.map(project => {
        return stateProjects[project];
    });
}

const greetings = [
    'Welcome back,',
    'Hello,',
    'Good to see you again,',
    'Good day,',
    'I hope you are doing well,',
    'How is it going,',
    'What is up,',
    'It has been a while,',
];

const MAX_RECENT_PROJECTS = 5;

class HomePageSigned extends React.Component {
    displayGreetingsMessage = () => {
        const minGreetingsNum = Math.ceil(0);
        const maxGreetingsNum = Math.floor(greetings.length - 1);
        const randomGreetingIndex = Math.floor(Math.random() * (maxGreetingsNum - minGreetingsNum + 1)) + minGreetingsNum;

        return greetings[randomGreetingIndex] + ' ' + this.props.userFullName;
    }

    renderRecentProjectsAsTableRows = () => {
        this.sortProjectsBasedOnModificationDate(this.props.userProjects);
        const recentProjects = this.props.userProjects.slice(0, MAX_RECENT_PROJECTS);

        return recentProjects.map((project, index) => {
            return (
                <tr key={project.id}>
                    <th scope="row" className="h5 font-weight-bold">{index + 1}</th>
                    <td className="h5"><Link to={`/project/${project.id}`}>{project.name}</Link></td>
                    <td className="h5 text-capitalize">{project.status}</td>
                </tr>
            );
        });
    }

    sortProjectsBasedOnModificationDate = (projects) => {
        projects.sort((first, second) => {
            return new Date(second.lastModified) - new Date(first.lastModified);
        });
    }

    render() {
        return (
            <main role="main" className="container mt-5">
                <h2 className="heading-weight heading-color">{this.displayGreetingsMessage()}</h2>
                <div className="row mt-4">
                    <h5>Recent projects</h5>
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRecentProjectsAsTableRows()}
                        </tbody>
                    </table>
                </div>
            </main>
        );
    }
}

export default connect(mapStateToProps)(HomePageSigned)