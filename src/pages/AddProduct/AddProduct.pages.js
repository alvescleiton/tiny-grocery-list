import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { openMenuAction, headerTitleAction, tabActiveAction, backButtonAction, loaderAction } from '../../actions'

import firebaseRef from '../../firebase'

import {
    Button,
    TextField
} from '@material-ui/core'

import './AddProduct.scss'

class AddProduct extends Component {
    state = {
        productName: '',
        allProducts: []
    }

    componentDidMount() {
        this.props.tabActiveAction("")
        this.props.headerTitleAction("Adicionar Produto");
        this.props.backButtonAction(false)

        this.start()
    }

    async start() {
        this.props.loaderAction(true)

        await this.listAllProducts()

        this.props.loaderAction(false)
    }

    listAllProducts = async() => {
        const _this = this;

        this.productRef = await firebaseRef.child('product')

        await this.productRef.on('value', function(snapshot){
            _this.setState({
                allProducts: Object.values(snapshot.val())
            })
        });
    }

    handleChange = (event) => {
        this.setState({
            productName: event.target.value
        })
    }

    handleClick = async () => {
        this.submitInfo()
    }

    handleSubmit = (event) => {
        event.preventDefault()

        this.submitInfo()
    }

    submitInfo = () => {
        const _this = this;

        if (!this.state.productName.length) {
            alert('Preencha o campo com o nome do produto!')
            document.getElementById('input_add_produto').focus()
            return;
        }

        const alreadyexist = this.state.allProducts.filter(e => e.name.toLowerCase() === this.state.productName.toLowerCase()).length > 0

        if (alreadyexist) {
            alert('Produto já cadastrado anteriormente!')
            document.getElementById('input_add_produto').focus()
            return;
        }

        try {
            this.productRef.push({
                name: this.state.productName
            }, function(error){
                if (error) {
                    alert('Ocorreu um erro ao gravar o produto')
                } else {
                    alert('Produto gravado com sucesso!')

                    _this.setState({
                        productName: ''
                    })
                }
            })
        } catch (e) {
            alert('Ocorreu um erro: ' + e)
        }
    }

    render() {
        let productName = this.state.productName

        return (
            <div className="page-historico">
                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <TextField
                        label="Nome do Produto"
                        id="input_add_produto"
                        onChange={this.handleChange}
                        margin="normal"
                        fullWidth
                        className="input-modal"
                        value={productName}
                        autoFocus
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        className="submit-form"
                        fullWidth
                        onClick={this.handleClick}
                    >
                        Gravar
                    </Button>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ openMenuAction, headerTitleAction, tabActiveAction, backButtonAction, loaderAction }, dispatch)
}

export default connect(null, mapDispatchToProps)(AddProduct)