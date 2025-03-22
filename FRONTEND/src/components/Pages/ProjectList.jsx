import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layout/ProjectList.scss';

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/autores")
      .then((res) => res.json())
      .then((data) => setProjects(data.results))
      .catch((err) => console.error("Error al cargar proyectos:", err));
  }, []);

  return (
    <section className="project-list">
      <h1>Proyectos Personales Molones</h1>
      {projects.map((project) => (
        <article key={project.id} className="project-card">
          <img src={project.image || project.photo} alt={project.autor} />
          <p>{project.job}</p>
          <h2>{project.autor}</h2>
          <h3>{project.name}</h3>
          <p>{project.slogan}</p>
          <p>{project.description}</p>
          <div className="tech">{project.technologies}</div>
          <div className="links">
            <a href={project.repo} target="_blank">📁</a>
            <a href={project.demo} target="_blank">🌐</a>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ProjectList;