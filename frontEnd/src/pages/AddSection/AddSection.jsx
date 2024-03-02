import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { SectionContext } from "../SectionContext"; // import the context
import axios from "axios";
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
const SectionInput = ({
  name,
  description,
  index,
  id,
  onChange,
  onGenerate,
  onDelete,
  completed,
}) => {
  const location = useLocation();
  let navigate = useNavigate();
  const test_id = location.state.test_id;
  const [uniqueCode, setUniqueCode] = useState("");

  const generateUniqueCode = (callback) => {
    const csrftoken = getCookie('csrftoken');  // Get the CSRF token

    axios
    .post(
        "http://localhost:8000/testapp/section_id",
        { username: "sample" },
        { 
            headers: {
                'X-CSRFToken': csrftoken  // Include the CSRF token in the header
            }
        }
    )
    .then((response) => {
        console.log(response.data);
        setUniqueCode(response.data.unique_id);
        callback(response.data.unique_id); // Pass the unique_id to the callback
    })
    .catch((error) => {
        console.log(error);
    });
};
  const handleAddQues = () => {
    navigate("/create-question", {
      state: {
        t_id: test_id,
        s_id: id,
        s_name: name,
        s_desc: description,
      },
    });
  };

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius={8}
      boxShadow="lg"
      bg="white"
      w="full"
      borderColor="teal.100"
    >
      <Flex align="center" justify="space-between">
        <Heading as="h4" size="md">
          Section {name}
        </Heading>
        <Text fontSize="sm" color="gray.600">
          ID: {id}
        </Text>
      </Flex>
      {completed ? (
        <>
          <Text mt={4}>{name}</Text>
          <Text mt={4}>{description}</Text>
        </>
      ) : (
        <>
          <Input
            mt={4}
            placeholder="Enter section name"
            value={name}
            onChange={(e) => onChange(index, "name", e.target.value)}
          />
          <Textarea
            mt={4}
            placeholder="Enter section description"
            value={description}
            onChange={(e) => onChange(index, "description", e.target.value)}
          />
          <Flex mt={4}>
            <ButtonGroup>
              <Button onClick={() => generateUniqueCode(onGenerate)}>
                Generate ID
              </Button>
              <Button colorScheme="red" onClick={onDelete}>
                Delete Section
              </Button>
            </ButtonGroup>
            <Spacer />
            <Button colorScheme="teal" onClick={handleAddQues}>
              Add Questions
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

const AddSection = () => {
  const location = useLocation();
  const test_id = location.state.test_id;
  const [uniqueCode, setUniqueCode] = useState("");
  let navigate = useNavigate();

  const handleNav = () => {
    setSections([]);
    navigate("/admin");
  };
  const generateUniqueCode = (callback) => {
    axios
      .post("http://localhost:8000/testapp/section_id", {
        username: "sample",
      })
      .then((response) => {
        console.log(response.data);
        setUniqueCode(response.data.unique_id);
        callback(response.data.unique_id); // Pass the unique_id to the callback
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [sections, setSections] = useContext(SectionContext); // use the context instead of local state

  const handleAddSection = () => {
    generateUniqueCode((uniqueCode) => {
      setSections([
        ...sections,
        {
          name: "",
          description: "",
          id: uniqueCode,
          completed: false,
        },
      ]);
    });
  };

  const handleInputChange = (index, field, newValue) => {
    const newSections = [...sections];
    newSections[index][field] = newValue;
    setSections(newSections);
  };

  const handleGenerateId = (index) => {
    generateUniqueCode((uniqueCode) => {
      const newSections = [...sections];
      newSections[index].id = uniqueCode;
      setSections(newSections);
    });
  };

  const handleDeleteSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  return (
    <Flex direction="column" align="center" justify="center" p="50px">
      <Heading as="h1" mb={8}>
        Add Sections
      </Heading>
      <Stack spacing={8} w="80%">
        {sections.map((section, index) => (
          <SectionInput
            key={section.id}
            name={section.name}
            description={section.description}
            id={section.id}
            index={index}
            onChange={handleInputChange}
            onGenerate={() => handleGenerateId(index)}
            onDelete={() => handleDeleteSection(index)}
            completed={section.completed}
          />
        ))}
        <Button colorScheme="teal" onClick={handleAddSection}>
          Add Section
        </Button>
        <Button colorScheme="red" onClick={handleNav}>
          Create Test
        </Button>
      </Stack>
    </Flex>
  );
};

export default AddSection;
