function ProjectCard({ project }) {
  return (
    <article className="card">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
    </article>
  );
}

export default ProjectCard;
