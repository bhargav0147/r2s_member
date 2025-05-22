import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'src/routes/hooks';

import { getStorage, useLocalStorage } from 'src/hooks/use-local-storage';

import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { CheckoutContext } from './checkout-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'checkout';

const initialState = {
  activeStep: 0,
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
};

export function CheckoutProvider({ children }) {
  const router = useRouter();

  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState);

  const [checked, setChecked] = useState(false);

  const handleCheckChange = (event) => {
    setChecked(event.target.checked);
  };

  const onGetCart = useCallback(() => {
    const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

    const subTotal = state.items.reduce((total, item) => total + item.quantity * item.price, 0);
    // Hypothetical shipping fee recalculation
    // Initialize a new shipping fee variable
    let newShippingFee = 0;
    // Example logic: Sum shipping fees from unique business IDs
    const uniqueBusinessIds = new Set(state.items.map(item => item.bussiness_id));
    uniqueBusinessIds.forEach(businessId => {
      const item = state.items.find(product => product.bussiness_id === businessId);
      if (item) {
        newShippingFee += Number(item.shippingFee) || 0;
      }
    });
    update('subTotal', subTotal);
    update('totalItems', totalItems);
    update('billing', state.activeStep === 1 ? null : state.billing);
    update('discount', state.items.length ? state.discount : 0);
    // Update the shipping fee based on the new calculation
    update('shipping', state.items.length ? newShippingFee : 0);
    update('total', Number(state.subTotal) - Number(state.discount) + Number(newShippingFee));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.items,
    state.activeStep,
    state.billing,
    state.discount,
    state.shipping,
    state.subTotal,
  ]);

  useEffect(() => {
    const restored = getStorage(STORAGE_KEY);

    if (restored) {
      onGetCart();
    }
  }, [onGetCart]);

  const onAddToCart = useCallback(
    (newItem) => {
      let newShippingFee = state.shipping;
      // Check if the cart already contains an item from the same business
      const isBusinessPresent = state.items.some((item) => item.bussiness_id === newItem.bussiness_id);

      if (!isBusinessPresent && newItem.shippingFee) {
        newShippingFee += newItem.shippingFee;
      }

      const updatedItems = state.items.map((item) => {
        if (item.id === newItem.id) {
          return {
            ...item,
          };
        }
        return item;
      });

      if (!updatedItems.some((item) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      update('items', updatedItems);
      update('shipping', newShippingFee);
    },
    [update, state.items, state.shipping]
  );

  const onDeleteCart = useCallback(
    (itemId) => {

      // Identify the item to be deleted and its business_id
      const itemToDelete = state.items.find((item) => item.id === itemId);
      const businessIdOfDeletedItem = itemToDelete ? itemToDelete.bussiness_id : null;
      const shippingFeeOfDeletedItem = itemToDelete ? itemToDelete.shippingFee : 0;

      const updatedItems = state.items.filter((item) => item.id !== itemId);

      // Check if any other items from the same business remain in the cart
      const isOtherItemFromSameBusiness = updatedItems.some((item) => item.bussiness_id === businessIdOfDeletedItem);

      // Adjust the shipping fee
      let newShippingFee = state.shipping;
      if (!isOtherItemFromSameBusiness && businessIdOfDeletedItem !== null) {
        newShippingFee -= shippingFeeOfDeletedItem;
      }
      // Update the state with new items and adjusted shipping fee
      update('items', updatedItems);
      update('shipping', newShippingFee);
    },
    [update, state.items, state.shipping]
  );

  const onBackStep = useCallback(() => {
    update('activeStep', state.activeStep - 1);
  }, [update, state.activeStep]);

  const onNextStep = useCallback(() => {
    update('activeStep', state.activeStep + 1);
  }, [update, state.activeStep]);

  const onGotoStep = useCallback(
    (step) => {
      update('activeStep', step);
    },
    [update]
  );

  const onIncreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onDecreaseQuantity = useCallback(
    (itemId) => {
      const updatedItems = state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });

      update('items', updatedItems);
    },
    [update, state.items]
  );

  const onCreateBilling = useCallback(
    (address) => {
      update('billing', address);

      onNextStep();
    },
    [onNextStep, update]
  );

  const onApplyDiscount = useCallback(
    (discount) => {
      update('discount', discount);
    },
    [update]
  );

  const onApplyShipping = useCallback(
    (shipping) => {
      update('shipping', shipping);
    },
    [update]
  );

  const completed = state.activeStep === PRODUCT_CHECKOUT_STEPS.length;



  // Reset
  const onReset = useCallback(() => {
    // if (completed) {
    reset();
    // router.replace('/find-product');
    // }
  }, [completed, reset, router]);




  const memoizedValue = useMemo(
    () => ({
      ...state,
      completed,
      //
      checked,
      handleCheckChange,
      //
      onAddToCart,
      onDeleteCart,
      //
      onIncreaseQuantity,
      onDecreaseQuantity,
      //
      onCreateBilling,
      onApplyDiscount,
      onApplyShipping,
      //
      onBackStep,
      onNextStep,
      onGotoStep,
      //
      onReset,
    }),
    [
      completed,
      onAddToCart,
      onApplyDiscount,
      onApplyShipping,
      onBackStep,
      onCreateBilling,
      onDecreaseQuantity,
      onDeleteCart,
      onGotoStep,
      onIncreaseQuantity,
      onNextStep,
      onReset,
      state,
      checked,
      handleCheckChange,
    ]
  );

  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
}

CheckoutProvider.propTypes = {
  children: PropTypes.node,
};
