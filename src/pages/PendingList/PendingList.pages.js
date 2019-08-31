import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { headerTitleAction, tabActiveAction, backButtonAction, loaderAction } from '../../actions'

import { Paper, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'
import ClearIcon from '@material-ui/icons/Clear'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'

import firebaseRef from '../../firebase'

import './PendingList.scss'

class PendingList extends Component {
    state = {
        search: '',
        productList: [],
        productFiltered: [],
        productPendingItems: []
    }

    async componentDidMount() {
        this.props.headerTitleAction('Itens Pendentes')
        this.props.tabActiveAction('itens-pendentes')
        this.props.backButtonAction(false)

        this.start()
    }

    async start() {
        this.props.loaderAction(true)

        await this.listProducts()
        await this.listPendingItems()

        this.props.loaderAction(false)
    }

    listProducts = async () => {
        const _this = this

        this.productRef = await firebaseRef.child('product')

        this.productRef.once("value", function(snapshot) {
            var products = []

            snapshot.forEach((element) => {
                var item = element.val()
                item.key = element.key

                products.push(item)
            })

            products.sort(function(a, b) {
                if (a.name > b.name)
                    return 1

                if (a.name < b.name)
                    return -1

                return 0
            })

            _this.setState({
                productList: products
            })
        });
    }

    listPendingItems = async () => {
        const _this = this

        this.pendingItems = await firebaseRef.child('pending_items')

        this.pendingItems.once("value", function(snapshot) {
            var products = []

            snapshot.forEach((element) => {
                var item = element.val()
                item.key = element.key

                products.push(item)
            })

            products.sort(function(a, b) {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })

            _this.setState({
                productPendingItems: products
            })
        })
    }

    handleSearchProducts = (event) => {
        const busca = event.target.value
        let productFiltered = []

        if (busca.length > 0) {
            let products = this.state.productList

            productFiltered = products.filter(p => p.name.toLowerCase().indexOf(busca.toLowerCase()) !== -1)
        }

        this.setState({
            search: busca,
            productFiltered: productFiltered
        })
    }

    addToPendingItems = async (obj) => {
        if (this.state.productPendingItems.filter(e => e.productKey === obj.key).length === 0) {
            const item = {
                productKey: obj.key,
                name: obj.name
            }

            this.productRef = await firebaseRef.child('pending_items')
            this.productRef.push(item);

            this.setState({
                productPendingItems: [...this.state.productPendingItems, item]
            })

            this.resetSearch()
        } else {
            alert("O produto já está na lista de pendentes!")
        }
    }

    removeFromPendingItems = async (obj) => {
        this.productRef = await firebaseRef.child('pending_items/' + obj.key)

        this.productRef.remove()

        this.listPendingItems()
    }

    resetSearch = () => {
        this.setState({
            search: '',
            productFiltered: []
        })

        document.getElementById("search").focus();
    }

    generateCurrentList = async () => {
        if (this.state.productPendingItems.length === 0) {
            alert('Não há itens para serem incluídos na lista de compras!')
            return false
        }

        if (window.confirm("Deseja realmente gerar a lista de compras?")) {
            this.currentListRef = await firebaseRef.child('current_list')

            this.state.productPendingItems.forEach(item => {
                delete item.key
                item.bought = false

                this.currentListRef.push(item)
            })

            await this._resetPendingItems()

            alert('Lista de compras gerada com sucesso!')
        }
    }

    _resetPendingItems = async () => {
        this.pendingItemsRef = await firebaseRef.child('pending_items')
        this.pendingItemsRef.remove()

        this.setState({
            productPendingItems: []
        })
    }

    render() {
        const { productFiltered, productPendingItems, search } = this.state

        const { loader } = this.props

        return (
            <div className="page-itens-pendentes">
                <div className="busca-produto-flutuante">
                    <input
                        type="text"
                        id="search"
                        placeholder="Buscar Produto"
                        onChange={this.handleSearchProducts}
                        value={search}
                    />

                    { search.length > 0  && (
                        <RemoveCircleIcon
                            className="busca-produto-flutuante__clear cl-red"
                            onClick={this.resetSearch}
                        />
                    )}

                    <Paper>
                        { productFiltered.length > 0 && (
                            <Table>
                                <TableBody>
                                    { productFiltered.map((p, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="nome-produto">{p.name}</TableCell>
                                            <TableCell align="right"><AddIcon onClick={() => this.addToPendingItems(p)} className="cl-green" /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Paper>
                </div>

                <div className="lista-itens-pendentes">
                    { productPendingItems.length > 0 && (
                        <>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produto</TableCell>
                                        <TableCell style={{ width: '75px' }}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    { productPendingItems.map((p, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="nome-produto">{p.name}</TableCell>
                                            <TableCell align="right"><ClearIcon onClick={() => this.removeFromPendingItems(p)} className="cl-red" /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Button
                                className="btn-gerar-lista"
                                variant="contained"
                                color="primary"
                                fullWidth={true}
                                onClick={this.generateCurrentList}
                            >
                                Gerar Lista de Compra
                            </Button>
                        </>
                    )}

                    { (!productPendingItems.length && !loader) && (
                        <div className="nenhum-item">
                            Nenhum item na lista atual!
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = store => ({
    loader: store.generalLayoutState.loader
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ headerTitleAction, tabActiveAction, backButtonAction, loaderAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PendingList)