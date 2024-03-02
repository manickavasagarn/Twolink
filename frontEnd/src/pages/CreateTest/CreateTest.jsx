import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Center,
  Card,
  Stack,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  StackDivider,
  Text,
  Textarea,
  Spacer,
  Highlight,
} from "@chakra-ui/react";
import axios from "axios";

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

function CreateTest() {
  let navigate = useNavigate();
  const [testName, setTestName] = useState("");
  const [testDesc, setTestDesc] = useState("");
  const [uniqueCode, setUniqueCode] = useState("");
  const toast = useToast();

  const generateUniqueCode = () => {
    const csrftoken = getCookie('csrftoken');  // Get the CSRF token

    axios
    .post(
        "http://localhost:8000/testapp/test_id",
        { username: 'sample' },
        { 
            headers: {
                'X-CSRFToken': csrftoken  // Include the CSRF token in the header
            }
        }
    )
    .then((response) => {
        console.log(response.data);
        setUniqueCode(response.data.unique_id)
    })
    .catch((error) => {
        console.log(error);
    });
};


const handleSubmit = async () => {
  const csrftoken = getCookie('csrftoken');  // Get the CSRF token

  // Handle form submission here
  try {
      const response = axios.post(
          "http://localhost:8000/testapp/create_test",
          {
              testName,
              testDesc,
              uniqueCode,
          },
          { 
              headers: {
                  'X-CSRFToken': csrftoken  // Include the CSRF token in the header
              }
          }
      );
      toast({
          title: "Test created.",
          description: "Your test has been successfully created.",
          status: "success",
          duration: 5000,
          isClosable: true,
      });
      navigate('/create-section', { state: { test_id: uniqueCode } });
  } catch (error) {
      console.error(error);
  }
};
  //test title, test desc, generate id, proceeed
  return (
    <>
      <Navbar firstName={sessionStorage.getItem("userName")} />
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        backgroundColor="blue.50"
        justifyContent="center"
        alignItems="center"
        p={5}
      >
        <Card w="800px" h="650px" justify="Center" py="20px" variant="elevated">
          <CardHeader mb="50px">
            <Heading as="h2" size="2xl" textAlign="center">
              Create Test
            </Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <FormControl id="testName">
                  <Heading as="h2" size="md" textAlign="left" mb="20px">
                    Test Title
                  </Heading>
                  <Input
                    bg="whiteAlpha.400"
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="testName">
                  <Heading as="h2" size="md" textAlign="left" mb="20px">
                    Enter test discription
                  </Heading>
                  <Input
                    bg="whiteAlpha.400"
                    type="text"
                    value={testDesc}
                    onChange={(e) => setTestDesc(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Box>
                <Flex minWidth="max-content" alignItems="center" gap="2">
                  <Box p="2">
                    <Heading size="md">
                      <Highlight
                        query="Your unique code is:"
                        styles={{
                          px: "2",
                          py: "1",
                          rounded: "full",
                          bg: "teal.200",
                        }}
                      >
                        Your unique code is:
                      </Highlight>
                      {uniqueCode}
                    </Heading>
                  </Box>
                  <Spacer />
                  <Button onClick={generateUniqueCode} colorScheme="teal">
                    Generate Unique Code
                  </Button>
                </Flex>
              </Box>
            </Stack>
          </CardBody>
          <CardFooter display="flex" justifyContent="center">
            <Button
              size="lg"
              colorScheme="teal"
              w="500px"
              isDisabled={uniqueCode === ""}
              onClick={handleSubmit}
            >
              Proceed
            </Button>
          </CardFooter>
        </Card>
      </Flex>
    </>
  );
}

export default CreateTest;
