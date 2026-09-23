// Debugging challenge: this component has bugs on purpose.
// Leave it as-is until the debugging segment of the session.
import { useParams } from "react-router";
import useFetch from "../hooks/useFetch";

function ProjectDetails() {
  const { id } = useParams();

  const { data } = useFetch("/api/projects/id");

  return <h1>{data.name}</h1>;
}

export default ProjectDetails;
