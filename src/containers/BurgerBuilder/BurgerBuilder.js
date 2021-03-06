import React, {Component} from 'react';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7 
}

class BurgerBuilder extends Component {
    constructor(props){
        super(props)
        this.state = {
            ingredients:null,
            totalPrice: 4,
            purchasable:false,
            purchasing: false,
            loading: false,
            error:false
        }
    }

    componentDidMount(){
        axios.get('https://react-my-burger-81503.firebaseio.com/ingredients.json')
                .then( response =>{
                    this.setState({ingredients:response.data})
                })
                .catch(error=>{
                    this.setState({error:true})
                });
    }

    purchaseContinueHandler = () =>{
        
        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+ this.state.totalPrice.toFixed(2));
        
        const queryString = queryParams.join('&');
        let location = {
            pathname : '/checkout',
            search: '?' + queryString
        }
        
        this.props.history.push(location);
       
    }

    purchaseCancelHandler=()=>{
        this.setState({ purchasing:false});
    }

    purchaseHandler =()=>{
        this.setState({ purchasing:true});
    }
    updatePurchaseState(ingredients){
        
        const sum = Object.keys(ingredients)
                        .map(igKey =>{
                            return ingredients[igKey]
                        })
                        .reduce((sum,el)=>{
                            return sum + el;
                        },0);
        this.setState({purchasable: sum>0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice =  this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <=0){
            return;
        };
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice =  this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        });
        this.updatePurchaseState(updatedIngredients);
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for( let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        
        

       
        let burger = this.state.error?<p>Cannot Load Page</p>:<Spinner />
        if(this.state.ingredients){
            burger = (
                <Auxiliary>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                     />
                </Auxiliary>
            );
            orderSummary = <OrderSummary 
                    ingredients={this.state.ingredients}
                    totalPrice = {this.state.totalPrice} 
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}/>;
                
        }
        if(this.state.loading){
            orderSummary = <Spinner />;
        }
        return(
            <Auxiliary>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxiliary>
            
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);