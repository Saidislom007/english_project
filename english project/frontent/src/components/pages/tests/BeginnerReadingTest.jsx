import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../reading.css";
import { beginnerTests } from "../datas/readingData.js";

const BeginnerTest = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === beginnerTests[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion + 1 < beginnerTests.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const calculateBandScore = (rawScore) => {
    if (rawScore <= 2) return 3.0;
    if (rawScore === 3) return 4.0;
    if (rawScore === 4) return 5.0;
    if (rawScore === 5) return 6.0;
    if (rawScore === 6) return 6.5;
    if (rawScore === 7) return 7.0;
    if (rawScore === 8) return 7.5;
    return 8.0;
  };

  useEffect(() => {
    if (showResult) {
      const bandScore = calculateBandScore(score);
      const updateReadingSkill = async () => {
        try {
          const response = await fetch(`http://192.168.1.45:5050/api/auth/update-skill/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reading: bandScore }),
          });

          if (response.ok) {
            console.log("Reading skill updated successfully");
          } else {
            console.error("Failed to update reading skill");
          }
        } catch (error) {
          console.error("Error updating reading skill:", error);
        }
      };

      updateReadingSkill();
    }
  }, [showResult, score, userId]);

  return (
    <div className="reading-test-page">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {!showTest ? (
        <div className="reading-container">
          <h2 className="reading-title">Beginner Level Reading</h2>
          {beginnerTests.map((test, index) => (
            <p key={index} className="reading-text">{test.passage}</p>
          ))}
          <button className="start-test-btn" onClick={() => setShowTest(true)}>Start Test</button>
        </div>
      ) : !showResult ? (
        <div className="test-container">
          <h2 className="test-title">Beginner Level Reading Test</h2>
          <h3 className="question">{beginnerTests[currentQuestion].question}</h3>
          <div className="options">

            {beginnerTests.map((test, index) => (
              <p key={index} className="reading-text">{test.passage}</p>
            ))}
            {beginnerTests[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
                onClick={() => handleAnswerClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="next-btn" onClick={handleNextQuestion}>
            {currentQuestion + 1 < beginnerTests.length ? "Next" : "Finish"}
          </button>
        </div>
      ) : (
        <div className="result-container">
          <h2 className="result-title">Test Completed!</h2>
          <p className="score-text">Your Score: {score} / {beginnerTests.length}</p>
          <h3 className="result-message">IELTS Band Score: {calculateBandScore(score)}</h3>
        </div>
      )}
    </div>
  );
};

export default BeginnerTest;