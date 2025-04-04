import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../reading.css";
import { intermediateTests } from "../datas/readingData.js";

const IntermediateTest = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const userId = localStorage.getItem("userId");

  const ieltsConversion = (rawScore) => {
    if (rawScore >= 39) return 9.0;
    if (rawScore >= 37) return 8.5;
    if (rawScore >= 35) return 8.0;
    if (rawScore >= 33) return 7.5;
    if (rawScore >= 30) return 7.0;
    if (rawScore >= 27) return 6.5;
    if (rawScore >= 23) return 6.0;
    if (rawScore >= 19) return 5.5;
    if (rawScore >= 15) return 5.0;
    if (rawScore >= 13) return 4.5;
    if (rawScore >= 10) return 4.0;
    if (rawScore >= 8) return 3.5;
    if (rawScore >= 6) return 3.0;
    if (rawScore >= 4) return 2.5;
    return 2.0;
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === intermediateTests[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }
    if (currentQuestion + 1 < intermediateTests.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  useEffect(() => {
    if (showResult) {
      const ieltsScore = ieltsConversion(score);
      const updateReadingSkill = async () => {
        try {
          const response = await fetch(`http://192.168.1.45:5050/api/auth/update-skill/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reading: ieltsScore }),
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
          <h2 className="reading-title">Intermediate Level Reading</h2>
          {intermediateTests.map((test, index) => (
            <p key={index} className="reading-text">{test.passage}</p>
          ))}
          <button className="start-test-btn" onClick={() => setShowTest(true)}>Start Test</button>
        </div>
      ) : !showResult ? (
        <div className="test-container">
          <h2 className="test-title">Intermediate Level Reading Test</h2>
          <h3 className="question">{intermediateTests[currentQuestion].question}</h3>
          <div className="options">

            {intermediateTests.map((test, index) => (
              <p key={index} className="reading-text">{test.passage}</p>
            ))}
            {intermediateTests[currentQuestion].options.map((option, index) => (
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
            {currentQuestion + 1 < intermediateTests.length ? "Next" : "Finish"}
          </button>
        </div>
      ) : (
        <div className="result-container">
          <h2 className="result-title">Test Completed!</h2>
          <p className="score-text">Your Score: {score} / {intermediateTests.length}</p>
          <h3 className="ielts-score">IELTS Band: {ieltsConversion(score)}</h3>
          <h3 className="result-message">
            {score >= 7 ? "Malades! 🎉" : score >= 4 ? "Yaxshi o‘qi! 📚" : "Ko‘proq mashq qil! 🔄"}
          </h3>
        </div>
      )}
    </div>
  );
};

export default IntermediateTest;
