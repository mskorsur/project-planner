import React from 'react';
import { connect } from 'react-redux';

import CardContainer from './CardContainer';

const mapStateToProps = state => {
    return {
        currentProject: state.projects.byId[state.currentProject]
    }
}

class ProjectPage extends React.Component {
    render() {
        return (
            <main role="main" className="container mt-5">
                <div className="row">
                    <div className="col-5">
                        <h2 className="heading-weight heading-color">{this.props.currentProject.name}</h2>
                    </div>
                    <div className="col-3">
                        <button type="button" className="btn btn-primary mx-1 my-1"><i className="far fa-save"></i> Save</button>
                        <button type="button" className="btn btn-primary mx-1 my-1"><i className="far fa-trash-alt"></i> Delete</button>
                    </div>
                </div>
                <CardContainer />
            </main>
        );
    }
}

export default connect(mapStateToProps)(ProjectPage)