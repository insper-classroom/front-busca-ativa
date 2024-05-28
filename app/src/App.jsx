import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StudentTable from './components/StudentTable';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <SearchBar />
      <StudentTable />
    </div>
  );
}

export default App;
