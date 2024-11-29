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
    case "SET_PAGINATED_DATA_BY_SEASON":
      return {
        ...state,
        paginatedDataBySeason: action.payload.content,
        currentPage: action.payload.current,
        totalPages: action.payload.last,
        totalElements: action.payload.totalElements,
      };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_SEASON":
      return { ...state, season: action.payload };
    case "SET_SALE":
      return { ...state, sale: action.payload };
    case "SET_SALE_LIST":
      return { ...state, saleList: action.payload };
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
    case "SET_SHOW_FAV":
      return { ...state, showFav: action.payload };
    case "SET_RESERVE":
      return { ...state, reserves: action.payload };
    case "SET_RESERVATION":
      return { ...state, reservation: action.payload };
    case "SET_BANDERA":
      return { ...state, banderaReservas: action.payload };
    case "SET_IS_SIGN_IN":
      return { ...state, isSignIn: action.payload };
    case "SET_TITULO":
      return { ...state, titulo: action.payload };
    case "SET_CARRITO":
      return { ...state, carrito: action.payload };
    case "SET_SIZE":
      return { ...state, size: action.payload };
    case "SET_IS_FILTERED_BY_CATEGORY":
      return { ...state, isFilteredByCategory: action.payload };
    case "SET_CATEGORY_ADDED":
      return { ...state, categoryAdded: action.payload };
    case "SET_ADD_PRODUCT_SUCCESSFUL":
      return { ...state, addProductSuccessful: action.payload };
    default:
      return state;
  }
};
// Estado inicial del contexto global
const initialState = {
  titulo:'',
  paginatedData: [],
  season: 'Primavera',
  paginatedDataBySeason:[],
  isFilteredByCategory: false,
  currentPage: 1,
  totalPages: 1,
  totalElements: 0,
  categories: [],
  sale:{
    id: '',
    productList: [],
    idUser: '',
    entrega: '',
    domicilio: '',
    medioDePago: '',
    totalPrice: 0,//lo tuve que cambiar porque en la bd esta asi
    saleDate: null
  },
  saleList: [],
  startDate: "",
  endDate: "",
  productName: "",
  addProductSuccessful:false,
  carrito:{
    id: null, // o un valor generado automáticamente
    idUser: null, // asignar un idUser si está disponible
    products: [],
    totalPrice: null, // precio total inicial
  },
  size:'',
  searchResults: [],
  favorites: [],
  showFav: false,
  clientId: "",
  reserves: [],
  reservation: "",
  banderaReservas: false,
  isSignIn: false,
  productsFilterBAr: [],
  categoryAdded: false,
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
  const setTitulo = (data) => {
    dispatch({ type: "SET_TITULO", payload: data });
  };
  const setSale = (data) => {
    dispatch({ type: "SET_SALE", payload: data });
  };
  const setSaleList = (data) => {
    dispatch({ type: "SET_SALE_LIST", payload: data });
  };
  const setIsSignIn = (data) => {
    dispatch({ type: "SET_IS_SIGN_IN", payload: data });
  };
  const setIsFilteredByCategory = (data) => {
    dispatch({ type: "SET_IS_FILTERED_BY_CATEGORY", payload: data });
  };
  const setReserves = (data) => {
    dispatch({ type: "SET_RESERVE", payload: data });
  };
  const setStartDate = (date) => {
    dispatch({ type: "SET_START_DATE", payload: date });
  };
  const setEndDate = (date) => {
    dispatch({ type: "SET_END_DATE", payload: date });
  };
  const setSeason = (data) => {
    dispatch({ type: "SET_SEASON", payload: data });
  };
  const setPaginatedDataBySeason = (data) => {
    dispatch({ type: "SET_PAGINATED_DATA_BY_SEASON", payload: data });
  };
  const setPaginatedData = (data) => {
    dispatch({ type: "SET_PAGINATED_DATA", payload: data });
  };
  const setProductName = (data) => {
    dispatch({ type: "SET_PRODUCT_NAME", payload: data.toUpperCase() });
  };
  const setShowFav = (data) => {
    dispatch({ type: "SET_SHOW_FAV", payload: data });
  };
  const setReservation = (data) => {
    dispatch({ type: "SET_RESERVATION", payload: data });
  };

  const setCurrentPage = (page) => {
    debugger
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
    if(state.season != '' && !state.showFav && !state.isFilteredByCategory){
      getProductsBySeason(page)
    }else if(  state.categories.length === 0 && !state.showFav && state.season == '' ) {
      getProducts(page);
    } else if (state.categories.length == 1 && !state.showFav) {
      getProductsByType(state.categories, page);
    } else if  (state.categories.length > 1 && !state.showFav) {
      getProductsByTypeFilterBar(state.categories, page);
    } else if (state.favorites.length > 0 && state.showFav) {
      getFavorites(page);
    }
  };

  const setBanderaReservas = (data) => {
    dispatch({ type: "SET_BANDERA", payload: data });
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
  const setCarrito = (data) => {
    dispatch({ type: "SET_CARRITO", payload: data });
  };
  const setSize = (data) => {
    dispatch({ type: "SET_SIZE", payload: data });
  };
  const setCategoryAdded = (data) => {
    dispatch({ type: "SET_CATEGORY_ADDED", payload: data });
  };
  const setAddProductSuccessful = (data) => {
    dispatch({ type: "SET_ADD_PRODUCT_SUCCESSFUL", payload: data });
  };

  const getCarrito = async ()=>{
    debugger
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/private/car/${state.clientId}`,       
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.products?.length > 0) {     
        console.log('get carrito: ', response.data);           
        setCarrito(response.data);
      }
    } catch (error) {
      console.log("error con getCarrito", error);
    }
  }

  const saveCarrito = async (carrito)=>{
    debugger
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/private/car`,  
        carrito,  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );     
      if (response) {
        console.log('carrito guardado: ', response.data);      
        setCarrito(response.data)
        setAddProductSuccessful(true)
      }
    } catch (error) {
      console.log("error con saveCarrito", error);
    }
  }

  const updateCarrito = async (updatedCarrito)=>{
    debugger
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/private/car`,            
          updatedCarrito,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );   
      if (response) {
        console.log('carrito actualizado: ', response.data);
        setCarrito(response.data)  
        setAddProductSuccessful(true)
      }
    } catch (error) {
      console.log("error con updateCarrito", error);
    }
  }

  const deleteCarrito = async (id)=>{
    debugger
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/private/car/${id}`,            
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );     
      console.log('carrito eliminado: ', response);      
      setCarrito({
        id: null, // o un valor generado automáticamente
        idUser: null, // asignar un idUser si está disponible
        products: [],
        totalPrice: 0, // precio total inicial
      })
    } catch (error) {
      console.log("error con deleteCarrito", error);
    }
  }

  const saveSale = async (sale)=>{
    debugger
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/private/sales`,  
        state.sale,  
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );     
      if (response) {
        console.log('Venta guardada: ', response.data);      
        deleteCarrito(state.carrito.id)
      }
    } catch (error) {
      console.log("error con saveSale", error);
    }
  }

  const getSales = async ()=>{
    debugger
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/private/sales`,          
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );     
      if (response.data) {
        console.log('Traigo todas las ventas: ', response.data);    
        setSale(response.data)  
      }
    } catch (error) {
      console.log("error con getSales", error);
    }
  }

  const getSale = async (id)=>{
    debugger
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/private/sales/${id}`,          
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );     
      if (response.data) {
        console.log('Traigo 1 venta: ', response.data);   
        setSale(response.data)   
      }
    } catch (error) {
      console.log("error con getSale", error);
    }
  }
  


  // useEffect(() => {
  //   if(state.carrito.length > 0){
  //     updateCarrito()
  //   } else {
  //     saveCarrito()     
  //   }
  // }, [state.carrito])
  

  const getProducts = async (page = 1) => {
    debugger
    setSeason('')
    if(state.showFav && state.favorites.length === 0){
      setTitulo('Tu lista de favoritos está vacía. Echale un vistazo a nuestros productos')
    }else{
      setTitulo('Todos nuestros productos')
    }

    // setShowFav(false)
    setPaginatedDataBySeason([])
    setIsFilteredByCategory(true)
    if (state.categories.length >0) {
      setCategories([])      
    }

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
        let data = response.data       
        setPaginatedData(data);

      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsByType = async (categories, page = 1) => {
    debugger
    setPaginatedDataBySeason([])
    setSeason('')
    setShowFav(false)

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/category?categories=${categories}&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {

        setPaginatedData(response.data);
        setIsFilteredByCategory(true)
        setTitulo(`Categoría: ${categories}`)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsBySeason = async (page = 1) => {
    //debugger
    const validPage = isNaN(page) || page <= 0 ? 1 : page; 
    setPaginatedData([])  
    setTitulo('')
    setIsFilteredByCategory(false)          
    setShowFav(false)
      if(state.categories.length > 0 || state.isFilteredByCategory){
        setCategories([])
        setIsFilteredByCategory(false)
      }
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/searchBySeason?season=${state.season}&page=${validPage}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        console.log('Productos segun temporada', response.data);   
        setTimeout(() => {
          setPaginatedDataBySeason(response.data); // setear productor por temp después de un pequeño retraso
        }, 500); // 100ms de retraso        
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsByTypeFilterBar = async (categories, page = 1) => {
    debugger
    if (!categories || categories.length === 0) {
      console.error("Debe proporcionar al menos una categoría.");
      return []; 
    }
    setPaginatedDataBySeason([])
    setShowFav(false)

    var categoriesQuery;
    try {
      if(categories.length > 1){
        categoriesQuery = categories.map(category => `categoryNames=${encodeURIComponent(category)}`).join('&');
      }else {
        return;
      }

      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/categories?${categoriesQuery}&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.content) {
      let data = response.data;
      setPaginatedData(data);
      setIsFilteredByCategory(true)
      setTitulo(`Categorías seleccionadas: ${categories.join(", ")}`)
      console.log(state.titulo);
      
    } else {
      console.warn("No se encontraron productos para las categorías especificadas.");
    }
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return []; 
  }
  };



  const getFavorites = async (page = 1) => {
    try {
      setPaginatedDataBySeason([])
      // setTitulo('')
      setIsFilteredByCategory(false)
      setShowFav(true);
      setTitulo('Mis favoritos')
      const response = await axios.get(
        `${baseUrl}/api/v1/public/products/favorites?productIds=${state.favorites}&page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        
        setPaginatedData(response.data);
      }
    } catch (error) {
      console.log("error con favoritos", error);
    }
  };

  useEffect(() => {
    debugger
    if (state.season != '' && state.categories.length === 0) {
      getProductsBySeason();
    } else if (state.categories.length === 0) {
      getProducts(); // Solo ejecuta esto si no hay categoría
    } else if (state.categories.length == 1) {
      getProductsByType(state.categories); //filtra por 1 categoria
    }else if(state.categories.length > 1){
      getProductsByTypeFilterBar(state.categories) //filtra por conjunto de categorias
    }
  }, [state.season, state.categories]);


  useEffect(() => {
    if (state.showFav) {
      if (state.favorites.length === 0) {
        // setShowFav(false);
        getProducts();
      } else {
        getFavorites();
      }
    }
  }, [state.favorites, state.showFav]);

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
    paginatedDataBySeason: state.paginatedDataBySeason,
    season: state.season,
    isFilteredByCategory: state.isFilteredByCategory,
    totalPages: state.totalPages,
    totalElements: state.totalElements,
    currentPage: state.currentPage,
    categories: state.categories,
    sale: state.sale,
    saleList: state.saleList,
    startDate: state.startDate,
    endDate: state.endDate,
    productName: state.productName,
    searchResults: state.searchResults,
    favorites: state.favorites,
    clientId: state.clientId,
    addProductSuccessful: state.addProductSuccessful,
    showFav: state.showFav,
    reservation: state.reservation,
    banderaReservas: state.banderaReservas,
    isSignIn:state.isSignIn, 
    titulo: state.titulo,
    carrito:state.carrito,
    size:state.size,
    categoryAdded: state.categoryAdded,
    setCategoryAdded,
    setAddProductSuccessful,
    setCarrito,
    setSale,
    setSaleList,
    setSize,
    setTitulo,
    setIsSignIn,
    setReservation,
    saveSale,
    getSale,
    getSales,
    setShowFav,
    getProducts,
    setCurrentPage,
    getFavorites,
    saveCarrito,
    updateCarrito,
    deleteCarrito,
    getCarrito,
    setCategories,
    setIsFilteredByCategory,
    getProductsBySeason,
    setPaginatedData,
    setSeason,
    setPaginatedDataBySeason,
    getProductsByType,
    getProductsByTypeFilterBar,
    setEndDate,
    setStartDate,
    setSearchResults,
    setProductName,
    setFavorites,
    setClientId,
    setBanderaReservas,
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