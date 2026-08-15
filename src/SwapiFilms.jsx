import useFetch from "./useFetch";

function SwapiFilms() {
  const { data, loading, error } = useFetch("https://swapi.info/api/films");

  if (error) {
    return <div>There was an error {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Films</h1>
      {data.map((film) => (
        <h1>{film.title}</h1>
      ))}
    </div>
  );
}

export default SwapiFilms;
