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
import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import StudentHome from "../StudentHome/StudentHome";
import ProctorHome from "../ProctorHome/ProctorHome";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function FaceLogin(props) {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const handleShowClick = () => setShowPassword(!showPassword);
  const handleUsernameChange = (e) => setUsername(e.target.value); // added function to update username
  const handlePasswordChange = (e) => setPassword(e.target.value); // added function to update password
  const WebcamComponent = () => <Webcam />;
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const retake = () => {
    setCapturedImage(null); // This will clear the captured image
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    // Append the File to the FormData
    formData.append("image", file);

    // Send the FormData to the backend
    axios
      .post("http://localhost:8000/accounts/recognize_face", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        // props.setFirstName(response.data.first_name);
        console.log(response.data.first_name);
        if (response.data.detail === "Success examiner") {
          sessionStorage.clear();
          sessionStorage.setItem("userName", response.data.first_name);
          sessionStorage.setItem("userImage", response.data.image_url);
          navigate("/admin");
        } else if (response.data.detail === "Success student") {
          sessionStorage.clear();
          sessionStorage.setItem("userName", response.data.first_name);
          sessionStorage.setItem("userImage", response.data.image_url);
          navigate("/student");
        } else {
          alert(response.data.detail);
        }
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
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="500"
          mirrored={true}
          screenshotQuality={1}
        />

        <Stack
          flexDir="column"
          mb="2"
          alignItems="center"
          justifyContent="center"
        >
          <Heading color="orange.500" ml="6">
            Welcome to IMS
          </Heading>
          <Box position="relative" ml={6} p={2}>
            {capturedImage ? (
              <Image
                src={capturedImage}
                alt="Captured image"
                boxSize="250px"
                objectFit="cover"
              />
            ) : (
              <Image
                src="https://northmemorial.com/wp-content/uploads/2016/10/PersonPlaceholder-300x300.png"
                alt="Placeholder"
                boxSize="250px"
                objectFit="cover"
              />
            )}
            {capturedImage && (
              <Button
                position="absolute"
                bottom="8px"
                size="md"
                colorScheme="orange"
                onClick={retake}
                borderBottomLeftRadius={0}
                borderTopRightRadius={0}
              >
                Retake
              </Button>
            )}
          </Box>
          <Box minW={{ base: "90%", md: "468px" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={6} p="1rem" m={2}>
                <Button
                  borderRadius={0}
                  type="button"
                  variant="solid"
                  colorScheme="orange"
                  width="full"
                  onClick={capturedImage ? handleSubmit : capture}
                >
                  {capturedImage ? "Submit" : "Capture"}
                </Button>
              </Stack>
            </form>
          </Box>
          <Box ml="6">
            Want to login using credentials ?{" "}
            <Link color="orange.500" href="/login">
              Login
            </Link>
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





// import React from 'react';
// import { Box } from "@chakra-ui/react";
// import Navbar from "../../components/Navbar/Navbar";

// const neumorphismStyle = {
//   background: "linear-gradient(to bottom right, #f7f7f7, #e9e9e9)",
//   borderRadius: 10,
//   boxShadow:
//     "10px 10px 20px #d2d2d2, -10px -10px 20px #ffffff inset",
// };
// const ExamPage = () => {
//     const sections = [
//         { name: 'Aptitude-2', questions: 15 },
//         { name: 'Aptitude-1', questions: 20 },
//         { name: 'Technical Aptitude-1', questions: 15 },
//         { name: 'Technical Aptitude-2', questions: 15 },
//         { name: 'Data Structures and Algorithms', questions: 25 },
//     ];

//     return (
//       <>
//       <Navbar firstName={sessionStorage.getItem("userName")} />
//     <Box
//       w="100vw"
//       h="100vh"
//       display="flex"
//       justifyContent="center"
//       alignItems="center"
//       bg="#f7f7f7"
//       borderRadius={20}
//       {...neumorphismStyle}
//     >
      
//       <Box
//         w="70%"
//         h="70%"
//         bg="#f0f0f0"
//         borderRadius={10}
//         {...neumorphismStyle}
//       ><div>
//       <h1>Exam Sections</h1>
//       {sections.map((section, index) => (
//           <div key={index}>
//               <h2>{section.name}</h2>
//               <p>Questions: {section.questions}</p>
//           </div>
//       ))}
//   </div></Box>
      
//     </Box>
    
        
//       </>
//     );
// };

// export default ExamPage;




