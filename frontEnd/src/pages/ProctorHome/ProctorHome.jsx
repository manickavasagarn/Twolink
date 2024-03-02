import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from 'react-router-dom';
import CreateTest from "../CreateTest/CreateTest";
import { Route, Router, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Center,
  Card,
  CardBody,
  Image,
  Stack,
  Divider,
  ButtonGroup,
  CardFooter,
  Text,
} from "@chakra-ui/react";
export default function ProctorHome({ firstName, imageUrl }) {
  return (
    <>
      <Navbar firstName={sessionStorage.getItem("userName")} />
      <Center h="100vh" backgroundColor="blue.500">
        <Box p={5}>
          <SimpleGrid columns={2} spacing={10}>
            <Card maxW="sm">
              <CardBody>
                <Image
                  src="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Green double couch with wooden legs"
                  borderRadius="lg"
                />
                <Stack mt="6">
                  <Heading size="md">Create Test</Heading>
                  <Text>
                    Create a test. Schedule time and date. Create deadlines and
                    proctor.
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
              <ButtonGroup spacing="2">
                <Link to="/create-test">
                  <Button variant="solid" colorScheme="blue">
                    Create Test
                  </Button>
                </Link>
                <Button variant="ghost" colorScheme="blue">
                  Schedule a Test
                </Button>
              </ButtonGroup>
              </CardFooter>
            </Card>
            <Card maxW="sm">
              <CardBody>
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">View Created Test</Heading>
                  <Text>
                    Award marks for finished test. Analyse performance of
                    students.
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
              <ButtonGroup spacing="2">
                  <Button variant="solid" colorScheme="blue" >
                    View Tests
                  </Button>
                  <Button variant="ghost" colorScheme="blue">
                    Analyze results
                  </Button>
                </ButtonGroup>

              </CardFooter>
            </Card>
          </SimpleGrid>
        </Box>
      </Center>
    </>
  );
}
