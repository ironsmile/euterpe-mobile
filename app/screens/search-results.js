import React from 'react';
import { connect } from 'react-redux';

export class SearchReultsRenderer extends React.Component {
    render() {
        return null;
    }
}

const mapStateToProps = (state) => ({
    search: state.search
});

export const SearchReults = connect(mapStateToProps)(SearchReultsRenderer);
