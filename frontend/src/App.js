import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import ProtectedRoute from "./components/ProtectedRoute";
import { HomePage } from "./views";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        {/* <Route exact path="/" element={<ProtectedRoute />}>
          <Route exact path="/protect" element={<HomePage />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
