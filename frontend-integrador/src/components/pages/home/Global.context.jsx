import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGINATED_DATA":
      return {
        ...state,
        paginatedData: action.payload.content,
        currentPage: action.payload.number + 1,
        totalPages: action.payload.last,
        totalElements: action.payload.totalElements,
      };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};

const initialState = {
  paginatedData: [],
  currentPage: 1,
  totalPages: 1,
  totalElements: 0,
};

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const setPaginatedData = (data) => {
    dispatch({ type: "SET_PAGINATED_DATA", payload: data });
  };

  const setCurrentPage = (page) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
    getProducts(page);
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

  useEffect(() => {
    getProducts();
  }, []);

  const value = {
    paginatedData: state.paginatedData,
    totalPages: state.totalPages,
    totalElements: state.totalElements,
    currentPage: state.currentPage,
    getProducts,
    setCurrentPage,
    // Otros valores o funciones que puedas necesitar
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error(
      "useProductContext debe ser utilizado dentro de un ProductProvider"
    );
  }
  return context;
};

export { ProductProvider, useProductContext };
