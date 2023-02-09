import './App.css'
import 'vite/modulepreload-polyfill'
import RecordsTable from './components/table.jsx'

function App() {
  return (
    <div className="App">
      <h1>MSJ Boys Tennis Tryouts</h1>
      <RecordsTable/>
    </div>
  )
}

export default App