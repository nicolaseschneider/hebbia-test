import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export interface FileIndex {
    index: number;
    filename: string;
    body: string;
    uploadedAt: number;
    objectID: string,
}

export const readBase64AsText = async (base64: string) => {
    const fileBlob = b64toBlob(base64);
    return await fileBlob.text()
}
export const readBase64AsPDF = async (base64: string) => {
    const fileBlob = b64toBlob(base64, 'application/pdf');
    return await fileBlob.text()
}

function b64toBlob(b64Data: string, contentType?: string, sliceSize?: number) {
    contentType = contentType || 'text';
    sliceSize = sliceSize || 512;
  
    const b64DataString = b64Data.substr(b64Data.indexOf(',') + 1);      
    const byteCharacters = atob(b64DataString);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
}

export const oneTimeMegaUploadProcess = ():FileIndex[][] => {
    console.log('Here comes the big one...')
    const fileFolderPath = './txtfiles/';
    const allFileNames = fs.readdirSync(fileFolderPath).map(fileName => fileName);
    const allIndexes: FileIndex[][] = []
    for (let i = 0; i < allFileNames.length; i++) {
        const data = fs.readFileSync(`${fileFolderPath}${allFileNames[i] as string}`, 'utf8');
        allIndexes.push(processTextBody(data, allFileNames[i] as string, new Date().getTime()))   
    }
    return allIndexes
}

export const processTextFile = async ({ filename, base64, uploadedAt }: { filename: string, base64: string, uploadedAt: number }): Promise<Array<FileIndex>> => {
    const bodyText = await readBase64AsText(base64)
    return processTextBody(bodyText, filename, uploadedAt)
}

// export const processPDFFile = async ({ filename, base64, uploadedAt}:{ filename: string, base64: string, uploadedAt: number }): string => {
//     const blob = b64toBlob(base64, 'application/pdf')
//     return await blob.text;
// }

export const processTextBody = (body: string, filename: string, uploadedAt: number) => {
    const bodySplit = body.split(' ')
    const numPassages = Math.floor(bodySplit.length / 100) + 1
    console.log(`quick stats on data being processed:  
        \n number of passages: ${numPassages}
        \n character length of text: ${bodySplit.length}
    `)
    const indexes: Array<FileIndex> = []

    for (let i = 0; i < numPassages; i++) {
        const sliceStart = i * 100;
        let passage = "";
        if (i === numPassages - 1) {
            // Slice to end of splitBody array, create FileIndex
            passage = bodySplit.slice(sliceStart).join(" ");
        } else {
            passage = bodySplit.slice(sliceStart, sliceStart + 99).join(" ");
        }
        indexes.push({
            filename,
            uploadedAt,
            body: passage,
            objectID: uuidv4(),
            index: i,
        })
    }
    return indexes
}


