import { Link, useNavigate } from "react-router";

function Home() {
  let navigate = useNavigate();

  function navigateToFilms() {
    // assume this function does a lot of stuff
    // and we want to navigate to the films page
    // after it's done with it's work
    navigate("/films");
  }

  return (
    <div>
      <Link to="/films">Link to Films</Link>
      <button onClick={navigateToFilms}>Go to Films</button>
    </div>
  );
}

export default Home;
