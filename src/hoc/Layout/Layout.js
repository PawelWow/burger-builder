import React, {Component} from 'react';

import Aux from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrwer/SideDrawer';

import classes from './Layout.css';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    onSideDrawerClosed = () => {
        this.setState({ showSideDrawer: false });
    }

    onSideDrawerToggle = () => {
        this.setState( (prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        });
    }

    render() {
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.onSideDrawerToggle} />
                <SideDrawer open={this.state.showSideDrawer} closed={this.onSideDrawerClosed} />
                 <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout;