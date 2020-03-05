import React, { useState } from 'react';
import { connect } from 'react-redux';

import Aux from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrwer/SideDrawer';

import classes from './Layout.css';

const Layout = props => {
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

    const onSideDrawerClosed = () => {
        setSideDrawerIsVisible(false);
    }

    const onSideDrawerToggle = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    }

    return (
        <Aux>
            <Toolbar 
                isAuth={props.isAuthenticated}
                drawerToggleClicked={onSideDrawerToggle} />
            <SideDrawer 
                isAuth={props.isAuthenticated}
                open={sideDrawerIsVisible} 
                closed={onSideDrawerClosed} />
             <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    );
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)( Layout );