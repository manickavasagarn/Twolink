
import { SectionProvider } from './pages/SectionProvider';
import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import ProctorHome from './pages/ProctorHome/ProctorHome';
import StudentHome from './pages/StudentHome/StudentHome';
import FaceLogin from './pages/FaceLogin/FaceLogin';
import CreateTest from "./pages/CreateTest/CreateTest";
import TestPage from "./pages/TestPage/TestPage";
import TestPortal from "./pages/TestPortal/TestPortal";
import AddSection from "./pages/AddSection/AddSection";
import AddQues from "./pages/AddQues/AddQues";
import TestId from './pages/TestID/TestId';
import Test from './pages/Test';


function App() {
  const [firstName, setFirstName] = useState('');  // Add this line

  return (
    <SectionProvider>
    <Routes>
    <Route path="test" element={<Test/>} /> 
      <Route
        exact
        path="/"
        element={<FaceLogin setFirstName={setFirstName} />}
      />
      
      <Route path="login" element={<Login setFirstName={setFirstName} />} /> 
      <Route path="sign-up" element={<SignUp />} />
      <Route path="admin" element={<ProctorHome firstName={firstName} />} />
      <Route path="student" element={<StudentHome firstName={firstName} />}/>
      <Route path="logout" element={<Login setFirstName={setFirstName} />} />
      <Route path="create-test" element={<CreateTest />} />
      <Route path="testpage" element={<TestPage />} />
      <Route path="test-portal" element={<TestPortal />} />
      <Route path="create-question" element={<AddQues />} />
      <Route path="create-section" element={<AddSection />} />
      <Route path="test-id" element={<TestId />} />
    </Routes>
    </SectionProvider>
  );
}


export default App;

// import React, { useState } from 'react';
// import { Route, Routes } from "react-router-dom";
// import Login from './pages/Login/Login';
// import SignUp from './pages/SignUp/SignUp';
// import ProctorHome from './pages/ProctorHome/ProctorHome';
// import StudentHome from './pages/StudentHome/StudentHome';
// import FaceLogin from './pages/FaceLogin/FaceLogin';
// import CreateTest from "./pages/CreateTest/CreateTest";
// import TestPage from "./pages/TestPage/TestPage";
// import TestPortal from "./pages/TestPortal/TestPortal";
// import axios from 'axios';
// import fileDownload from 'js-file-download';

// function App() {
//     const downloadPdf = () => {
//         axios.get("http://localhost:8000/accounts/DownloadPDF", { responseType: "blob" })
//             .then((response) => {
//                 let url = window.URL.createObjectURL(new Blob([response.data]));
//                 let link = document.createElement('a');
//                 link.href = url;

//                 link.setAttribute('download', 'filename.pdf');
//                 document.body.appendChild(link);
//                 link.click();
//             });
//     };

//     return (
//         <div>
//             <button onClick={downloadPdf}>Download PDF</button>
//         </div>
//     );
// }

// export default App;
