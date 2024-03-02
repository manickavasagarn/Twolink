import React, { useState } from "react";
import { useContext } from "react";
import { SectionContext } from "../SectionContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  ButtonGroup,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
  Heading,
} from "@chakra-ui/react";

const AddQues = () => {
  let navigate = useNavigate();

  const location = useLocation();
  const test_id = location.state.t_id;
  const section_id = location.state.s_id;
  const section_name = location.state.s_name;
  const section_desc = location.state.s_desc;
  const [questions, setQuestions] = useState([
    { name: "", options: ["", "", "", ""], answer: "" },
  ]);
  console.log(test_id);
  console.log(section_id);
  console.log(section_name);
  console.log(section_desc);
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
  const saveQuestion = () => {
    const csrftoken = getCookie("csrftoken"); // Get the CSRF token

    const formattedQuestions = questions.map((question) => ({
      question: question.name,
      optionA: question.options[0],
      optionB: question.options[1],
      optionC: question.options[2],
      optionD: question.options[3],
      answer: question.answer,
    }));
    fetch("http://localhost:8000/testapp/save_questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken, // Include the CSRF token in the header
      },
      body: JSON.stringify({
        questions: formattedQuestions,
        section_name: section_name,
        section_desc: section_desc,
        test_id: test_id,
        section_id: section_id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.detail == "success") {
          navigate(-1);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { name: "", options: ["", "", "", ""], answer: "" },
    ]);
    console.log(questions, test_id);
  };

  const deleteQuestion = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions.splice(questionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleInputChange = (e, questionIndex, optionIndex = null) => {
    const newQuestions = [...questions];
    if (optionIndex !== null) {
      newQuestions[questionIndex].options[optionIndex] = e.target.value;
    } else if (e.target.name === "answer") {
      newQuestions[questionIndex].answer = e.target.value;
    } else {
      newQuestions[questionIndex].name = e.target.value;
    }
    setQuestions(newQuestions);
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="blue.50"
      justifyContent="center"
      alignItems="center"
      p={5}
    >
      <Box bg="white" boxShadow="xl" p={5} rounded="md">
        <Heading mb="8" textAlign="center">
          Add Questions
        </Heading>
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList sx={{ display: "flex", flexWrap: "wrap" }}>
            {questions.map((_, index) => (
              <Tab key={index}>{index + 1}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {questions.map((question, questionIndex) => (
              <TabPanel key={questionIndex}>
                <Input
                  placeholder="Question name"
                  size="lg"
                  variant="flushed"
                  value={question.name}
                  onChange={(e) => handleInputChange(e, questionIndex)}
                  my="8"
                />
                {question.options.map((option, optionIndex) => (
                  <Input
                    key={optionIndex}
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleInputChange(e, questionIndex, optionIndex)
                    }
                    my="2"
                  />
                ))}
                <Input
                  name="answer"
                  placeholder="Answer"
                  value={question.answer}
                  onChange={(e) => handleInputChange(e, questionIndex)}
                  my="4"
                />
                <ButtonGroup spacing="400" m="2">
                  <Button
                    colorScheme="red"
                    onClick={() => deleteQuestion(questionIndex)}
                  >
                    Delete Question
                  </Button>
                  <Button
                    colorScheme="teal"
                    onClick={addQuestion}
                    // Disable the button if the answer field is empty or does not match any of the options
                    isDisabled={
                      !question.answer ||
                      !question.options.includes(question.answer)
                    }
                  >
                    Add Question
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={saveQuestion}
                    isDisabled={
                      !question.answer ||
                      !question.options.includes(question.answer)
                    }
                  >
                    Finish Section
                  </Button>
                </ButtonGroup>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default AddQues;
