import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { json } from "react-router-dom";

/* Definimos el reductor que gestionará el estado global
...state : Esto crea una copia del estado actual (state) para mantener la inmutabilidad del estado
action.payload: valor que se pasa como argumento cuando se despacha una acción en el reductor*/
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
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    case "SET_CLIENT_ID":
      return { ...state, clientId: action.payload };
    default:
      return state;
  }
};
// Estado inicial del contexto global
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
  favorites: [],
  clientId: "",
};

const ProductContext = createContext(undefined); //useContext

/*Componente ProductProvider que proporciona el contexto global a la aplicación
-state: Esta constante almacena el estado actual de la aplicación. 
Inicialmente, tiene el valor que se proporciona como segundo argumento a useReducer (initialState)
-dispatch es la función que se utiliza para disparar acciones 
que luego son procesadas por (Reducer) para actualizar el estado global de la aplicación.*/
const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
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
      
      getProductsByType(state.categories);
    }
  };

  const setCategories = (data) => {
    dispatch({ type: "SET_CATEGORIES", payload: data });
  };

  const setFavorites = (data) => {
    dispatch({ type: "SET_FAVORITES", payload: data });
  };

  const setClientId = (data) => {
    dispatch({ type: "SET_CLIENT_ID", payload: data });
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
    if (state.categories.length === 0 && state.searchResults.length === 0 && state.favorites.length === 0 ) {
      getProducts();
    }
  }, [state.categories, state.searchResults, state.favorites]);

  //Use Effect para cargar los favoritos en el estado del cliente

  useEffect(() => {
    const setFavoritesToClient = async () => {
      try {
        const response = await axios.put(
          `${baseUrl}/api/v1/private/clients/${state.clientId}`,
          {
            favorites: state.favorites,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        if (error.response) {
          // El servidor devolvió una respuesta con un código de estado diferente de 2xx
          console.error(
            "Error de respuesta del servidor:",
            error.response.data
          );
          console.error("Código de estado:", error.response.status);
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió una respuesta
          console.error("No se recibió respuesta del servidor:", error.request);
        } else {
          // Algo sucedió en la configuración de la solicitud que generó un error
          console.error(
            "Error durante la configuración de la solicitud:",
            error.message
          );
        }
      }
    };
    if (state.favorites?.length > 0) {
      setFavoritesToClient();
    }
  }, [state.favorites]);

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
    favorites: state.favorites,
    clientId: state.clientId,
    getProducts,
    setCurrentPage,
    setCategories,
    setPaginatedData,
    getProductsByType,
    setEndDate,
    setStartDate,
    setSearchResults,
    setProductName,
    setFavorites,
    setClientId,

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
