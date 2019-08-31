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

import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline'

import firebaseRef from '../../firebase'

import './HistoryItems.scss'

class HistoryItems extends Component {

    state = {
        history: {},
        id: null,
        seq: null
    }

    componentDidMount() {
        const _this = this

        this.props.headerTitleAction('Histórico')
        this.props.tabActiveAction('historico')
        this.props.backButtonAction(true)

        this.setState({
            id: _this.props.match.params.id,
            seq: _this.props.match.params.seq
        })

        this.start()
    }

    async start() {
        this.props.loaderAction(true)

        await this.verifyHistory(this.props.match.params.id)

        this.props.loaderAction(false)
    }

    verifyHistory = async (id) => {
        const _this = this

        const historyRef = await firebaseRef.child('history/' + id)

        await historyRef.once('value', function(snapshot) {
            if (!snapshot.exists()) {
                _this.renderRedirect()
            }

            _this.setState({
                history: snapshot.val()
            })

            _this.props.headerTitleAction('Pedido ' + _this.props.match.params.seq)
        })
    }

    renderRedirect = () => {
        return window.location = '/historico'
    }

    render() {
        const { history } = this.state

        const { loader } = this.props

        return (
            <>
                <div className="page-historico">
                { history.items && history.items.length > 0 && (
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
                                    { history.items.map((p, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="nome-produto">
                                                {p.name}
                                            </TableCell>
                                            <TableCell align="right" className="data">
                                                <CheckCircleIcon className={`check-icon ${p.bought ? 'active' : ''}`} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </>
                )}

                { (!history.items.length && !loader) && (
                    <div className="nenhum-item">
                        Nenhum item na lista atual!
                    </div>
                )}
                </div>
            </>
        )
    }
}

const mapStateToProps = store => ({
    loader: store.generalLayoutState.loader
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ headerTitleAction, tabActiveAction, backButtonAction, loaderAction }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryItems)