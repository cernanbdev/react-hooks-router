import { Link } from "react-router";

function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </section>
  );
}

export default NotFound;
