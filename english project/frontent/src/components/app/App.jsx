import "./App.css";
import { MantineProvider, createTheme } from "@mantine/core";
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "../navbar/navbar";
import Homepage from "../home/home";
import UserCardImage from "../profile/Profile";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import ProtectedRoute from "../pages/register/ProtectedRoute";
import { useState, useEffect } from "react";
import axios from "axios";
import { localStorageColorSchemeManager } from "@mantine/core";
import ReadingPage from '../pages/ReadingPage'
import BeginnerReadingTest from '../pages/tests/BeginnerReadingTest'
import IntermediateReadingTest from '../pages/tests/IntermediateReadingTest'
import ListeningList from '../pages/lists/ListeningList'
import BeginnerListeningList  from '../pages/lists/BeginnerlisteningList'
import IntermediateListeningTest from '../pages/lists/IntermeditelisteningList'
import AdvancedReadingTest from '../pages/tests/AdvancedReadingTest'
import AdvancedListeningTest from '../pages/lists/AdvancedListeningTest'
import WritingTest from '../pages/tests/WritingTest'
import SpeakingMock from '../pages/tests/SpeakingTest'
import AdminPage from "../pages/admin/admin";


const colorSchemeManager = localStorageColorSchemeManager({
  key: "my-app-color-scheme",
});
const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'cyan',
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) return;

        const response = await axios.get(
          `http://192.168.1.45:5050/api/auth/get-profile/${storedUserId}`,
          { withCredentials: true }
        );

        if (response.data) {
          setIsAuthenticated(true);
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    fetchUser();
  }, []);

  const setAuthStatus = (status, userId = null) => {
    setIsAuthenticated(status);
    setUserId(userId);
    if (status) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  };

  return (
    <MantineProvider theme={theme}>
      <Router>
        <NavBar />
        
        <Routes>
        <Route path="/beginnerListening" element={<BeginnerListeningList />} />
        <Route path="/intermediteListening" element={<IntermediateListeningTest/>} />
        <Route path="/writing" element={<WritingTest/>} />
        <Route path="/speaking" element={<SpeakingMock/>} />
        <Route path="/admin" element={<AdminPage/>} />
        
        <Route path="/AdvancedListeningTest" element={<AdvancedListeningTest/>} />
            <Route path="/reading" element={<ReadingPage />} />
            <Route path="/reading/beginner" element={<BeginnerReadingTest />} /> 
            <Route path="/reading/intermediate" element={<IntermediateReadingTest />} />
            <Route path="/reading/advanced" element={<AdvancedReadingTest />} />
            {/* IntermediateTest qo'shildi */}
            <Route path="/listening" element={<ListeningList/>} />
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login setIsAuthenticated={setAuthStatus} />} />
          <Route path="/signup" element={<Register setIsAuthenticated={setAuthStatus} />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserCardImage userId={userId} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </MantineProvider>
  );
};

export default App;
