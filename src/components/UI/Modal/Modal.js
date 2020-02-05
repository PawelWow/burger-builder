import React, {Component} from 'react';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backgdrop';

import classes from './Modal.css'

class Modal extends Component {

    // Robimy to bo Modal i to co w nim, a więc i "OrderSummary" będzie się w nim renderować, 
    //a tak to nie będzie, jeśli nie zmienia się widoczność
    shouldComponentUpdate(nextProps, nextState){
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    render(){
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div className={classes.Modal} 
                style={{transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)', opacity: this.props.show ? '1': '0'}}>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}


export default Modal;
