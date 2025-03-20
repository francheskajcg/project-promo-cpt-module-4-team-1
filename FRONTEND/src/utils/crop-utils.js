export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const { x, y, width, height } = croppedAreaPixels;

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(
                image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
            );

            const base64Image = canvas.toDataURL("image/jpeg");
            resolve(base64Image);
        };

        image.onerror = (err) => reject(err);
    });
};