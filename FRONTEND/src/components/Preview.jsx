import PropTypes from "prop-types";

function Preview({ projectData }) {
  return (
    <section className="preview">
      <div className="projectImage">
        {projectData.photo && (
          <img
            className="uploadProjectImage"
            src={projectData.photo}
            alt="Vista previa del proyecto"
          />
        )}
      </div>

      <article className="card">
        <h2 className="card__projectTitle">
          <span className="card__projectTitle__text">
            {projectData.name || "Personal project card"}
          </span>
        </h2>

        <div className="card__author">
          <div className="card__authorPhoto">
            {projectData.image && (
              <img
                className="card__uploadAuthorPhoto"
                src={projectData.image}
                alt="Foto de la autora"
              />
            )}
          </div>

          <p className="card__job">
            {projectData.job || "Full stack Developer"}
          </p>
          <h3 className="card__name">
            {projectData.autor || "Emmelie Bjôrklund"}
          </h3>
        </div>

        <div className="card__project">
          <h3 className="card__name">
            {projectData.name || "Elegant Workspace"}
          </h3>
          <p className="card__slogan">
            {projectData.slogan || "Diseños Exclusivos"}
          </p>
          <p className="card__description">
            {projectData.description || "Descripción del proyecto aquí..."}
          </p>

          <div className="card__technicalInfo">
            <p className="card__technologies">
              {projectData.technologies || "React JS - HTML - CSS"}
            </p>

            {projectData.demo && (
              <a
                className="icon icon__www"
                href={projectData.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Web link
              </a>
            )}
            {projectData.repo && (
              <a
                className="icon icon__github"
                href={projectData.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub link
              </a>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

Preview.propTypes = {
  projectData: PropTypes.shape({
    name: PropTypes.string,
    slogan: PropTypes.string,
    technologies: PropTypes.string,
    repo: PropTypes.string,
    demo: PropTypes.string,
    description: PropTypes.string,
    autor: PropTypes.string,
    job: PropTypes.string,
    image: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};

export default Preview;
