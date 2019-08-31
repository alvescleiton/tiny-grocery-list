import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { headerTitleAction, tabActiveAction, backButtonAction, loaderAction } from '../../actions'

import {
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell
} from '@material-ui/core'

import firebaseRef from '../../firebase'

import './ProductList.scss'

class ProductList extends Component {
    state = {
        allProducts: []
    }

    componentDidMount() {
        this.props.headerTitleAction("Lista de Produtos")
        this.props.tabActiveAction("")
        this.props.backButtonAction(false)

        this.start()
    }

    async start() {
        this.props.loaderAction(true)

        await this.listagemGeral()

        this.props.loaderAction(false)
    }

    listagemGeral = async () => {
        const _this = this
        this.productRef = await firebaseRef.child('product')

        await this.productRef.on('value', function(snapshot){
            _this.setState({
                allProducts: Object.values(snapshot.val()).sort(function (a, b) {
                    return (a.name > b.name ? 1 : (a.name < b.name ? -1 : 0))
                })
            })
        });
    }

    render() {
        const { allProducts } = this.state

        const { loader } = this.props

        return (
            <div className="page-lista-de-produtos">
                { allProducts && (
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { allProducts.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="nome-produto">{item.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}

                { (!allProducts.length && !loader) && (
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)