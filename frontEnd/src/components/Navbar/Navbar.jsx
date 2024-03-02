import React from "react";
import {
  Box,
  Image,
  Text,
  Button,
  Flex,
  Spacer,
  Link,
  IconButton,
  useColorModeValue,
  useColorMode,
  useToast, // Add this line
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios"; // Add this line
import { useNavigate } from "react-router-dom"; // Add this line

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function Navbar({ firstName }) {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue("black", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.200", "gray.700");
  const imageUrl = sessionStorage.getItem("userImage");
  const navigate = useNavigate(); // Add this line
  const toast = useToast(); // Add this line

  const handleLogout = () => {
    const csrftoken = getCookie('csrftoken');  // Get the CSRF token

    axios
      .post(
        "http://localhost:8000/accounts/logout",
        {},
        { 
            withCredentials: true,
            headers: {
                'X-CSRFToken': csrftoken  // Include the CSRF token in the header
            }
        }
      )
      .then((response) => {
        if (response.data.detail === "Logged out") {
          sessionStorage.clear();
          toast({
            title: "Logged out.",
            description: "You have been logged out.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
      });
};


  return (
    <Box bg={bgColor} px={4} py={2} mb={1}>
      <Flex alignItems="center">
        <Image
          src={imageUrl}
          boxSize="40px"
          rounded="full"
          mr={4}
          border="2px"
          borderColor={borderColor}
        />
        <Text
          fontSize="lg"
          fontWeight="bold"
          color={textColor}
        >{`Welcome, ${firstName}`}</Text>
        <Spacer />
        <IconButton
          leftIcon={<FaSignOutAlt />}
          variant="ghost"
          color="white"
          aria-label="Logout"
          onClick={handleLogout}
        >
          Logout
        </IconButton>
      </Flex>
    </Box>
  );
}

export default Navbar;
