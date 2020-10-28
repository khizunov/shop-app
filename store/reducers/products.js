import PRODUCTS from '../../data/dummy-data';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1'),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(item => item.id !== action.pid),
        availableProducts: state.availableProducts.filter(
          item => item.id !== action.pid
        ),
      };
    case CREATE_PRODUCT:
      const data = action.data;
      const newProd = new Product(
        new Date().toString(),
        'u1',
        data.title,
        data.imageUrl,
        data.description,
        data.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProd),
        userProducts: state.userProducts.concat(newProd),
      };
    case UPDATE_PRODUCT:
      const prodIndex = state.userProducts.findIndex(
        prod => prod.id === action.data.id
      );
      const updated = new Product(
        action.data.id,
        state.userProducts[prodIndex].ownerId,
        action.data.title,
        action.data.imageUrl,
        action.data.description,
        state.userProducts[prodIndex].price
      );

      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[prodIndex] = updated;

      const prodAvailableIndex = state.availableProducts.findIndex(
        prod => prod.id === action.data.id
      );

      const updatedProducts = [...state.availableProducts];
      updatedProducts[prodAvailableIndex] = updated;

      return {
        ...state,
        availableProducts: updatedProducts,
        userProducts: updatedUserProducts,
      };
    default:
      break;
  }

  return state;
};
