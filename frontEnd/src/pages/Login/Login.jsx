import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentHome from "../StudentHome/StudentHome";
import ProctorHome from "../ProctorHome/ProctorHome";
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

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


export default function Login(props) {
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(""); // added variable for username
  const [password, setPassword] = useState(""); // added variable for password
  const navigate = useNavigate();
  const handleShowClick = () => setShowPassword(!showPassword);
  const handleUsernameChange = (e) => setUsername(e.target.value); // added function to update username
  const handlePasswordChange = (e) => setPassword(e.target.value); // added function to update password
  const handleSubmit = (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');  // Get the CSRF token

    // added code to send username and password to the server
    axios
    .post(
        "http://localhost:8000/accounts/login",
        {
            username: username,
            password: password,
        },
        { 
            withCredentials: true,
            headers: {
                'X-CSRFToken': csrftoken  // Include the CSRF token in the header
            }
        }
    )
    .then((response) => {
        console.log(response.data);
        // setFirstName(response.data.first_name);
        // sessionStorage.setItem("userName", response.data.first_name);
        if (response.data.detail === "Success examiner") {
            sessionStorage.clear();
            sessionStorage.setItem("userName", response.data.first_name);
            sessionStorage.setItem("userImage", response.data.image_url);  // Add this line

            navigate("/admin");
        } else if (response.data.detail === "Success student") {
            sessionStorage.clear();
            sessionStorage.setItem("userName", response.data.first_name);
            sessionStorage.setItem("userImage", response.data.image_url);  // Add this line
            navigate("/student");
        } else {
            alert(response.data.detail);
        }
    })
    .catch((error) => {
        console.log(error);
    });
};
  return (
    <Flex
      flexDirection="row"
      width="100wh"
      height="100vh"
      backgroundColor="orange.600"
      justifyContent="center"
      alignItems="center"
      p={5}
    >
      <Box
        borderRadius="10px"
        p={5}
        backgroundColor="whiteAlpha.900"
        boxShadow="lg"
        flexDirection="row"
        display="flex"
      >
        <Image
          src="https://images.unsplash.com/photo-1616400619175-5beda3a17896?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Your alt text"
          boxSize="500px"
          objectFit="cover"
          mr={5}
          borderRadius="10px 0 0 10px"
        />
        <Stack
          flexDir="column"
          mb="2"
          alignItems="flex-start"
          justifyContent="center"
        >
          <Heading color="orange.500" ml="6">
            Welcome to IMS
          </Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={6} p="1rem" m={2}>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="orange.600" />}
                    />
                    <Input
                      type="text"
                      placeholder="Username"
                      focusBorderColor="orange.500"
                      value={username} // added value attribute
                      onChange={handleUsernameChange} // added o
                    />
                    nChange attribute
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="orange.700"
                      children={<CFaLock color="orange.500" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      focusBorderColor="orange.700"
                      value={password} // added value attribute
                      onChange={handlePasswordChange} // added onChange attribute
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick}
                        colorScheme="orange"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="orange"
                  width="full"
                >
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
          <Box ml="6">
            New user?{" "}
            <Link color="orange.500" href="/sign-up">
              Sign Up
            </Link>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}
