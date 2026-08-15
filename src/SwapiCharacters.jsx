import useFetch from "./useFetch";

function SwapiCharacters() {
  const { data, loading, error } = useFetch("https://swapi.info/api/people");
  console.log(data);

  if (error) {
    return <div>There was an error {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>People</h1>
      {data.map((person) => (
        <h1>{person.name}</h1>
      ))}
    </div>
  );
}

export default SwapiCharacters;
