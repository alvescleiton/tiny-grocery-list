import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import Header from '../components/Header/Header.component'
import MenuSide from '../components/MenuSide/MenuSide.component'
import Loader from '../components/Loader/Loader.component'

import CurrentListPage from '../pages/CurrentList/CurrentList.pages'
import PendingListPage from '../pages/PendingList/PendingList.pages'
import HistoryPage from '../pages/History/History.pages'
import HistoryItemsPage from '../pages/HistoryItems/HistoryItems.pages'
import AddProductPage from '../pages/AddProduct/AddProduct.pages'

import './App.scss'
import FooterNavigator from './FooterNavigator/FooterNavigator.component';
import ProductList from '../pages/ProductList/ProductList.pages'

class App extends Component {
    state = {
        url: '',
        headerTitle: 'Lista Atual',
        tabActive: 'lista_atual'
    }

    render() {
        return (
            <div className="app">
                <Loader />

                <Header />

                <MenuSide />

                <Switch>
                    <Route path="/" exact={true} component={CurrentListPage} />
                    <Route path="/lista-atual" exact={true} component={CurrentListPage} />
                    <Route path="/itens-pendentes" component={PendingListPage} />
                    <Route path="/historico-itens/:id/:seq" component={HistoryItemsPage} />
                    <Route path="/historico" exact={true} component={HistoryPage} />
                    <Route path="/adicionar-produto" component={AddProductPage} />
                    <Route path="/lista-de-produtos" component={ProductList} />
                </Switch>

                <FooterNavigator />
            </div>
        )
    }
}

export default App