import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setCurrentProject } from '../redux/actions/currentSelectionActions';

import CardContainer from './CardContainer';

const mapStateToProps = (state, ownProps) => {
    return {
        currentProject: state.projects.byId[ownProps.match.params.projectId]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCurrentProject: (project) => {dispatch(setCurrentProject(project))}
    }
}

class ProjectContainer extends React.Component {
    componentDidMount() {
        this.props.setCurrentProject(this.props.match.params.projectId);
    }

    render() {
        return (
            <Fragment>
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
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer)