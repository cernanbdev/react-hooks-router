import { NavLink, Outlet } from "react-router";

function Layout() {
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/films">Films</NavLink>
          <NavLink to="/people">Characters</NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default Layout;
