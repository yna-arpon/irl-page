import { useState } from "react";
import { SurveyForm } from "./components/SurveyForm";
import { ThankYouScreen } from "./components/ThankYou";
import "./App.css";

export default function App() {
  const [phase, setPhase] = useState<"survey" | "done">("survey");

  return (
    <main className="survey-page">
      <div className="survey-inner">
        {phase === "survey" && (
          <>
            <h1 className="survey-title">Are you even present?</h1>
            <p className="survey-sub">
              Help us understand how your phone affects your life.
              <br />
              Answer honestly — there are no wrong answers.
            </p>
            <SurveyForm
              onComplete={() => {
                setPhase("done");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}

        {phase === "done" && <ThankYouScreen />}
      </div>
    </main>
  );
}
