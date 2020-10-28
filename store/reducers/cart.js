import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import CartItem from '../../models/card-item';
import { ADD_ORDER } from '../actions/order';
import { DELETE_PRODUCT } from '../actions/products';

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
    case REMOVE_FROM_CART:
      console.log(action.pid);
      const item = state.items[action.pid];
      const qty = item.quantity;
      let updatedItems;
      if (qty > 1) {
        const updatedItem = new CartItem(
          item.quantity - 1,
          item.price,
          item.title,
          item.totalAmount
        );

        updatedItems = { ...state.items, [action.pid]: updatedItem };
      } else {
        updatedItems = { ...state.items };
        delete updatedItems[action.pid];
      }

      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - item.price,
      };
    case ADD_ORDER:
      return initialState;
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const newState = { ...state };
      const itemTotal = state.items[action.pid].amount;
      delete newState[action.pid];
      return {
        ...state,
        items: newState,
        totalAmount: state.totalAmount - itemTotal,
      };
    default:
      break;
  }

  return state;
};
