import useFetch from "./useFetch";
import useInput from "./useInput";
import Routes from "react";
import { BrowserRouter } from "react-router";

function GithubProfile() {
  const githubUser = useInput("");
  const { data, loading, error } = useFetch(
    `https://api.github.com/users/${githubUser.value}`,
  );

  console.log(data);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <input {...githubUser} type="text" />
      <h1>Github Profile</h1>
      <p>Username: {data?.login}</p>
      <p>Location: {data?.location}</p>
    </BrowserRouter>
  );
}

export default GithubProfile;
