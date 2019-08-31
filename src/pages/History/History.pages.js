import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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

import './History.scss'

class History extends Component {

    state = {
        history: []
    }

    componentDidMount() {
        this.props.headerTitleAction('Histórico')
        this.props.tabActiveAction('historico')
        this.props.backButtonAction(false)

        this.start()
    }

    async start() {
        this.props.loaderAction(true)

        await this.listHistory()

        this.props.loaderAction(false)
    }

    listHistory = async () => {
        const _this = this

        const historyRef = await firebaseRef.child('history')

        await historyRef.orderByChild('data').once("value", function(snapshot) {
            var history = []

            snapshot.forEach((element) => {
                var item = element.val()
                item.key = element.key

                history.push(item)
            })

            history.sort(function(a, b) {
                if (a.data.replace(/-/g, '') > b.data.replace(/-/g, '')) return -1
                if (a.data.replace(/-/g, '') < b.data.replace(/-/g, '')) return 1
                return 0
            })

            _this.setState({
                history: history
            })
        });
    }

    render() {
        const { history } = this.state

        const { loader } = this.props

        // Utilizado para exibir o número fictício do pedido
        let orderNumber = history.length

        return (
            <div className="page-historico">
                { history.length > 0 && (
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell style={{ width: '75px' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                { history.map((p, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="nome-produto">
                                            <Link to={`/historico-itens/${p.key}/${orderNumber - index}`}>
                                                Pedido {orderNumber - index}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right" className="data">
                                            <Link to={`/historico-itens/${p.key}`}>
                                                {new Date(p.data).toLocaleDateString('pt-BR')}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                )}

                { (!history.length && !loader) && (
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

export default connect(mapStateToProps, mapDispatchToProps)(History)