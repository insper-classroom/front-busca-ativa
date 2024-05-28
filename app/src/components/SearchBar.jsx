import React from 'react';
import './static/SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Nome do aluno" />
      <button type="button">🔍</button>
    </div>
  );
};

export default SearchBar;
