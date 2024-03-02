import React, { useState, useEffect } from 'react'; // import useEffect
import axios from 'axios'; // import axios
import { SectionContext } from './SectionContext';


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


export const SectionProvider = ({ children }) => {
  const [uniqueCode, setUniqueCode] = useState("");
  const [sections, setSections] = useState([]);

  const generateUniqueCode = (callback) => {
    const csrftoken = getCookie('csrftoken');  // Get the CSRF token

    axios
    .post(
        "http://localhost:8000/testapp/section_id",
        { username: 'sample' },
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
  useEffect(() => {
    generateUniqueCode((uniqueCode) => {
      setSections([
        {
          name: "",
          description: "",
          id: uniqueCode,
        },
      ]);
    });
  }, []);

  return (
    <SectionContext.Provider value={[sections, setSections]}>
      {children}
    </SectionContext.Provider>
  );
};

