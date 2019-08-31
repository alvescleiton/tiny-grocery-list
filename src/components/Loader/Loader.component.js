import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loaderAction } from '../../actions'

import './Loader.scss'

class Loader extends Component {
    render() {
        const { loader } = this.props

        return (
            <div className={`loader ${loader ? 'show' : ''}`}>
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    loader: store.generalLayoutState.loader
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ loaderAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader)