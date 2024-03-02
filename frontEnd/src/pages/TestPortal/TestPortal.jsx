import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Heading, Flex, Button, Text } from "@chakra-ui/react";
import {
  Radio,
  RadioGroup,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonGroup,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios to make HTTP requests
import Webcam from "react-webcam";

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

export default function TestPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const section_id = location.state?.section_id; // Get the section_id from the location state
  const test_id = location.state?.test_id;
  const [data, setData] = useState({ test_questions: [] }); // Initialize data with an empty test_questions array
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState([]);
  const selectedAnswer = useRef(null);
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    const csrftoken = getCookie("csrftoken"); // Get the CSRF token

    axios
      .post(
        "http://localhost:8000/webcam/process_frame/",
        { frame: imageSrc },
        {
          headers: {
            "X-CSRFToken": csrftoken, // Include the CSRF token in the header
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [webcamRef]);
  useEffect(() => {
    const intervalId = setInterval(capture, 500);
    return () => clearInterval(intervalId); // Clear the interval when the component unmounts
  }, [capture]);

  const handleAnswerChange = (value) => {
    selectedAnswer.current = value;
  };
  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[current] = selectedAnswer.current; // store the selected answer
    setAnswers(newAnswers);
    if (current < data.test_questions.length - 1) setCurrent(current + 1);
    else {
      const score = newAnswers.reduce(
        (score, answer, index) =>
          score + (answer === data.test_questions[index].answer ? 1 : 0),
        0
      );
      navigate("/testpage", {
        state: { test_id: test_id, section_id: section_id },
      }); // Include the section_id in the state

      const csrftoken = getCookie("csrftoken"); // Get the CSRF token

      // Send answers to backend
      fetch("http://localhost:8000/testapp/save_answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken, // Include the CSRF token in the header
        },
        body: JSON.stringify({
          answers: newAnswers,
          section_id: section_id,
          test_id: test_id,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
    }
    setTimeLeft(60);
    selectedAnswer.current = null;
  };

  useEffect(() => {
    // Fetch the questions from the backend when the component mounts
    axios
      .get(`http://localhost:8000/testapp/get_questions/${section_id}`)
      .then((response) => {
        setData(response.data);
        setAnswers(Array(response.data.test_questions.length).fill(null));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [section_id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000); // decrement every second

    if (timeLeft === 0) handleNext(); // if time is up, go to next question

    return () => clearInterval(timer); // cleanup on unmount
  }, [timeLeft]); // re-run effect when `timeLeft` changes

  return (
    <div>
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
        <Card align="left">
          <CardHeader>
            <Heading>{data.test_questions[current]?.question}</Heading>
            <Badge>
              <Text>Time left: {timeLeft} seconds</Text>
            </Badge>
          </CardHeader>
          <CardBody>
            <Flex alignItems="left">
              <RadioGroup onChange={handleAnswerChange}>
                <Stack direction="column">
                  <Radio value={data.test_questions[current]?.optionA}>
                    {data.test_questions[current]?.optionA}
                  </Radio>
                  <Radio value={data.test_questions[current]?.optionB}>
                    {data.test_questions[current]?.optionB}
                  </Radio>
                  <Radio value={data.test_questions[current]?.optionC}>
                    {data.test_questions[current]?.optionC}
                  </Radio>
                  <Radio value={data.test_questions[current]?.optionD}>
                    {data.test_questions[current]?.optionD}
                  </Radio>
                </Stack>
              </RadioGroup>
            </Flex>
          </CardBody>
          <CardFooter>
            <ButtonGroup spacing="5">
              <Button variant="solid" colorScheme="blue" onClick={handleNext}>
                Go next
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
      </Flex>
    </div>
  );
}
