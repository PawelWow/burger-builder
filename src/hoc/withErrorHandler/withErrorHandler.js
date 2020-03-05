import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, setError] = useState(null)

        // poniższe 2 będą działać jak w componentWillMount
        const requestInterceptor = axios.interceptors.request.use( request => {
            setError(null);
            return request;
        });

        const responseInterceptor = axios.interceptors.response.use(response => response, error => {
            setError(error);
        });

        // poniższe zamiast componentWillUnmount
        useEffect(() => {
            return () => {
                axios.interceptors.request.eject(requestInterceptor);
                axios.interceptors.response.eject(responseInterceptor);
            };
        }, [requestInterceptor, responseInterceptor]);

        const onErrorConfirmed = () => {
            setError(null);
        }

        return(
            <Aux>
                <Modal show={error} modalClosed={onErrorConfirmed}>
                    {error ? <p>Something went wrong!<br />{error.message}</p> : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );

    }
}

export default withErrorHandler;