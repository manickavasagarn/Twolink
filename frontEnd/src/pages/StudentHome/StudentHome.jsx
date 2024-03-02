import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
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
export default function StudentHome({ firstName, imageUrl }) {
  let navigate = useNavigate();
  return (
    <>
      <Navbar firstName={sessionStorage.getItem("userName")} />
      <Center h="100vh" backgroundColor="orange.600">
        <Box p={5}>
          <SimpleGrid columns={2} spacing={10}>
            <Card maxW="sm">
              <CardBody>
                <Image
                  src="https://images.unsplash.com/photo-1534644107580-3a4dbd494a95?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Green double couch with wooden legs"
                  borderRadius="lg"
                />
                <Stack mt="6">
                  <Heading size="md">Attend Test</Heading>
                  <Text>Attend an ongoing test. All the best!!.</Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                <Link to="/test-id">
                  <Button variant="solid" colorScheme="green">
                    Attend test
                  </Button>
                  </Link>
                  <Button variant="ghost" colorScheme="green">
                    Verify credentials
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
            <Card maxW="sm">
              <CardBody>
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="md">View Results</Heading>
                  <Text>Preview results of previously written tests</Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button variant="solid" colorScheme="green">
                    View Tests
                  </Button>
                  <Button variant="ghost" colorScheme="green">
                    Analyse results
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
