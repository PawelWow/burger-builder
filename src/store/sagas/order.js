import { put } from "redux-saga/effects";
import axios from '../../axios-orders';

import * as actions from "../actions/index";

const ORDERS_URL = '/orders.json'; 

export function* purchaseBurgerSaga(action) {
    yield put(actions.purchaseBurgerStart());

    try{
        const response = yield axios.post(getAuthOrderUrl(action.token), action.orderData);
        yield put(actions.purchaseBurgerSuccess( response.data.name, action.orderData ));
    } catch (error) {
        yield put(actions.purchaseBurgerFail(error));
    }
};

export function* fetchOrdersSaga (action) {
    yield put(actions.fetchOrdersStart());

    // filtrujemy zamówienia od danego usera tylko
    const ordersUrl = getAuthOrderUrl(action.token) + '&orderBy="userId"&equalTo="' + action.userId + '"';
        
    try {
        const response = yield axios.get(ordersUrl);

        const fetchedOrders = [];
        for(let key in response.data) {
            fetchedOrders.push( {...response.data[key], id: key});
        }

        yield put (actions.fetchOrdersSuccess(fetchedOrders));

    }catch (error) {
        yield put(actions.fetchOrdersFail(error));
    }
};

const getAuthOrderUrl = (token) => {    
    return ORDERS_URL + '?auth=' + token;
}
