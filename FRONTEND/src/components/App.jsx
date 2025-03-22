import { useState, useEffect } from 'react';
import '../styles/App.scss';
import Header from './Header';
import Footer from './Footer';
import Landing from './Pages/Landing';
import Form from './Form';
import Preview from './Preview';
import { Route, Routes, Link } from "react-router-dom";
import ProjectList from './Pages/ProjectList';

function App() {

  const [error, setError] = useState('');

  const [projectUrl, setProjectUrl] = useState('');

  const [projectData, setProjectData] = useState(() => {
    const savedData = localStorage.getItem('projectData');
    return savedData ? JSON.parse(savedData) : {
      name: "",
      slogan: "",
      technologies: "",
      repo: "",
      demo: "",
      description: "",
      autor: "",
      job: "",
      image: "",
      photo: "",
    };
  });

  useEffect(() => {
    if (projectData.name) {
      localStorage.setItem('projectData', JSON.stringify(projectData));
    }
  }, [projectData]);

  //FETCH 

  const handleSubmit = (ev) => {
    ev.preventDefault();

    const previousProjects = JSON.parse(localStorage.getItem("projects")) || [];
    const newProject = { ...projectData, dateAdded: new Date().toISOString() };
    const allProjects = [...previousProjects, newProject];
    localStorage.setItem("projects", JSON.stringify(allProjects));

const API_URL = import.meta.env.PROD ? "/api/autores" : 'http://localhost:3000/api/autores';

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    })
      .then(response => response.json())
      .then((responseData) => {


        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        if (responseData.success === false) {
          setError(responseData.message || responseData.error || 'Error desconocido');
        } else {
          setProjectUrl(responseData.cardURL);
          setError(''); // Limpia errores anteriores
        }
        console.log("Servidor respondió:", responseData);
      })
      .catch((err) => {
        setError('Error al conectar con el servidor. Inténtalo más tarde.');
        console.error('Error en el fetch:', err);
      });

  }


  return (
    <>
      {" "}
      <div className="container">
        <Header />

        <main>
          <Routes>

            <Route index element={<Landing />} />
            <Route path="list" element={<ProjectList />} />

            <Route path="create"
              element={<div className="createPage">
                <Preview projectData={projectData} />
                <Form projectData={projectData} setProjectData={setProjectData} handleSubmit={handleSubmit} error={error} projectUrl={projectUrl} />
              </div>
              } />

            <Route path="*"
              element={
                <div>
                  <p>Error 404 - Página no encontrada</p>
                  <Link to="/" className="button">
                    Volver a la home
                  </Link>
                </div>
              } />

          </Routes>

        </main>

        <Footer />

      </div >
    </>
  );
}

export default App;