import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { closeMenuAction } from '../../actions'

import CloseIcon from '@material-ui/icons/Close'

import './MenuSide.scss'

class MenuSide extends Component {
    closeMenu = () => {
        this.props.closeMenuAction()
    }

    render() {
        // State/Store Redux
        const {
            menuOpened
        } = this.props

        return (
            <div className={"menu-side " + (!menuOpened ? "menu-closed" : "")}>
                <div className="menu-side__container">
                    <CloseIcon fontSize="large" className="menu-side__close" onClick={this.closeMenu} />
                    <ul className="menu-side__items">
                        <li className="menu-side__item">
                            <Link to="/adicionar-produto" onClick={this.closeMenu}>Adicionar Produto</Link>
                        </li>
                        <li className="menu-side__item">
                            <Link to="/lista-de-produtos" onClick={this.closeMenu}>Lista de Produtos</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    menuOpened: store.generalLayoutState.menuOpened
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ closeMenuAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuSide)