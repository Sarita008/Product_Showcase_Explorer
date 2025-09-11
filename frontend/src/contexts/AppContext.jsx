import { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Initial state
const initialState = {
  // Cart
  cartItems: [],
  cartTotal: 0,
  cartCount: 0,
  
  // Favorites
  favorites: [],
  favoriteCount: 0,
  
  // UI State
  isLoading: false,
  error: null,
  
  // Filters
  filters: {
    category: 'all',
    search: '',
    sortBy: 'title',
    sortOrder: 'asc',
    priceRange: [0, 1000],
  },
  
  // View preferences
  viewMode: 'grid', // 'grid' | 'list'
  
  // Product modal
  selectedProduct: null,
  isProductModalOpen: false,
};

// Action types
export const ActionTypes = {
  // Cart actions
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_ITEM: 'UPDATE_CART_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  
  // Favorites actions
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Filter actions
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  
  // View actions
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  
  // Product modal actions
  OPEN_PRODUCT_MODAL: 'OPEN_PRODUCT_MODAL',
  CLOSE_PRODUCT_MODAL: 'CLOSE_PRODUCT_MODAL',
  
  // Data hydration
  HYDRATE_STATE: 'HYDRATE_STATE',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TO_CART: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === product.id);
      
      let updatedCartItems;
      if (existingItem) {
        updatedCartItems = state.cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCartItems = [...state.cartItems, { ...product, quantity }];
      }
      
      const cartTotal = updatedCartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      const cartCount = updatedCartItems.reduce((count, item) => 
        count + item.quantity, 0
      );
      
      return {
        ...state,
        cartItems: updatedCartItems,
        cartTotal,
        cartCount,
      };
    }
    
    case ActionTypes.REMOVE_FROM_CART: {
      const productId = action.payload;
      const updatedCartItems = state.cartItems.filter(item => item.id !== productId);
      
      const cartTotal = updatedCartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      const cartCount = updatedCartItems.reduce((count, item) => 
        count + item.quantity, 0
      );
      
      return {
        ...state,
        cartItems: updatedCartItems,
        cartTotal,
        cartCount,
      };
    }
    
    case ActionTypes.UPDATE_CART_ITEM: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return appReducer(state, { type: ActionTypes.REMOVE_FROM_CART, payload: productId });
      }
      
      const updatedCartItems = state.cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      const cartTotal = updatedCartItems.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );
      const cartCount = updatedCartItems.reduce((count, item) => 
        count + item.quantity, 0
      );
      
      return {
        ...state,
        cartItems: updatedCartItems,
        cartTotal,
        cartCount,
      };
    }
    
    case ActionTypes.CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        cartTotal: 0,
        cartCount: 0,
      };
    
    case ActionTypes.TOGGLE_FAVORITE: {
      const product = action.payload;
      const isFavorite = state.favorites.some(fav => fav.id === product.id);
      
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = state.favorites.filter(fav => fav.id !== product.id);
      } else {
        updatedFavorites = [...state.favorites, product];
      }
      
      return {
        ...state,
        favorites: updatedFavorites,
        favoriteCount: updatedFavorites.length,
      };
    }
    
    case ActionTypes.CLEAR_FAVORITES:
      return {
        ...state,
        favorites: [],
        favoriteCount: 0,
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    
    case ActionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
      };
    
    case ActionTypes.SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload,
      };
    
    case ActionTypes.OPEN_PRODUCT_MODAL:
      return {
        ...state,
        selectedProduct: action.payload,
        isProductModalOpen: true,
      };
    
    case ActionTypes.CLOSE_PRODUCT_MODAL:
      return {
        ...state,
        selectedProduct: null,
        isProductModalOpen: false,
      };
    
    case ActionTypes.HYDRATE_STATE:
      return {
        ...state,
        ...action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [persistedCart, setPersistedCart] = useLocalStorage('producthub_cart', []);
  const [persistedFavorites, setPersistedFavorites] = useLocalStorage('producthub_favorites', []);
  const [persistedViewMode, setPersistedViewMode] = useLocalStorage('producthub_viewmode', 'grid');

  // Hydrate state from localStorage on mount
  useEffect(() => {
    const cartTotal = persistedCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = persistedCart.reduce((count, item) => count + item.quantity, 0);
    
    dispatch({
      type: ActionTypes.HYDRATE_STATE,
      payload: {
        cartItems: persistedCart,
        cartTotal,
        cartCount,
        favorites: persistedFavorites,
        favoriteCount: persistedFavorites.length,
        viewMode: persistedViewMode,
      }
    });
  }, [persistedCart, persistedFavorites, persistedViewMode]);

  // Persist cart changes
  useEffect(() => {
    setPersistedCart(state.cartItems);
  }, [state.cartItems, setPersistedCart]);

  // Persist favorites changes
  useEffect(() => {
    setPersistedFavorites(state.favorites);
  }, [state.favorites, setPersistedFavorites]);

  // Persist view mode changes
  useEffect(() => {
    setPersistedViewMode(state.viewMode);
  }, [state.viewMode, setPersistedViewMode]);

  // Action creators
  const actions = {
    // Cart actions
    addToCart: (product, quantity = 1) => {
      dispatch({ type: ActionTypes.ADD_TO_CART, payload: { product, quantity } });
    },
    
    removeFromCart: (productId) => {
      dispatch({ type: ActionTypes.REMOVE_FROM_CART, payload: productId });
    },
    
    updateCartItem: (productId, quantity) => {
      dispatch({ type: ActionTypes.UPDATE_CART_ITEM, payload: { productId, quantity } });
    },
    
    clearCart: () => {
      dispatch({ type: ActionTypes.CLEAR_CART });
    },
    
    // Favorites actions
    toggleFavorite: (product) => {
      dispatch({ type: ActionTypes.TOGGLE_FAVORITE, payload: product });
    },
    
    clearFavorites: () => {
      dispatch({ type: ActionTypes.CLEAR_FAVORITES });
    },
    
    // UI actions
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },
    
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },
    
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },
    
    // Filter actions
    setFilters: (filters) => {
      dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
    },
    
    resetFilters: () => {
      dispatch({ type: ActionTypes.RESET_FILTERS });
    },
    
    // View actions
    setViewMode: (mode) => {
      dispatch({ type: ActionTypes.SET_VIEW_MODE, payload: mode });
    },
    
    // Product modal actions
    openProductModal: (product) => {
      dispatch({ type: ActionTypes.OPEN_PRODUCT_MODAL, payload: product });
    },
    
    closeProductModal: () => {
      dispatch({ type: ActionTypes.CLOSE_PRODUCT_MODAL });
    },
  };

  // Computed values
  const computedState = {
    ...state,
    // Helper functions
    isInCart: (productId) => state.cartItems.some(item => item.id === productId),
    isFavorite: (productId) => state.favorites.some(item => item.id === productId),
    getCartItem: (productId) => state.cartItems.find(item => item.id === productId),
  };

  const value = {
    state: computedState,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;