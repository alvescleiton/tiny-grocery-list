import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { tabActiveAction, headerTitleAction } from '../../actions'

import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import HistoryIcon from '@material-ui/icons/History'
import ListIcon from '@material-ui/icons/List'

import './FooterNavigator.scss'

class FooterNavigator extends Component {
    state = {
        redirect: false,
        url: ''
    }

    setRedirect = (path, title) => {
        const url = '/' + path
        const tabActive = path.replace("-", "_")

        // Dispatch action
        this.props.tabActiveAction(tabActive);
        this.props.headerTitleAction(title);

        this.setState({
            redirect: true,
            url
        })
    }

    render() {
        // State/Store Redux
        const {
            tabActive
        } = this.props

        return (
            <>
                <div className="bottom-navigation">
                    <Link to="/lista-atual" className={`bottom-navigation__button ${tabActive==="lista-atual" ? "active" : ""}`}>
                        <AddShoppingCartIcon />
                    </Link>
                    <Link to="/itens-pendentes" className={`bottom-navigation__button ${tabActive==="itens-pendentes" ? "active" : ""}`}>
                        <ListIcon />
                    </Link>
                    <Link to="/historico" className={`bottom-navigation__button ${tabActive==="historico" ? "active" : ""}`}>
                        <HistoryIcon />
                    </Link>
                </div>
            </>
        )
    }
}

const mapStateToProps = store => ({
    tabActive: store.generalLayoutState.tabActive
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ tabActiveAction, headerTitleAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterNavigator)