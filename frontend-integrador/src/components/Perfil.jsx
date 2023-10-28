import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { HStack, Box, VStack, Avatar } from "@chakra-ui/react";

const Perfil = ({ token, username }) => {
  const USER_URL = import.meta.env.VITE_USER_URL;
  const [user, setUser] = useState({});

  const getUser = async (username) => {
    const response = await axios.get(`${USER_URL}username=${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response) {
      setUser(response.data);
    }
  };

  useEffect(() => {
    if (token) {
      getUser(username);
    }
  }, [token]);

  return (
    <HStack>
      <VStack>
        <Avatar name={username} size={"2xl"} />
        <VStack>Lista</VStack>
      </VStack>
      <VStack></VStack>
    </HStack>
  );
};

export default Perfil;
