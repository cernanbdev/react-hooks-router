import Navbar from "./components/Navbar";
import ProjectList from "./pages/ProjectList";
import NewProject from "./pages/NewProject";

// No router yet: every "page" is stacked on one screen.
function App() {
  return (
    <>
      <Navbar />
      <main>
        <h1>Projects</h1>
        <NewProject />
        <ProjectList />
      </main>
    </>
  );
}

export default App;
