import React, { Component, PropTypes } from 'react';

import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';

import * as api from '../api';

const pushState = (obj, url) =>
    window.history.pushState(obj, '', url);

const onPopState = handler => {
    window.onpopstate = handler;
};

class App extends Component {
    static propTypes = {
        initialData: PropTypes.object.isRequired
    }
    state = this.props.initialData;

    componentDidMount() {
        onPopState((event) => {
            this.setState({
                currentContestId: (event.state || {}).currentContestId
            });
        });
    }

    componentWillUnmount() {
        onPopState(null);
    }

    fetchContest = (contestId) => {
        pushState(
            { currentContestId: contestId },
            `/contest/${contestId}`
        );
        api.fetchContest(contestId).then(contest => {
            this.setState({
                currentContestId: contest._id,
                contests: {
                    ...this.state.contests,
                    [contest._id]: contest
                }
            });
        });
    };
    fetchContestList = () => {
        pushState(
            { currentContestId: null },
            '/'
        );
        api.fetchContestList().then(contests => {
            this.setState({
                currentContestId: null,
                contests
            });
        });
    };
    fetchNames = (nameIds) => {
        if (nameIds.length === 0) {
            return;
        }
        api.fetchNames(nameIds).then(names => {
            this.setState({
                names
            });
        });
    }
    lookupName = (nameId) => {
        if (!this.state.names || !this.state.names[nameId]) {
            return {
                name: '...'
            };
        }
        return this.state.names[nameId];
    }
    pageHeader() {
        if (this.state.currentContestId) {
            return this.currentContest().contestName;
        }
        return 'Naming Contests';
    }
    currentContest() {
        return this.state.contests[this.state.currentContestId];
    }
    currentContent() {
        if (this.state.currentContestId) {
            return <Contest
                            addName={this.addName}
                            fetchNames={this.fetchNames}
                            lookupName={this.lookupName}
                            contestListClick={this.fetchContestList}
                            {...this.currentContest()} />;
        }
        return <ContestList 
                    onContestClick={this.fetchContest}
                    contests={this.state.contests} />;
    }
    addName = (newName, contestId) => {
        api.addName(newName, contestId).then(res =>
            this.setState({
                contests: {
                    ...this.state.contests,
                    [res.updatedContest._id]: res.updatedContest
                },
                names: {
                    ...this.state.names,
                    [res.newName._id]: res.newName
                }
            })
        )
        .catch(console.error);
    }
    render() {
        return (
            <div className="App">
                <Header message={this.pageHeader()} />
                {this.currentContent()}
            </div>
        );
    }
}

export default App;