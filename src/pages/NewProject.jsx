import { useState } from "react";

function NewProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      await response.json();

      // TODO: send the user to the new project's page.
      setSaving(false);
    } catch {
      setError("Unable to save project. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>New project</h2>

      <label htmlFor="project-name">Name</label>
      <input
        id="project-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="project-description">Description</label>
      <textarea
        id="project-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={3}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save project"}
      </button>
    </form>
  );
}

export default NewProject;
