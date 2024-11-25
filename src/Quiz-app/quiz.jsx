import React, { useState, useEffect } from "react";
import axios from "axios";
import "./quiz.css"

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  
  const fetchQuestions = async () => {
    try {
      
      const response = await axios.get("https://opentdb.com/api.php?amount=10&type=multiple");
      const data = response.data.results;

      
      const formattedQuestions = data.map((question) => ({
        question: question.question,
        correctAnswer: question.correct_answer,
        options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
      }));

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
    setUserAnswer(null);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setUserAnswer(null);
  };

  if (quizFinished) {
    return (
      <div className="quiz-result">
        <h1>Quiz Finished!</h1>
        <p>Your Score: {score}/{questions.length}</p>
        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {questions.length > 0 && (
        <div className="question">
        
          <h2>
            Question {currentQuestionIndex + 1}:{" "}
            <span dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
          </h2>
          <div className="options">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option)}
                className={`option ${userAnswer === option ? "selected" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
          {userAnswer && (
            <div className="answer-buttons">
              <button onClick={() => handleAnswer(userAnswer)}>
                Submit Answer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizApp;
