import { useState } from "react";
import { ParentsSurveyForm } from "../components/Parents/ParentsSurveyForm";
import { ThankYouScreen } from "../components/ThankYou";

export function ParentsSurvey() {
  const [phase, setPhase] = useState<"survey" | "done">("survey");

  return (
    <main className="survey-page">
      <div className="survey-inner">
        {phase === "survey" && (
          <>
            <h1 className="survey-title">
              Help us understand your child's screen time.
            </h1>
            <p className="survey-sub">
              A short survey for parents thinking about their child's
              relationship with technology.
              <br />
              Your answers shape what we build next.
            </p>
            <ParentsSurveyForm
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
