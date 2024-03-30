'use strict';

const ImageHelper = new function () {
    this.getBase64Info = (base64) => {
        const imageTypes = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'svg+xml', 'tiff', 'ico'];
        const fileType = base64.split('/')[1].split(';')[0].toLowerCase();
        const isImage = imageTypes.includes(fileType);
        return { 'isImage': isImage, 'fileType': fileType };
    };

    this.isImage = (base64) => {
        const info = this.getBase64Info(base64);
        return info.isImage;
    };

    this.getBase64Type = (base64) => {
        return this.getBase64Info(base64).fileType;
    };

    this.urlToBase64 = (imgUrl) => {
        return new Promise((resolve, reject) => {
            if (!imgUrl || imgUrl.trim() === "") {
                resolve(null);
                return;
            }

            const isSvgBase64 = imgUrl.startsWith("data:image/svg+xml");
            this.createImage(imgUrl)
                .then((image) => {
                    if (isSvgBase64) {
                        if (!image) {
                            resolve(image);
                            return;
                        }
                        this.svgToPngBase64(image)
                            .then(resolve)
                            .catch(reject);
                    } else if (image instanceof SVGImageElement) {
                        this.svgToPngBase64(image.outerHTML)
                            .then(resolve)
                            .catch(reject);
                    } else if (imgUrl.startsWith("data:image")) {
                        resolve(imgUrl);
                    } else {
                        const canvas = this.createCanvas(image.width, image.height);
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0);
                        resolve(canvas.toDataURL());
                    }
                })
                .catch(reject);
        });
    };

    this.svgToPngBase64 = async (svgBase64) => {
        const svgBuffer = this.base64ToUint8Array(svgBase64);
        const svgString = new TextDecoder().decode(svgBuffer);

        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);

        try {
            const image = await this.createImage(svgUrl);

            const canvas = this.createCanvas(image.width, image.height);
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            const pngBase64 = canvas.toDataURL('image/png').split(',')[1];
            return pngBase64;
        } catch (error) {
            throw new Error('Failed to convert SVG to PNG base64');
        } finally {
            URL.revokeObjectURL(svgUrl);
        }
    };

    this.base64ToUint8Array = async (base64) => {
        const padding = '='.repeat((4 - (base64.length % 4)) % 4);
        const base64Url = [base64, ''].join('').replace(/-/g, '+').replace(/_/g, '/');
        const base64String = `${base64Url}${padding}`;

        const response = await fetch(`data:text/plain;base64,${base64String}`);
        const blob = await response.blob();

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(new Uint8Array(reader.result));
            };
            reader.readAsArrayBuffer(blob);
        });
    };

    this.createImage = (url) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = url;
        });
    };

    this.createCanvas = (width, height) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };

    this.optimizeImageToBase64 = async (file, maxWidth, maxHeight, quality) =>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => reader.onload = resolve);
        const img = new Image();
        img.src = reader.result;
        await new Promise((resolve) => img.onload = resolve);
    
        let width = img.width;
        let height = img.height;
    
        // Convert percentage values to pixel values
        if (typeof maxWidth === 'string' && maxWidth.endsWith('%')) {
            const percentage = parseFloat(maxWidth) / 100;
            maxWidth = Math.round(width * percentage);
        }
    
        if (typeof maxHeight === 'string' && maxHeight.endsWith('%')) {
            const percentage = parseFloat(maxHeight) / 100;
            maxHeight = Math.round(height * percentage);
        }
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
    
        // Resize the image to the specified maxWidth and maxHeight
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }
    
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    
        return canvas.toDataURL(file.type, quality);
    }    
}();