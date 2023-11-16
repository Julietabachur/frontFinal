import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGINATED_DATA":
      return {
        ...state,
        paginatedData: action.payload.content,
        currentPage: action.payload.current,
        totalPages: action.payload.last,
        totalElements: action.payload.totalElements,
      };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_START_DATE":
      return { ...state, startDate: action.payload };
    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "SET_PRODUCT_NAME":
      return { ...state, productName: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
};

const initialState = {
  paginatedData: [],
  currentPage: 1,
  totalPages: 1,
  totalElements: 0,
  categories: [],
  startDate: "",
  endDate: "",
  productName: "",
  searchResults: [],
};

const ProductContext = createContext(undefined);

const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Setea la fecha inicial en la del día
  useEffect(() => {

    setStartDate(getCurrentDate());
  }, []);

  const setSearchResults = (data) => {
    dispatch({ type: "SET_SEARCH_RESULTS", payload: data });
  };
  const setStartDate = (date) => {
    dispatch({ type: "SET_START_DATE", payload: date });
  };
  const setEndDate = (date) => {
    dispatch({ type: "SET_END_DATE", payload: date });
  };
  const setPaginatedData = (data) => {
    dispatch({ type: "SET_PAGINATED_DATA", payload: data });
  };
  const setProductName = (data) => {
    dispatch({ type: "SET_PRODUCT_NAME", payload: data.toUpperCase() });
  };

  const setCurrentPage = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
    if (state.categories.length === 0) {
      getProducts(page);
    } else if (state.categories.length > 0) {
      getProductsByType(state.categories, page);
    }
  };

  const setCategories = (data) => {
    dispatch({ type: "SET_CATEGORIES", payload: data });
  };

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setPaginatedData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsByType = async (categories) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/category?categories=${categories}&page=${state.currentPage}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setPaginatedData(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (state.categories.length === 0) {
      getProducts();
    }
  }, [state.categories]);

  const value = {
    paginatedData: state.paginatedData,
    totalPages: state.totalPages,
    totalElements: state.totalElements,
    currentPage: state.currentPage,
    categories: state.categories,
    startDate: state.startDate,
    endDate: state.endDate,
    productName: state.productName,
    searchResults: state.searchResults,
    getProducts,
    setCurrentPage,
    setCategories,
    setPaginatedData,
    getProductsByType,
    setEndDate,
    setStartDate,
    setSearchResults,
    setProductName,

    // Otros valores o funciones que puedas necesitar
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

const useProductContext = () => {
  const context = useContext(ProductContext);

  return context;
};

export { ProductProvider, useProductContext };
