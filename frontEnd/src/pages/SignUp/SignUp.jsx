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
  Select,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { Route, Router, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaEnvelope = chakra(FaEnvelope);
export default function SignUp() {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    if (capturing) {
      setCapturedImage(null);
      setCapturing(false);
    } else {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setCapturing(true);
    }
  }, [webcamRef, setCapturedImage, capturing]);

  const navig = () => {
    navigate("/testpage");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');  // Get the CSRF token

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Convert Base64 image to a Blob
    const byteString = atob(capturedImage.split(",")[1]);
    const mimeString = capturedImage.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    // Convert Blob to File
    const file = new File([blob], "image.jpg", { type: mimeString });

    // Create a new FormData instance
    const formData = new FormData();

    // Append the form data
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password1", password);
    formData.append("password2", confirmPassword);
    formData.append("user_type", userType);

    // Append the File to the FormData
    formData.append("image", file);

    // Send the FormData to the backend
    axios
    .post(
        "http://localhost:8000/testapp/newRegister",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                'X-CSRFToken': csrftoken  // Include the CSRF token in the header
            },
        }
    )
    .then((response) => {
        console.log(response);
        // if (response.data.detail === "User created") {
        if (response.data.detail === "Success student") {
            sessionStorage.clear();
            sessionStorage.setItem("userName", response.data.first_name);
            sessionStorage.setItem("userImage", response.data.image_url);
            sessionStorage.setItem("password",password)  // Add this line
            navigate("/test-id");
        }
    })
    .catch((error) => {
        console.error(error);
    });
};
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  const [showPassword2, setShowPassword2] = useState(false);
  const handleShowClick2 = () => setShowPassword2(!showPassword2);
  return (
    <Flex
      flexDirection="row"
      width="100wh"
      height="100vh"
      backgroundColor="red.600"
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
        <Box>
          {capturedImage ? (
            <Image
              src={capturedImage}
              alt="Captured image"
              width={640}
              height={480}
            />
          ) : (
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              ref={webcamRef}
              width={600}
              height={480}
            />
          )}
          <Button
            borderRadius={0}
            variant="solid"
            colorScheme="red"
            width={400}
            ml={100} // Add a left margin
            onClick={capture}
            mt={2}
          >
            {capturing ? "Recapture" : "Capture"}
          </Button>
        </Box>

        <Stack
          flexDir="column"
          mb="2"
          alignItems="flex-start"
          justifyContent="center"
        >
          <Heading color="red.500" ml="6">
            Hey there!
          </Heading>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={6} p="1rem" m={2}>
                <Flex direction={{ base: "column", md: "row" }} width="full">
                  <FormControl mr={{ md: 2 }}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<CFaUserAlt color="red.600" />}
                      />
                      <Input
                        type="text"
                        placeholder="First Name"
                        focusBorderColor="red.500"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl ml={{ md: 2 }}>
                    <InputGroup>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<CFaUserAlt color="red.600" />}
                      />
                      <Input
                        type="text"
                        placeholder="Last Name"
                        focusBorderColor="red.500"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </InputGroup>
                  </FormControl>
                </Flex>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="red.600" />}
                    />
                    <Input
                      type="text"
                      placeholder="Username"
                      focusBorderColor="red.500"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaEnvelope color="red.600" />}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      focusBorderColor="red.500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="red.700"
                      children={<CFaLock color="red.500" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      focusBorderColor="red.700"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick}
                        colorScheme="red"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="red.700"
                      children={<CFaLock color="red.500" />}
                    />
                    <Input
                      type={showPassword2 ? "text" : "password"}
                      placeholder="Confirm Password"
                      focusBorderColor="red.700"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowClick2}
                        colorScheme="red"
                      >
                        {showPassword2 ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <RadioGroup defaultValue="student" onChange={setUserType}>
                    <Stack direction="row">
                      <Radio value="student" colorScheme="red">
                        Student
                      </Radio>
                      <Radio value="examiner" colorScheme="red">
                        Examiner
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="red"
                  width="full"
                >
                  Register
                </Button>
              </Stack>
            </form>
          </Box>
          <Box ml="6">
            Existing user?{" "}
            <Link color="red.500" href="/">
              Login
            </Link>
          </Box>
        </Stack>
      </Box>
    </Flex>
  );
}
