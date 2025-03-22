import { useEffect, useState } from 'react';
import '../../styles/layout/ProjectList.scss';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // nuevo estado para loading

  const API_URL = import.meta.env.PROD
  ? "/api/autores"
  : "http://localhost:3000/api/autores";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data.results);
        setError('');
      })
      .catch((err) => {
        console.error("Error al cargar proyectos:", err);
        setError('No se pudieron cargar los proyectos. Intenta más tarde.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  

  return (
    <section className="project-list">
      <h1>Proyectos Personales Molones</h1>

      {isLoading && <p className="project-list__loading">Cargando proyectos...</p>}

      {error && <p className="project-list__error">{error}</p>}

      {!isLoading && !error && projects.map((project) => (
        <article key={project.id} className="project-card">
          <img src={project.image || project.photo} alt={project.autor} />
          <p>{project.job}</p>
          <h2>{project.autor}</h2>
          <h3>{project.name}</h3>
          <p>{project.slogan}</p>
          <p>{project.description}</p>
          <div className="tech">{project.technologies}</div>
          <div className="links">
            <a href={project.repo} target="_blank" rel="noreferrer">📁</a>
            <a href={project.demo} target="_blank" rel="noreferrer">🌐</a>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ProjectList;
