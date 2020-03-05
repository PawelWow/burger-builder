import React, {useEffect} from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

const Orders = props => {

    const { onFetchOrders } = props;
    useEffect(() => {
        onFetchOrders(props.token, props.userId);
    }, [onFetchOrders]);

    return (
        <div>
            {showOrders(props)}
        </div>
    );

    function showOrders(props)
    {
        if(props.loading ){
            return <Spinner />
        }

        return props.orders.map( order => (
            <Order key={order.id} ingredients={order.ingredients} price={order.price} />
        ));
    }

}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch( actions.fetchOrders(token, userId) )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));