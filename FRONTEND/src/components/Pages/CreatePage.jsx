import PropTypes from 'prop-types';

import Hero from "../Hero";
import Preview from "../Preview";
import Form from "../Form";

function CreatePage({ projectData, setProjectData, handleSubmit, error, projectUrl }) {

    return (

        <main className="main">
            <Hero />

            <div className="createPage">
                <Preview projectData={projectData} />
                <Form projectData={projectData} setProjectData={setProjectData} handleSubmit={handleSubmit} error={error} projectUrl={projectUrl} />

            </div>

        </main>

    )
}

CreatePage.propTypes = {
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
    error: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
    setProjectData: PropTypes.func.isRequired,
    projectUrl: PropTypes.string,
};

export default CreatePage;