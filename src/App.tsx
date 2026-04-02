import { useState } from "react";
import type { Answers } from "./types";
import { SurveyForm } from "./components/SurveyForm";
import { ThankYouScreen } from "./components/LeadCapture";
import "./App.css";

export default function App() {
  const [phase, setPhase] = useState<"survey" | "done">("survey");
  const [finalAnswers, setFinalAnswers] = useState<Answers>({});

  const handleComplete = (answers: Answers) => {
    setFinalAnswers(answers);
    setPhase("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFinalAnswers({});
    setPhase("survey");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="survey-page">
      <div className="survey-inner">
        {phase === "survey" && (
          <>
            <h1 className="survey-title">Are you even present?</h1>
            <p className="survey-sub">
              A short survey on your relationship with technology.
              <br />
              Answer honestly — there are no wrong answers.
            </p>
            <SurveyForm onComplete={handleComplete} />
          </>
        )}

        {phase === "done" && (
          <ThankYouScreen answers={finalAnswers} onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
