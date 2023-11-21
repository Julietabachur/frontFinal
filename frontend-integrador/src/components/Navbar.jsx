import { useEffect, useState, useCallback } from "react";
import {
  Button,
  HStack,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "./NavbarMenu";
import { HamburgerIcon, Search2Icon } from "@chakra-ui/icons";


const Navbar = ({ username, setUserName, roles }) => {
  const [media, setMedia] = useState(false);
  const navigate = useNavigate();
  const GETME_URL = import.meta.env.VITE_GETME_URL;
  const MIN_DESKTOP_WIDTH = 768;

  // Efecto para suscribirse al evento de redimensionamiento de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MIN_DESKTOP_WIDTH) {
        setMedia(true);
      } else {
        setMedia(false);
      }
    };
    if (window.innerWidth < MIN_DESKTOP_WIDTH) {
      setMedia(true);
    } else {
      setMedia(false);
    }

    window.addEventListener("resize", handleResize);

    // Limpieza del event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  return (
    <HStack
      bg={"negro"}
      p={10}
      justify={"space-between"}
      position={"fixed"}
      top={0}
      /* minW={400} */
      w={"99vw"}
      h={"100px"}
      zIndex={1000}
    >
      
      {media ? (
        username ? (
          <HStack>
            <Button
            onClick={() => {
            navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
            <HamburgerIcon></HamburgerIcon>
            </Button>
            <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
            <Search2Icon></Search2Icon>
            </Button> 
            <a
            href="/"
            style={{
              textDecoration: "none",
              color: "white",
              marginLeft: "50px",
            }}
            >
            <Image
              src="https://images-g3.s3.amazonaws.com/logoHeader.png"
              alt="Logo"
              style={{
                height: "30px",
              }}
            />
          </a>
          </HStack>
          
        ) :
        <HStack>
          <a
            href="/"
            style={{
              textDecoration: "none",
              color: "white",
              marginRight: "50px",
            }}
          >
            <Image
              src="https://images-g3.s3.amazonaws.com/logoHeader.png"
              alt="Logo"
              style={{
                height: "30px",
              }}
            />
          </a>
        </HStack>        
          
        ) : username? (          
             <HStack>
               <div>
               <a
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                marginRight: "20px",
              }}
              >
              <Image
                src="https://images-g3.s3.amazonaws.com/logoHeader.png"
                alt="Logo"
                style={{
                  height: "30px",
                }}
              />
              </a>
            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                marginRight: "20px",
              }}
            >
              <span
                style={{
                  color: "white",
                }}
              >
                Vestite con estilo
              </span>
              </a>

               </div>
              
            <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">INICIO</Text>
            </Button>
            <Button
            onClick={() => {
              navigate("/login");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
            <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">AYUDA</Text>
            </Button>
            <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">CONTACTO</Text>
            </Button>
            <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
            <Search2Icon></Search2Icon>
            </Button>
          </HStack> 
        ) : (
          <HStack spacing={0}>

            <div>
              <a
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                
              }}
            >
              <Image
                src="https://images-g3.s3.amazonaws.com/logoHeader.png"
                alt="Logo"
                style={{
                  height: "40px",
                  margin: "0px 50px"
                }}
              />
            </a>
            {/*<a
              href="/"
              style={{
                textDecoration: "none",
                color: "white",
                
              }}
            >
              <span
                style={{
                  color: "white",
                  fontFamily: "Saira",
                  fontSize: "11px",
                  marginLeft:"16px"
                }}
              >
                Vestite con estilo
              </span>
              </a>*/}

            </div>
            <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">INICIO</Text>
            </Button>
            <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">CONTACTO</Text>
            
            </Button>
            <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">AYUDA</Text>
            </Button>
             <Button
            onClick={() => {
              navigate("/");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontSize={"14px"}><Search2Icon></Search2Icon></Text>
            </Button>          
          </HStack>
          
          )}
     


      {/**botones o nombre */}
      {media ? (
        username ? (
          <HStack>
          <NavbarMenu username={username} roles={roles} />
          </HStack>
        ) : (
          <HStack>
            <div>
              
            <Menu>
             <MenuButton
            onClick={() => {
              navigate("/");
            }}
            color={"verde2"}
            p={3}
            px={5}
            borderRadius={28}
            border={"1px solid green"}
            colorScheme={"whatsapp"}
            >
            <Text fontSize="14px"><HamburgerIcon></HamburgerIcon></Text>
            </MenuButton>
            <MenuButton
            onClick={() => {
              navigate("/");
            }}
            color={"verde2"}
            p={3}
            px={5}
            borderRadius={28}
            border={"1px solid green"}
            colorScheme={"whatsapp"}
            >
            <Text fontSize={"14px"}><Search2Icon ></Search2Icon></Text>
            </MenuButton>
            <MenuButton
              color={"verde2"}
              p={3}
              px={5}
              borderRadius={28}
              border={"1px solid green"}
              colorScheme={"whatsapp"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">INGRESAR</Text>
            </MenuButton>

            <MenuList 
              bg={"negro"}>
              <MenuItem
                bg={"negro"}
                as="a"
                href="#"
                onClick={() => {
                  navigate("/login");
                }}
              >
                <Text fontFamily={"Saira"} color="verde2" fontWeight="medium" fontSize="10px">INICIAR SESIÓN</Text>
                
              </MenuItem>
              <MenuItem
                bg={"negro"}
                as="a"
                onClick={() => {
                  navigate("/register");
                }}
              >
                <Text fontFamily={"Saira"} color="verde2" fontWeight="medium" fontSize="10px">CREAR CUENTA</Text>
              </MenuItem>
            </MenuList>
            </Menu>
            </div>
          </HStack>
            
        )) : username? (
          
          <HStack>
          <Text mr={3} color={"verde2"} fontSize={20} fontFamily={"saira"}>{username}</Text>
          <NavbarMenu username={username} roles={roles} />
          </HStack>
        ) : (
          <div>
            <Button
            onClick={() => {
              navigate("/login");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">INICIAR SESIÓN</Text>
            </Button>
            <Button
            onClick={() => {
              navigate("/register");
            }}
            colorScheme={"whatsapp"}
            color={"verde2"}
            borderRadius={28}
            variant={"outline"}
            >
              <Text fontFamily={"Saira"} fontWeight="medium" fontSize="14px">CREAR CUENTA</Text>
            </Button>  
        
          </div>
        )
        }
    </HStack>
  );
};

export default Navbar;
