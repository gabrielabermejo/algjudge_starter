import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage.jsx";
import ChallengesPage from "../pages/ChallengesPage.jsx";
import ChallengeDetailPage from "../pages/ChallengeDetailPage.jsx";
import SubmissionPage from "../pages/SubmissionPage.jsx";
import CreateChallengePage from "../pages/CreateChallengePage.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-challenge" element={<CreateChallengePage />} />
      <Route path="/challenges" element={<ChallengesPage />} />
      <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
      <Route path="/challenges/:id/submit" element={<SubmissionPage />} />

      <Route path="*" element={<ChallengesPage />} />
    </Routes>
  );
}
