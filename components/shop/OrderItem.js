import React, { useState } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import CartItem from './CartItem';
import Card from '../UI/Card';

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${props.amount.toFixed(2)} </Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={showDetails ? 'Hide Details' : 'Show Details'}
        onPress={() => setShowDetails(prevState => !prevState)}
      />
      {showDetails && (
        <View>
          {props.items.map(item => (
            <CartItem
              quantity={item.quantity}
              amount={item.amount}
              title={item.title}
              deletable={false}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  date: {
    fontFamily: 'open-sans',
    fontSize: 16,
    color: '#888',
  },
});

export default OrderItem;
