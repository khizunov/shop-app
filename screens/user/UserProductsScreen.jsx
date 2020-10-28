import React from 'react';
import { FlatList, Platform, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
  const products = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();
  const editProductHandler = id => {
    props.navigation.navigate('EditProduct', { productId: id });
  };

  const deleteHandler = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete ths item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        },
      },
    ]);
  };

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => editProductHandler(itemData.item.id)}
        >
          <Button
            color={Colors.primary}
            title='Edit'
            onPress={() => editProductHandler(itemData.item.id)}
          />
          <Button
            color={Colors.primary}
            title='Delete'
            onPress={() => deleteHandler(itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

UserProductsScreen.navigationOptions = data => {
  return {
    title: 'Your Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            data.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Add'
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            data.navigation.navigate('EditProduct');
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default UserProductsScreen;
