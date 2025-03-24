import { useEffect, useState } from "react";
import "../../styles/layout/ProjectList.scss";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.PROD
    ? "/api/autores"
    : "http://localhost:3000/api/autores";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProjects(data.results);
        setError("");
      })
      .catch((err) => {
        console.error("Error al cargar proyectos:", err);
        setError("No se pudieron cargar los proyectos. Intenta más tarde.");
      })
      .finally(() => setIsLoading(false));
  }, []);
  return (
    <section className="project-list">
      <h1>Proyectos Personales Molones</h1>

      {isLoading && (
        <p className="project-list__loading">Cargando proyectos...</p>
      )}
      {error && <p className="project-list__error">{error}</p>}

      {!isLoading &&
        !error &&
        projects.map((project) => (
          <article key={project.id} className="project-card">
            <h2 className="project-card__title">
              <span className="project-card__title__text">{project.name}</span>
            </h2>

            <div className="project-card__author">
              <div className="project-card__photo">
                <img
                  src={project.image || "/images/avatar.webp"}
                  alt={project.autor}
                />
              </div>
              <p className="project-card__job">{project.job}</p>

              <h3 className="project-card__name">{project.autor}</h3>
            </div>

            <div className="project-card__content">
              <p className="project-card__slogan">{project.slogan}</p>
              <p className="project-card__desc">{project.description}</p>
              <p className="project-card__tech">{project.technologies}</p>

              <div className="project-card__links">
                {project.demo && (
                  <a
                    className="icon icon__www"
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                )}
                {project.repo && (
                  <a
                    className="icon icon__github"
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                  ></a>
                )}
              </div>
            </div>
          </article>
        ))}
    </section>
  );
}

export default ProjectList;
