import { useEffect, useState } from "react";
import "../../styles/layout/ProjectList.scss";
import Hero from "../Hero";

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
    <>
      <Hero buttonText="Nuevo Proyecto" />
      <section className="preview">
        <h1>Proyectos Personales Molones</h1>

        {isLoading && (
          <p className="project-list__loading">Cargando proyectos...</p>
        )}
        {error && <p className="project-list__error">{error}</p>}

        {!isLoading &&
          !error &&
          projects.map((project) => (
            <article key={project.id} className="card">
              <h2 className="card__projectTitle">
                <span className="card__projectTitle__text">{project.name}</span>
              </h2>

              <div className="card__author">
                <div className="card__authorPhoto">
                  <img
                    className="card__uploadAuthorPhoto"
                    src={project.image || "/images/avatar.webp"}
                    alt={project.autor}
                  />
                </div>

                <p className="card__job">{project.job}</p>

                <h3 className="card__name">{project.autor}</h3>
              </div>

              <div className="card__project">
                <h3 className="card__name">{project.name}</h3>
                <p className="card__slogan">{project.slogan}</p>
                <h3 className="card__descriptionTitle">Product description</h3>
                <p className="card__description">{project.description}</p>

                <div className="card__technicalInfo">
                  <p className="card__technologies">{project.technologies}</p>

                  {project.demo && (
                    <a
                      className="icon icon__www"
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Web link
                    </a>
                  )}
                  {project.repo && (
                    <a
                      className="icon icon__github"
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub link
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
      </section>
    </>
  );
}

export default ProjectList;
