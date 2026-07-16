import { Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Survey } from "./pages/Survey";
import { ParentsSurvey } from "./pages/ParentsSurvey";
import { Privacy } from "./pages/Privacy";
import { Waitlist } from "./pages/Waitlist";

// import { useState } from "react";
// import { SurveyForm } from "./components/SurveyForm";
// import { ThankYouScreen } from "./components/ThankYou";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/survey" element={<Survey />} />
      <Route path="/parents" element={<ParentsSurvey />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/waitlist" element={<Waitlist />} />
    </Routes>
  );
}
