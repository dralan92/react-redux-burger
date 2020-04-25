import React,{Component} from 'react';
import Button from '../../components/UI/Button/Buton';
import classes from './ContactData.css';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import Input from '../../components/UI/Input/Input';

class ContactData extends Component {

    state ={
        orderForm:{
            
            name:{
                elementType: 'input',
                elementConfig:{
                    type:'text',
                    placeholder: 'Your Name'
                },
                value:'',
                validation:{
                    required:true
                },
                valid: false,
                touched:false
            },
            street: {
                elementType: 'input',
                elementConfig:{
                    type:'text',
                    placeholder: 'Street'
                },
                value:'',
                validation:{
                    required:true
                },
                valid: false,
                touched:false
            } ,
            zipCode: {
                elementType: 'input',
                elementConfig:{
                    type:'text',
                    placeholder: 'Zip'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:5,
                    maxLength:5
                },
                valid: false,
                touched:false

            },
            country: {
                elementType: 'input',
                elementConfig:{
                    type:'text',
                    placeholder: 'Country'
                },
                value:'',
                validation:{
                    required:true
                },
                valid: false,
                touched:false
            },
            email:{
                elementType: 'input',
                elementConfig:{
                    type:'text',
                    placeholder: 'Email'
                },
                value:'',
                validation:{
                    required:true
                },
                valid: false,
                touched:false
            },
            deliveryMethod:{
                elementType: 'select',
                elementConfig:{
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'},

                    ]
                },
                value:'',
                validation:{},
                valid:true,
                touched:false
            }
        },
        loading:true,
        formIsValid: false
    }

    checkValidity(value, rules){
        let isValid = true;
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }
        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
       const updatedOrderForm = {
           ...this.state.orderForm
       };

       const updatedFormElement = {
           ...updatedOrderForm[inputIdentifier]
        }

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(event.target.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputId in updatedOrderForm){
            formIsValid = updatedOrderForm[inputId].valid && formIsValid;
        }
        this.setState({orderForm:updatedOrderForm, formIsValid:formIsValid});
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading:true});
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order ={
            ingredients : this.props.ingredients,
            price: this.props.price,
            orderData: formData

        }
       
       /*  let test = {
            
            customer: {
                name: 'Alan',
                address:{
                    street: 'Test st',
                    zipCode: '9292929',
                    country: 'Germany'
                },
                email:'max@test.com',
            },
            deliveryMethod:'fastest'
        }
        axios.post('/orders.json',test)
                .then(res=>{
                    console.log(res);
                })
                .catch(err=>{
                    console.log(err);
                }); */
        axios.post('/orders.json',order)
                .then(response => {
                    this.setState({loading:false});
                    console.log(response);
                    this.props.history.push('/')})

                .catch(error => {
                    this.setState({loading:false});
                    console.log(error)}); 
    }

    render(){
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }
        let form = (
                <form onSubmit={this.orderHandler} >
                    
                    {formElementsArray.map(formElement => (
                        <Input  key ={formElement.id}
                                elementType={formElement.config.elementType}
                                changed = {(event) => this.inputChangedHandler(event, formElement.id)}
                                shouldValidate = {formElement.config.validation}
                                invalid={!formElement.config.valid}
                                elementConfig={formElement.config.elementConfig}
                                touched={formElement.config.touched}
                                value={formElement.config.value} />
                    ))}
                    <Button btnType="Success" 
                            clicked={this.orderHandler}
                            disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
        );
        if(this.state.loading){
            //form = <Spinner />
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Details</h4>
                {form}
            </div>
        );
    }

} 

export default ContactData;