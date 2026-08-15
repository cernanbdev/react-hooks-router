import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Search from "./Search";
import Form from "./Form";
import SwapiFilms from "./SwapiFilms";
import SwapiCharacters from "./SwapiCharacters";
import GithubProfile from "./GithubProfile";
import { Routes, Route } from "react-router";
import Layout from "./Layout";
import Home from "./Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="films" element={<SwapiFilms />} />
        <Route path="people" element={<SwapiCharacters />} />
      </Route>
    </Routes>
  );
}

export default App;
