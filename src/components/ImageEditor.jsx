import PropTypes from "prop-types";
import { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/crop-utils";

function ImageEditor({ imageSrc, onSave, isAuthorPhoto }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleSave = async (ev) => {
        ev.preventDefault();

        try {
            if (!croppedAreaPixels || croppedAreaPixels.width === 0 || croppedAreaPixels.height === 0) {
                console.error("No se ha seleccionado un área válida para recortar.");
                return;
            }

            const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (croppedImg) {
                console.log("Imagen recortada generada:", croppedImg);
                onSave(croppedImg);
            }
        } catch (error) {
            console.error("Error al obtener la imagen recortada:", error);
        }
    };

    return (
        <div className="imageEditor__container">
            <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={isAuthorPhoto ? 1 : 1} // Siempre cuadrado (1:1)
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape={isAuthorPhoto ? "round" : "rect"} // Redondo para la autora, rectangular para el proyecto
                showGrid={false}
                style={{
                    containerStyle: {
                        width: "100%",
                        height: "400px", // Ajusta la altura según sea necesario
                        position: "relative",
                    },
                }}
            />
            <button className="imageEditor__button" onClick={handleSave}>
                Aceptar encuadre
            </button>
        </div>
    );
}

ImageEditor.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired, // Función para manejar la imagen recortada
    isAuthorPhoto: PropTypes.bool.isRequired,
};

export default ImageEditor;