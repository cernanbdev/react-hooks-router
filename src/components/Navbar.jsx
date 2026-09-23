// Plain <a> tags: every click reloads the whole page from the server.
function Navbar() {
  return (
    <nav className="navbar" aria-label="Main">
      <a href="/">Home</a>
      <a href="/projects">Projects</a>
      <a href="/about">About</a>
    </nav>
  );
}

export default Navbar;
