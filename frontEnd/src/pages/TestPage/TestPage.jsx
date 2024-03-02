// import React from "react";
// import Navbar from "../../components/Navbar/Navbar";
// import { useLocation } from 'react-router-dom';
// import { useState,useEffect } from 'react';
// import {
// Card,
// CardHeader,
// CardBody,
// CardFooter,
// Stack,
// Heading,
// Button,
// ButtonGroup,
// Image,
// Text,
// Flex,
// } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
// import Webcam from "react-webcam";
// import axios from "axios"; // Import axios to make HTTP requests

// export default function TestPage() {
//   const webcamRef = React.useRef(null);
//   const [scores, setScores] = useState({});
//   const [quizSections, setQuizSections] = useState([]); // Add a state variable for the quiz sections
//   const location = useLocation();
//   const score = location.state?.score;
//   const test_id = location.state?.test_id; // Get the test_id from the location state
//   const [capturedImage, setCapturedImage] = useState(null);

//   const navigate = useNavigate();
//   const capture = React.useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     setCapturedImage(imageSrc);
//     const byteString = atob(imageSrc.split(",")[1]);
//     const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     const blob = new Blob([ab], { type: mimeString });
//     const file = new File([blob], "image.jpg", { type: mimeString });
//     const formData = new FormData();
//     formData.append('image', file);
//     axios.post("http://localhost:8000/webcam/process_frame", formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })
//     .then((response) => {
//         console.log(response.data);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
// }, [webcamRef, setCapturedImage]);

//   useEffect(() => {
//     const intervalId = setInterval(capture, 500); // Capture a frame every half a second
//     return () => clearInterval(intervalId); // Clear the interval when the component unmounts
//   }, [capture]);

//   useEffect(() => {
//     // Fetch the sections from the backend when the component mounts
//     axios
//       .get(`http://localhost:8000/testapp/get_sections/${test_id}`)
//       .then((response) => {
//         setQuizSections(response.data.sections);
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }, [test_id]);

//   const result = location.state;
//   useEffect(() => {
//     if (result) {
//       setScores((scores) => ({ ...scores, [result.section_id]: result.score })); // store the score for the section
//     }
//   }, [result]);
//   const toTest = (section, index) => {
//     navigate("/test-portal", { state: { ...section, test_id:test_id, section_id: section.section_id } });
//   };

//   return (
//     <>
//       <Navbar firstName={sessionStorage.getItem("userName")} />
//       <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg"  style={{ display: 'none' }} />

//       <Flex
//         flexDirection="column"
//         width="100wh"
//         height="100vh"
//         backgroundColor="blue.50"
//         justifyContent="center"
//         alignItems="center"
//         p={5}
//       >
//         {quizSections.map((input, index) => {
//           return (
//             <Card
//               direction={{ base: "column", sm: "row" }}
//               overflow="hidden"
//               variant="outline"
//               m={2}
//               width="900px"
//             >
//               <Image
//                 objectFit="cover"
//                 maxW={{ base: "100%", sm: "200px" }}
//                 src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVeD&auto=format&fit=crop&w=800&q=60"
//                 alt="Caffe Latte"
//               />

//               <Stack>
//                 <CardBody>
//                   <Heading size="md">{input.section_name}</Heading> {/* Display the section name */}
//                   <Text py="2">{input.section_desc}</Text> {/* Display the section description */}
//                 </CardBody>

//                 <CardFooter>
//                   <ButtonGroup spacing="40">
//                     <Text color="gray.500" fontWeight="bold">
//                       Score: {scores[input.section_id] || "Not attempted yet"}
//                     </Text>

//                     <Button
//                       variant="solid"
//                       colorScheme="blue"
//                       onClick={() => toTest(input, index)}
//                       isDisabled={!!scores[input.section_id]} // Disable the button if the section has been attempted
//                     >
//                       Start Test
//                     </Button>
//                   </ButtonGroup>
//                 </CardFooter>
//               </Stack>
//             </Card>
//           );
//         })}
//       </Flex>
//     </>
//   );
// }
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Button,
  ButtonGroup,
  Image,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

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

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export default function TestPage() {
  const [scores, setScores] = useState({});
  const [quizSections, setQuizSections] = useState([]);
  const location = useLocation();
  const score = location.state?.score;
  const test_id = location.state?.test_id;
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [images, setImages] = useState([]);
  const password = sessionStorage.getItem("password");
  const username = sessionStorage.getItem("username");
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages((images) => [...images, imageSrc]);

    // Split the base64 string in data and contentType
    var block = imageSrc.split(";");
    // Get the content type
    var contentType = block[0].split(":")[1];
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];

    // Convert to blob
    var blob = b64toBlob(realData, contentType);

    const formData = new FormData();
    formData.append("image", blob);
    formData.append("password1", password);
    formData.append("username", username);
    
    const csrftoken = getCookie('csrftoken');  // Get the CSRF token

    axios.post(
        "http://localhost:8000/webcam/process_frame", 
        formData, 
        {
            headers: {
                "Content-Type": "multipart/form-data",
                'X-CSRFToken': csrftoken  // Include the CSRF token in the header
            },
        }
    );
}, [webcamRef, setImages]);
  useEffect(() => {
    const intervalId = setInterval(capture, 500);
    return () => clearInterval(intervalId);
  }, [capture]);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/testapp/get_sections/${test_id}`)
      .then((response) => {
        setQuizSections(response.data.sections);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [test_id]);

  const result = location.state;
  useEffect(() => {
    if (result) {
      setScores((scores) => ({ ...scores, [result.section_id]: result.score }));
    }
  }, [result]);

  const toTest = (section, index) => {
    navigate("/test-portal", {
      state: { ...section, test_id: test_id, section_id: section.section_id },
    });
  };

  return (
    <>
      <Navbar firstName={sessionStorage.getItem("userName")} />
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ display: "none" }}
      />
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="blue.50"
        justifyContent="center"
        alignItems="center"
        p={5}
      >
        {quizSections.map((input, index) => {
          return (
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              m={2}
              width="900px"
            >
              <Image
                objectFit="cover"
                maxW={{ base: "100%", sm: "200px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVeD&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
              />
              <Stack>
                <CardBody>
                  <Heading size="md">{input.section_name}</Heading>
                  <Text py="2">{input.section_desc}</Text>
                </CardBody>
                <CardFooter>
                  <ButtonGroup spacing="40">
                    <Text color="gray.500" fontWeight="bold">
                      Score: {scores[input.section_id] || "Not attempted yet"}
                    </Text>
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => toTest(input, index)}
                      isDisabled={!!scores[input.section_id]}
                    >
                      Start Test
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Stack>
            </Card>
          );
        })}
      </Flex>
    </>
  );
}
