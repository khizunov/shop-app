import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as cartActions from '../../store/actions/cart';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as orderActions from '../../store/actions/order';
import Card from '../../components/UI/Card';

const CartScreen = props => {
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const items = useSelector(state => {
    const transformed = [];
    for (const key in state.cart.items) {
      console.log(key);
      transformed.push({
        id: key,
        title: state.cart.items[key].title,
        price: state.cart.items[key].price,
        quantity: state.cart.items[key].quantity,
        amount: state.cart.items[key].totalAmount,
      });
    }
    return transformed.sort((a, b) => (a.id > b.id ? 1 : -1));
  });

  const dispatch = useDispatch();

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{' '}
          <Text style={styles.amount}>
            ${Math.round(totalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        <Button
          color={Colors.accent}
          title='Order Now'
          disabled={items.length === 0}
          onPress={() => {
            dispatch(orderActions.addOrder(items, totalAmount));
          }}
        />
      </Card>
      <FlatList
        data={items}
        keyExtractor={data => data.id}
        renderItem={data => (
          <CartItem
            quantity={data.item.quantity}
            title={data.item.title}
            amount={data.item.amount}
            deletable={true}
            onRemove={() => {
              dispatch(cartActions.removeFromCart(data.item.id));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  title: 'Your Cart',
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;
