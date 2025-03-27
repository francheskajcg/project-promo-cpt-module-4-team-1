import { useEffect, useState } from "react";
import { Link } from "react-router";
import "../../styles/layout/ProjectList.scss";
import Hero from "../Hero";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.PROD
    ? "https://project-promo-cpt-module-4-team-1-njsx.onrender.com/api/autores"
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
      <Hero />
      <Link to="/create" className="button--link">
        Nuevo Proyecto
      </Link>
      <section className="previewList">
        {isLoading && (
          <p className="project-list__loading">Cargando proyectos...</p>
        )}
        {error && <p className="project-list__error">{error}</p>}

        {!isLoading &&
          !error &&
          projects.map((project) => (
            <article key={project.id} className="cardList">
              <a
                href={`https://project-promo-cpt-module-4-team-1-njsx.onrender.com/autores/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn_link"
              >
                Ver detalles
              </a>
              <h2 className="cardList__projectTitle">
                <span className="cardList__projectTitle__text">
                  {project.name}
                </span>
              </h2>

              <div className="cardList__author">
                <div className="cardList__authorPhoto">
                  <img
                    className="cardList__uploadAuthorPhoto"
                    src={project.image || "/images/avatar.webp"}
                    alt={project.autor}
                  />
                </div>

                <p className="cardList__job">{project.job}</p>

                <h3 className="cardList__name">{project.autor}</h3>
              </div>

              <div className="cardList__project">
                <h3 className="cardList__name">{project.name}</h3>
                <p className="cardList__slogan">{project.slogan}</p>

                <p className="cardList__description">{project.description}</p>

                <div className="cardList__technicalInfo">
                  <p className="cardList__technologies">
                    {project.technologies}
                  </p>

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
