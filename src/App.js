import "./App.css";
import { useState, useEffect } from "react";
import Questions from "./q.json";

function App() {
  const [score, setScore] = useState(0);
  const [questionsIdentifier, setQuestionsIdentifier] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [showScore, setShowScore] = useState(false);
  const [quizHeading, setQuizHeading] = useState("Проверь свои знания");

  const buttonOnChangeHandler = (e) => {
    e.target.disabled = true;
    const currentQuestionId = parseInt(e.target.parentNode.id);
    const currentDisableButtons = Object.values(
      e.target.parentNode.childNodes
    ).filter((x) => x.disabled === true).length;
    const currentDisableTrueButtons = Object.values(
      e.target.parentNode.childNodes
    ).filter(
      (x) => x.disabled === true && x.attributes.correct.value === "true"
    ).length;
    const trueAnswersCount = Questions[currentQuestionId].answers.filter(
      (answer) => answer.correct === true
    ).length;

    if (e.target.attributes.correct.value === "true") {
      if (currentDisableTrueButtons === trueAnswersCount) {
        setScore(score + 1);
      }
      e.target.classList.add("correct");
    } else {
      e.target.classList.add("incorrect");
    }
    if (questionNumber <= Questions.length) {
      if (trueAnswersCount === 1) {
        e.target.parentNode.childNodes.forEach((element) => {
          element.disabled = true;
        });
      } else if (
        trueAnswersCount > 1 &&
        currentDisableButtons === trueAnswersCount
      ) {
        e.target.parentNode.childNodes.forEach((element) => {
          if (element.disabled === false) {
            element.disabled = true;
          }
        });
      }
    }
    if (currentDisableButtons === trueAnswersCount) {
      setQuestionsIdentifier([...questionsIdentifier, currentQuestionId]);
    }
    if (
      !questionsIdentifier.includes(currentQuestionId) &&
      currentDisableButtons === trueAnswersCount
    ) {
      setQuestionNumber(questionNumber + 1);
    }
    if (
      questionNumber === Questions.length &&
      currentDisableButtons === trueAnswersCount
    ) {
      setShowScore(true);
      setQuizHeading("Ваш результат");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [showScore]);

  return (
    <div className="container">
      {
        <>
          <h1 className="quiz-heading">{quizHeading}</h1>
          {showScore && (
            <div className="score-section">
              Ваш результат {score} из {Questions.length}
            </div>
          )}
          <ul className="quiz-list">
            {Questions.map((question, index) => {
              return (
                <li className="quiz-item" id={index}>
                  <p>{question.question}</p>
                  {question.answers.map((answer, index) => (
                    <button
                      className="quiz-button"
                      correct={String(answer.correct)}
                      id={index}
                      type="button"
                      disabled={false}
                      onClick={buttonOnChangeHandler}
                    >
                      {answer.answer}
                    </button>
                  ))}
                </li>
              );
            })}
          </ul>
        </>
      }
    </div>
  );
}

export default App;
