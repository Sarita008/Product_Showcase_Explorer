import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { LOADING_STATES, PRODUCTS_PER_PAGE } from '@utils/constants';
import { getLocalStorage, setLocalStorage } from '@utils/helpers';

// Initial state
const initialState = {
  // Products state
  products: [],
  featuredProducts: [],
  currentProduct: null,
  totalProducts: 0,
  
  // Categories state
  categories: [],
  
  // UI state
  loading: LOADING_STATES.IDLE,
  error: null,
  
  // Filter and search state
  filters: {
    category: 'all',
    sortBy: 'title-asc',
    searchTerm: '',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0
  },
  
  // Pagination state
  pagination: {
    currentPage: 1,
    itemsPerPage: PRODUCTS_PER_PAGE,
    totalPages: 1
  },
  
  // Modal state
  modals: {
    productDetail: {
      isOpen: false,
      productId: null
    },
    filters: {
      isOpen: false
    }
  },
  
  // User preferences (stored in localStorage)
  preferences: {
    theme: 'light',
    gridView: true,
    animationsEnabled: true
  },
  
  // App state
  isInitialized: false
};

// Action types
const ActionTypes = {
  // Loading actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Products actions
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_FEATURED_PRODUCTS: 'SET_FEATURED_PRODUCTS',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  ADD_PRODUCTS: 'ADD_PRODUCTS',
  
  // Categories actions
  SET_CATEGORIES: 'SET_CATEGORIES',
  
  // Filter actions
  SET_FILTER: 'SET_FILTER',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  
  // Pagination actions
  SET_PAGINATION: 'SET_PAGINATION',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  
  // Modal actions
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
  
  // Preferences actions
  SET_PREFERENCE: 'SET_PREFERENCE',
  SET_PREFERENCES: 'SET_PREFERENCES',
  
  // App actions
  INITIALIZE_APP: 'INITIALIZE_APP'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload === LOADING_STATES.LOADING ? null : state.error
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: LOADING_STATES.ERROR
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        loading: state.loading === LOADING_STATES.ERROR ? LOADING_STATES.IDLE : state.loading
      };
      
    case ActionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        totalProducts: action.payload.total,
        loading: LOADING_STATES.SUCCESS
      };
      
    case ActionTypes.ADD_PRODUCTS:
      return {
        ...state,
        products: [...state.products, ...action.payload.products],
        totalProducts: action.payload.total
      };
      
    case ActionTypes.SET_FEATURED_PRODUCTS:
      return {
        ...state,
        featuredProducts: action.payload
      };
      
    case ActionTypes.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload
      };
      
    case ActionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
      
    case ActionTypes.SET_FILTER:
      const newFilters = {
        ...state.filters,
        [action.payload.key]: action.payload.value
      };
      return {
        ...state,
        filters: newFilters,
        pagination: {
          ...state.pagination,
          currentPage: 1 // Reset to first page when filters change
        }
      };
      
    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        pagination: {
          ...state.pagination,
          currentPage: 1
        }
      };
      
    case ActionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
        pagination: {
          ...state.pagination,
          currentPage: 1
        }
      };
      
    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };
      
    case ActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          currentPage: action.payload
        }
      };
      
    case ActionTypes.OPEN_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: {
            isOpen: true,
            ...action.payload.data
          }
        }
      };
      
    case ActionTypes.CLOSE_MODAL:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload]: {
            ...state.modals[action.payload],
            isOpen: false
          }
        }
      };
      
    case ActionTypes.TOGGLE_MODAL:
      const currentModal = state.modals[action.payload.modal];
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: {
            ...currentModal,
            isOpen: !currentModal.isOpen,
            ...action.payload.data
          }
        }
      };
      
    case ActionTypes.SET_PREFERENCE:
      const newPreferences = {
        ...state.preferences,
        [action.payload.key]: action.payload.value
      };
      // Save to localStorage
      setLocalStorage('user-preferences', newPreferences);
      return {
        ...state,
        preferences: newPreferences
      };
      
    case ActionTypes.SET_PREFERENCES:
      setLocalStorage('user-preferences', action.payload);
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
      
    case ActionTypes.INITIALIZE_APP:
      return {
        ...state,
        isInitialized: true,
        preferences: {
          ...state.preferences,
          ...action.payload.preferences
        }
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Custom hook to use context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app with stored preferences
  useEffect(() => {
    const storedPreferences = getLocalStorage('user-preferences', {});
    dispatch({
      type: ActionTypes.INITIALIZE_APP,
      payload: { preferences: storedPreferences }
    });
  }, []);

  // Action creators
  const actions = {
    // Loading actions
    setLoading: (status) => dispatch({ type: ActionTypes.SET_LOADING, payload: status }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    
    // Products actions
    setProducts: (products, total = 0) => dispatch({
      type: ActionTypes.SET_PRODUCTS,
      payload: { products, total }
    }),
    addProducts: (products, total = 0) => dispatch({
      type: ActionTypes.ADD_PRODUCTS,
      payload: { products, total }
    }),
    setFeaturedProducts: (products) => dispatch({
      type: ActionTypes.SET_FEATURED_PRODUCTS,
      payload: products
    }),
    setCurrentProduct: (product) => dispatch({
      type: ActionTypes.SET_CURRENT_PRODUCT,
      payload: product
    }),
    
    // Categories actions
    setCategories: (categories) => dispatch({
      type: ActionTypes.SET_CATEGORIES,
      payload: categories
    }),
    
    // Filter actions
    setFilter: (key, value) => dispatch({
      type: ActionTypes.SET_FILTER,
      payload: { key, value }
    }),
    setFilters: (filters) => dispatch({
      type: ActionTypes.SET_FILTERS,
      payload: filters
    }),
    resetFilters: () => dispatch({ type: ActionTypes.RESET_FILTERS }),
    
    // Pagination actions
    setPagination: (pagination) => dispatch({
      type: ActionTypes.SET_PAGINATION,
      payload: pagination
    }),
    setCurrentPage: (page) => dispatch({
      type: ActionTypes.SET_CURRENT_PAGE,
      payload: page
    }),
    
    // Modal actions
    openModal: (modal, data = {}) => dispatch({
      type: ActionTypes.OPEN_MODAL,
      payload: { modal, data }
    }),
    closeModal: (modal) => dispatch({
      type: ActionTypes.CLOSE_MODAL,
      payload: modal
    }),
    toggleModal: (modal, data = {}) => dispatch({
      type: ActionTypes.TOGGLE_MODAL,
      payload: { modal, data }
    }),
    
    // Preferences actions
    setPreference: (key, value) => dispatch({
      type: ActionTypes.SET_PREFERENCE,
      payload: { key, value }
    }),
    setPreferences: (preferences) => dispatch({
      type: ActionTypes.SET_PREFERENCES,
      payload: preferences
    })
  };

  // Computed values
  const computed = {
    isLoading: state.loading === LOADING_STATES.LOADING,
    hasError: state.loading === LOADING_STATES.ERROR && state.error !== null,
    hasProducts: state.products.length > 0,
    filteredProductsCount: state.products.length,
    currentPageProducts: state.products.slice(
      (state.pagination.currentPage - 1) * state.pagination.itemsPerPage,
      state.pagination.currentPage * state.pagination.itemsPerPage
    ),
    totalPages: Math.ceil(state.totalProducts / state.pagination.itemsPerPage),
    hasNextPage: state.pagination.currentPage < Math.ceil(state.totalProducts / state.pagination.itemsPerPage),
    hasPrevPage: state.pagination.currentPage > 1
  };

  const value = {
    ...state,
    ...actions,
    computed
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { ActionTypes };
export default AppContext;