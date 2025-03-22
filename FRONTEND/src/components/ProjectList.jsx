import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProjectDetail() {
    const { id } = useParams(); // ← aquí llega el UUID desde la URL
    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProject(data);
            })
            .catch((err) => console.error('Error al cargar detalle', err));
    }, [id]);

    if (!project) {
        return <p>Cargando...</p>;
    }

    return (
        <section className="project-detail">
            <h2>{project.name}</h2>
            <p>{project.slogan}</p>
            <img src={project.photo || project.image} alt={project.name} />
            <p>{project.description}</p>
            <p><strong>Autor:</strong> {project.autor}</p>
            <p><strong>Puesto:</strong> {project.job}</p>
            <p><strong>Tecnologías:</strong> {project.technologies}</p>
            <a href={project.repo} target="_blank" rel="noreferrer">Repo</a> |{" "}
            <a href={project.demo} target="_blank" rel="noreferrer">Demo</a>
        </section>
    );
}

export default ProjectDetail;