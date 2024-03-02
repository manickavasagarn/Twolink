import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Center, Text } from '@chakra-ui/react';
import axios from 'axios';

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



const TestId = () => {
    let navigate = useNavigate();
  const [testId, setTestId] = useState('');

  const handleStartTest = async () => {
    try {
      const csrftoken = getCookie('csrftoken');  // Get the CSRF token

      const response = await axios.post(
          'http://localhost:8000/testapp/test_id', 
          { testId },
          { 
              headers: {
                  'X-CSRFToken': csrftoken  // Include the CSRF token in the header
              }
          }
      )
      .then((response) => {
        console.log(response.data);
        if(response.data.detail = 'ID present'){
            navigate('/testpage', { state: { test_id: testId } });
        }
      })
    } catch (error) {
      console.error(error);
    }
};
  return (
    <Center h="100vh">
      <Box w="300px" p={4} borderWidth={1} borderRadius="lg">
        <Text mb={4}>Enter Test ID:</Text>
        <Input
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
          placeholder="Test ID"
          mb={4}
        />
        <Button colorScheme="teal" onClick={handleStartTest}>
          Start Test
        </Button>
      </Box>
    </Center>
  );
};

export default TestId;
