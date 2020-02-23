import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

const ORDERS_URL = '/orders.json'; 

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
};

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch( purchaseBurgerStart() );
        //w firebase musimy ustawić reguły dla real time database
        axios.post(getAuthOrderUrl(token), orderData)
            .then(response => { 
                console.log(response.data);
                dispatch( purchaseBurgerSuccess( response.data.name, orderData ));
            } )            
            .catch(error => {
                dispatch( purchaseBurgerFail( error ));
        });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSuccess = (orders ) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    };
};

export const fetchOrdersFail = (error ) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    };
};

export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrdersStart());

        // filtrujemy zamówienia od danego usera tylko
        const ordersUrl = getAuthOrderUrl(token) + '&orderBy="userId"&equalTo="' + userId + '"';

        axios.get(ordersUrl)
            .then(res => {
                const fetchedOrders = [];
                for(let key in res.data) {
                    fetchedOrders.push( {...res.data[key], id: key});
                }
                dispatch(fetchOrdersSuccess(fetchedOrders));
            })
            .catch(error => {
                dispatch(fetchOrdersFail(error));
            });
    };
};

const getAuthOrderUrl = (token) => {    
    return ORDERS_URL + '?auth=' + token;
}
