import React, { useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Input from '../../components/UI/Input';
import * as productActions from '../../store/actions/products';

const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };

    let formIsValid = true;

    for (const key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }

    return {
      formIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }

  return state;
};

const EditProductScreen = props => {
  const prodId = props.navigation.getParam('productId');
  const edited = useSelector(state => {
    return state.products.userProducts.find(prod => prod.id === prodId);
  });
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: edited ? edited.title : '',
      imageUrl: edited ? edited.imageUrl : '',
      description: edited ? edited.description : '',
      price: '',
    },
    inputValidities: {
      title: edited ? true : false,
      imageUrl: edited ? true : false,
      description: edited ? true : false,
      price: edited ? true : false,
    },
    formIsValid: edited ? true : false,
  });

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form', [
        { text: 'Okay' },
      ]);
      return;
    }

    if (edited) {
      dispatch(
        productActions.updateProduct(
          prodId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl
        )
      );
    } else {
      dispatch(
        productActions.createProduct(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          +formState.inputValues.price
        )
      );
    }

    props.navigation.goBack();
  }, [dispatch, edited, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputId, value, isValid) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value,
        isValid,
        input: inputId,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id='title'
            label='Title'
            errorText='Please enter a valid title!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            returnKeyType='next'
            initialValue={edited ? edited.title : ''}
            initiallyValid={!!edited}
            required
            onInputChange={inputChangeHandler}
          />
          <Input
            id='imageUrl'
            label='Image URL'
            errorText='Please enter a valid image URL!'
            keyboardType='default'
            autoCapitalize='sentences'
            returnKeyType='next'
            initialValue={edited ? edited.imageUrl : ''}
            initiallyValid={!!edited}
            required
            onInputChange={inputChangeHandler}
          />
          {edited ? null : (
            <Input
              id='price'
              label='Price'
              errorText='Please enter a valid price!'
              keyboardType='decimal-pad'
              returnKeyType='next'
              required
              min={0.1}
              onInputChange={inputChangeHandler}
            />
          )}
          <Input
            id='description'
            label='Description'
            errorText='Please enter a valid description!'
            keyboardType='default'
            autoCapitalize='sentences'
            returnKeyType='done'
            multiline
            numberOfLines={3}
            initialValue={edited ? edited.description : ''}
            initiallyValid={!!edited}
            required
            minLength={5}
            onInputChange={inputChangeHandler}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = data => {
  const submit = data.navigation.getParam('submit');
  return {
    title: data.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Save'
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submit}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
});

export default EditProductScreen;
