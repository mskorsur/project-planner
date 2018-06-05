import React from 'react';

class HomePage extends React.Component {
    render() {
        return (
            <main role="main" className="section-parent">
                <div className="section-top">
                    <div className="container">
                    <div className="row pt-5 pl-5 text-white">
                        <div className="col-sm-10 col-md-5">
                            <h4>
                                Easily plan, organize and manage your software projects.
                                Add tasks and track them through different stages.
                            </h4>
                        </div>
                        <div className="col-sm-2 col-md-3">
                            <i className="fas fa-chart-line fa-7x"></i>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="section-bottom">
                    <div className="container">
                    <div className="row pt-2 pl-5 text-white">
                        <div className="col-sm-10 col-md-5">
                            <h4>
                                Easily plan, organize and manage your software projects.
                                Add tasks and track them through different stages.
                            </h4>
                        </div>
                        <div className="col-sm-2 col-md-3">
                            <i className="fas fa-people-carry fa-7x"></i>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default HomePage