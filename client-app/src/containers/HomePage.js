import React from 'react';
import { connect } from 'react-redux'

import HomePageSigned from './HomePageSigned';

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

class HomePage extends React.Component {
    renderBodyNonSigned = () => {
        return (
            <main role="main" className="section-parent">
                <div className="section-top">
                    <div className="container">
                    <div className="row pt-5 text-white">
                        <div className="col-md-3"></div>
                        <div className="col-md-5">
                            <h4>
                                Easily plan, organize and manage your software projects.
                                Add tasks and track them through different stages.
                            </h4>
                        </div>
                        <div className="col-md-4">
                            <i className="fas fa-chart-line fa-7x"></i>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="section-bottom">
                    <div className="container">
                    <div className="row pt-2 text-white">
                        <div className="col-md-3"></div>
                        <div className="col-md-5">
                            <h4>
                                Collaborate easily across multiple teams. Create your own
                                custom workflow and deliver better products in less time.
                            </h4>
                        </div>
                        <div className="col-md-4">
                            <i className="fas fa-people-carry fa-7x"></i>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        );
    }

    render() {
        return this.props.isAuthenticated
        ? <HomePageSigned />
        : this.renderBodyNonSigned()
    }
}

export default connect(mapStateToProps)(HomePage)