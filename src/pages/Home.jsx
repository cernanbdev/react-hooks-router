import { Link } from "react-router";

function Home() {
  return (
    <section>
      <h1>Project Showcase</h1>
      <p>A small portfolio app built with custom hooks and React Router.</p>
      <p>
        <Link to="/projects">Browse projects</Link>
      </p>
    </section>
  );
}

export default Home;
