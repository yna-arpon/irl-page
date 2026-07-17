import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Landing } from "./pages/Landing";
import { Survey } from "./pages/Survey";
import { ParentsSurvey } from "./pages/ParentsSurvey";
import { Privacy } from "./pages/Privacy";
import { Waitlist } from "./pages/Waitlist";

// import { useState } from "react";
// import { SurveyForm } from "./components/SurveyForm";
// import { ThankYouScreen } from "./components/ThankYou";
import "./App.css";

const TRANSITION_DURATION = 300;

export default function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState<"in" | "out">("in");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setStage("out");
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (stage !== "out") return;
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
      setDisplayLocation(location);
      setStage("in");
    }, TRANSITION_DURATION);
    return () => clearTimeout(timeout);
  }, [stage, location]);

  return (
    <div className={`route-transition${stage === "out" ? " route-transition-out" : ""}`}>
      <Routes location={displayLocation}>
        <Route path="/" element={<Landing />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/parents" element={<ParentsSurvey />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/waitlist" element={<Waitlist />} />
      </Routes>
    </div>
  );
}
