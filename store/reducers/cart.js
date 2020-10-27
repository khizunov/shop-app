import { ADD_TO_CART } from '../actions/cart';
import CartItem from '../../models/card-item';

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const price = addedProduct.price;
      const title = addedProduct.title;
      let cartItem;

      if (state.items[addedProduct.id]) {
        cartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          price,
          title,
          state.items[addedProduct.id].totalAmount + price
        );
      } else {
        cartItem = new CartItem(1, price, title, price);
      }

      return {
        items: { ...state.items, [addedProduct.id]: cartItem },
        totalAmount: state.totalAmount + price,
      };
    default:
      break;
  }

  return state;
};
