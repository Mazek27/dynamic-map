export const PngMimeType = "image/png"
export const JpgMimeType = "image/jpeg"

export interface FileDescription {
    name: string,
    type: string,
    data: any
}

export function downloadFile(fileDescription: FileDescription) {
    console.log(11)
    const blob = prepareBlobFor(fileDescription);

    // if (window.navigator.msSaveBlob) {
    try{
        console.log(15)
        window.navigator.msSaveOrOpenBlob(blob, fileDescription.name);
    } catch(ex) {
    console.log(17)
        const url = window.URL.createObjectURL(blob);


        const anchor = document.createElement("a");
        anchor.download = fileDescription.name;
        anchor.href = url;
        anchor.target = "_blank";
        anchor.className = "hidden";

        document.body.appendChild(anchor);

        anchor.click();

        setTimeout(() => {
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

export function prepareBlobFor(file: FileDescription): Blob {
    if (isImageMimeType(file.type)) {
        console.log(42)
        console.log(file.data.toDataURL)
        // let image = file.data.toDataURL(file.type).replace(file.type, "image/octet-stream");
        if(file.data.msToBlob) {
            console.log(43)
            console.log(typeof(file.data));
            var blob = file.data.msToBlob();
            console.log(43.5)
            window.navigator.msSaveBlob(blob, 'dicomimage.png');
            console.log(43.6)
        }else {

            let image = file.data.toDataURL(file.type).replace(file.type, "image/octet-stream");
            console.log(44)
            return dataURItoBlob(image);
        }
    }

    return new Blob([file.data], {  type: file.type });
}

function isImageMimeType(mimeType: string): boolean {
    switch (mimeType) {
        case PngMimeType:
        case JpgMimeType:
            return true;
        default:
            return false;
    }
}

function dataURItoBlob(dataURI: string): Blob {

    let byteString;
    if (isBase64Encoded(dataURI)) {
        byteString = atob(dataURI.split(',')[1]);
    }
    else {
        byteString = unescape(dataURI.split(',')[1]);
    }

    let mimeString = toMimeString(dataURI);

    return new Blob([dataToBlob(byteString)], { type: mimeString });
}

function dataToBlob(byteString: string) {
    let dataToBlob = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        dataToBlob[i] = byteString.charCodeAt(i);
    }
    return dataToBlob
}

function isBase64Encoded(dataURI: string): boolean {
    return dataURI.split(',')[0].indexOf('base64') >= 0
}

function toMimeString(dataURI: string): string {
    return dataURI.split(',')[0].split(':')[1].split(';')[0]
}

export function getFileExtension(fileName: string): string {
    const indexOfDot = fileName ? fileName.lastIndexOf(".") : -1;
    if (indexOfDot < 0) {
        return null;
    }

    return fileName.substring(indexOfDot);
}

export function getFileNameWithoutExtension(fileName: string): string {
    const indexOfLastDot = fileName ? fileName.lastIndexOf(".") : -1;
    if (indexOfLastDot < 0) {
        return fileName;
    }

    return fileName.substring(0, indexOfLastDot);
}