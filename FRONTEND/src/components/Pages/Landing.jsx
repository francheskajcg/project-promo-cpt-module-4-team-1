import { Link } from "react-router";

import Graphic from '../../images/adalab-graphic.png';

function Landing() {

    return (
        <>
            <section className="landing">

                <img className="graphic" src={Graphic} alt="adalab-graphic" />
                <h1 className="titleh1">Proyectos molones</h1>
                <p className="landing__text">Escaparate en línea para recoger ideas a través de la tecnología</p>
                <div className="btn__links">
                <Link to="/create" className="button--link" >Nuevo Proyecto</Link>
                <Link to="/list" className="button--link" >Ver proyectos</Link>
                </div>
            </section>
        </>
    )
}

export default Landing;