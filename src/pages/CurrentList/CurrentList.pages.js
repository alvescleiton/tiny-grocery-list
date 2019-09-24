import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { headerTitleAction, tabActiveAction, backButtonAction, loaderAction } from '../../actions'
import { sortElements } from '../../utils'

import {
    Button,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@material-ui/core'

import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline'

import firebaseRef from '../../firebase'

import './CurrentList.scss'

class CurrentList extends Component {
    state = {
        productList: []
    }

    componentDidMount() {
        this.props.headerTitleAction('Lista Atual')
        this.props.tabActiveAction('lista-atual')
        this.props.backButtonAction(false)

        this.start()
    }

    async start() {
        this.props.loaderAction(true)

        await this.listCurrentList()

        this.props.loaderAction(false)
    }

    listCurrentList = async () => {
        const _this = this
        const currentListRef = await firebaseRef.child('current_list')

        await currentListRef.once("value", function(snapshot) {
            var products = []

            snapshot.forEach((element) => {
                var item = element.val()
                item.key = element.key

                products.push(item)
            })

            products = sortElements(products, 'name')

            _this.setState({
                productList: products
            })
        });
    }

    handleCheckItem = async (key) => {
        let obj = this.state.productList.find(e => e.key === key)

        if (obj !== undefined) {
            obj.bought = !obj.bought

            const currentListRef = await firebaseRef.child('current_list/' + key)
            await currentListRef.update(obj)

            let newProductList = this.state.productList.filter(e => e.key !== key)
            newProductList = newProductList.concat(obj)

            newProductList = sortElements(newProductList, 'name')

            this.setState({
                productList: newProductList
            })
        }
    }

    handleCheckout = () => {
        const notBought = this.state.productList.filter(p => p.bought === false)

        if (window.confirm("Deseja realmente finalizar a compra?")) {
            if (notBought.length > 0) {
                if (window.confirm("Há itens marcados como não comprados!\nDeseja realmente finalizar a compra?")) {
                    this.doCheckout()
                }
            } else {
                this.doCheckout()
            }
        }
    }

    doCheckout = async () => {
        if (this.state.productList.length === 0) {
            alert('Não há itens na compra!')
            return false
        }

        const historyRef = await firebaseRef.child('history')

        const obj = {
            data: new Date().toISOString().slice(0, 10),
            items: []
        }

        this.state.productList.forEach(item => {
            delete item.key

            obj.items.push(item)
        })

        historyRef.push(obj).then(async (res) => {
            await this._resetCurrentList()

            alert('Compra finalizada com sucesso!')
        })
    }

    _resetCurrentList = async () => {
        this.currentListRef = await firebaseRef.child('current_list')
        this.currentListRef.remove()

        this.setState({
            productList: []
        })
    }

    render() {
        const { productList } = this.state

        const { loader } = this.props

        return (
            <div className="page-lista-atual">
                { productList.length > 0 && (
                    <>
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell style={{ width: '75px' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { productList.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="nome-produto">{p.name}</TableCell>
                                        <TableCell align="right">
                                            <CheckCircleIcon onClick={() => this.handleCheckItem(p.key)} className={`check-icon ${p.bought ? 'active' : ''}`} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                    <Button
                        variant="contained"
                        color="primary"
                        className="finalizar-pedido"
                        fullWidth
                        onClick={this.handleCheckout}
                    >
                       Finalizar pedido
                    </Button>
                    </>
                )}

                { (!productList.length && !loader) && (
                    <div className="nenhum-item">
                        Nenhum item na lista atual!
                    </div>
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(CurrentList)