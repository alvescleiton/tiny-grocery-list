import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openMenuAction } from '../../actions'

import {
    AppBar,
    Toolbar
} from '@material-ui/core'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import BackButton from '@material-ui/icons/ArrowBackIos'
import { bindActionCreators } from 'redux';

import './Header.scss'

class Header extends Component {

    openMenu = () => {
        this.props.openMenuAction()
    }

    render() {
        // State/Store Redux
        const {
            headerTitle,
            backButton
        } = this.props

        return (
            <AppBar position="fixed">
                <Toolbar>
                    { backButton && (
                        <BackButton onClick={() => window.history.back()} className="back-button" />
                    )}

                    <h6 className="titulo-header">{headerTitle}</h6>

                    <IconButton color="inherit" aria-label="menu" onClick={this.openMenu} className="menu-icon">
                        <MenuIcon />
                    </IconButton>

                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = store => ({
    headerTitle: store.generalLayoutState.headerTitle,
    backButton: store.generalLayoutState.backButton
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ openMenuAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)