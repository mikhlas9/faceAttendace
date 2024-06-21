import  {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import HomePage from "./components/HomePage";
import ClassPage from "./components/ClassPage";
import StudentsPage from "./components/StudentsPage";
import AttendancePage from "./components/AttendancePage";
import ScanPage from "./components/ScanPage";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/class/:classId" element={<ClassPage />} />
          <Route path="/class/:classId/students" element={<StudentsPage />} />
          <Route path="/class/:classId/attendance" element={<AttendancePage />} />
          <Route path="/class/:classId/scan" element={<ScanPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
