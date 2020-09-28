import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Burger from './Burger';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

configure({adapter: new Adapter()});

describe('<Burger />', () => {
    let wrapper;

    const ingredientName = "test_ingredient";

    beforeEach(() => {
        wrapper = shallow(<Burger ingredients={{[ingredientName]: 0}} />);
    });

    it('should render two <BurgerIngredient /> elements if not no ingredients set (bread-top and bread-bottom)', () => {
        expect(wrapper.find(BurgerIngredient)).toHaveLength(2);
        expect(wrapper.find(BurgerIngredient)).toHaveProperty("type");
    });

    it('should render three <BurgerIngredient /> elements if at least one ingredient is set', () => {
        wrapper.setProps({ingredients: {[ingredientName]: 1}});
        expect(wrapper.find(BurgerIngredient)).toHaveLength(3);
    });

    it('should render expected number of <BurgerIngredient /> elements if they are set', () => {

        wrapper.setProps({ingredients: {"test_ingredient_1": 2, "test_ingredient_2": 3 }});
        expect(wrapper.find(BurgerIngredient)).toHaveLength(7);
    });  
});

