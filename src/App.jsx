import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Module1 from './pages/Module1'
import Module2 from './pages/Module2'
import Module3 from './pages/Module3'
import Module4 from './pages/Module4'
import CpuScheduling from './pages/simulations/CpuScheduling'
import MemoryPartitioning from './pages/simulations/MemoryPartitioning'
import PageReplacement from './pages/simulations/PageReplacement'
import DiskScheduling from './pages/simulations/DiskScheduling'
import Deadlock from './pages/simulations/Deadlock'
import './index.css'


function App() {
  return (
    // 2. Use the Router (HashRouter) here
    <Router>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/module1" element={<Module1 />} />
          <Route path="/module2" element={<Module2 />} />
          <Route path="/module3" element={<Module3 />} />
          <Route path="/module4" element={<Module4 />} />
          <Route path="/sim/cpu-scheduling" element={<CpuScheduling />} />
          <Route path="/sim/memory-partitioning" element={<MemoryPartitioning />} />
          <Route path="/sim/page-replacement" element={<PageReplacement />} />
          <Route path="/sim/disk-scheduling" element={<DiskScheduling />} />
          <Route path="/sim/deadlock" element={<Deadlock />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
