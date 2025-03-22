import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <h2 className="title">Proyectos Molones</h2>
      <p className="hero__text">
        Escaparate en línea para recoger ideas a través de la tecnología
      </p>
      <Link to="/list" className="button--link">
        Ver proyectos
      </Link>
    </section>
  );
}

export default Hero;
