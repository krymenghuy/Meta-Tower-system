'use strict';
/** FileChooser optionally depends on ImageHelper class for methods Imagehelper.isImage() and optimizeImageTobase64() */
class FileChooser{
    constructor(){
        this.fileInput = null;
        this.options = {};
        this.data = {
            optimized_image_base64: null,
        };
        this.onClose = null;
        this.init();
    }

    init(){
        this.fileInput = document.getElementById('_file1111');

        if (!this.fileInput){
            this.fileInput = document.createElement('input');
            this.fileInput.type = 'file';
            this.fileInput.id = '_file1111';
            this.fileInput.accept = 'image/*';
            this.fileInput.style.display = 'none';
            document.body.appendChild(this.fileInput);
        }

        this.fileInput.onchange = async () => {
            const files = this.fileInput.files;
            const file = files[0];

            if(file){
                const op = this.options.imageOptimizeOptions;

                if (op && ImageHelper) {
                    this.data.optimized_image_base64 = await ImageHelper.optimizeImageToBase64(
                        file,
                        op.maxWidth,
                        op.maxHeight,
                        op.quality
                    );
                    console.log('Image optimized');
                }

                const reader = new FileReader();

                reader.onload = (e) => {
                    e.preventDefault();
                    const photoData = e.target.result;
                    const isImage = ImageHelper ? ImageHelper.getBase64Type(photoData) : null;
                    const base64Result = photoData.split(',')[1];
                    let fileType = photoData.split('/')[1].split(';')[0];

                    let g = isImage && this.options.imageOptimizeOptions && this.data.optimized_image_base64;
                    console.log(g ? 'use optimized img ' : 'Not use optimized img');

                    const b = isImage && this.options.imageOptimizeOptions && this.data.optimized_image_base64
                        ? this.data.optimized_image_base64 : base64Result;

                    const p = {
                        dataUrl: photoData,
                        base64: b,
                        photoData: b, /* photoData  is used for backward competibility */
                        file_type: fileType,
                        ext: fileType,
                    };

                    this.fileInput.value = null;

                    if (typeof this.onClose === 'function') {
                        this.onClose(p);
                    }
                };

                reader.readAsDataURL(file);
            }
        };
    }

    chooseFile_internal(options = null, onClose) {
        options = options || {
            imageOptimizeOptions: {
                maxWidth: '60%',
                maxHeight: '60%',
                quality: 0.75,
            },
        };

        options.accept = options.accept || 'image/*';
        this.options = options;
        this.onClose = onClose;
        this.fileInput.accept = options.accept;

        // Trigger a click event on the input element
        this.fileInput.click();
    }

    static chooseFile(options = null, onClos) {
        const f = new FileChooser();
        f.chooseFile_internal(options, onClos);
    }
}