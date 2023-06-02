import { z } from 'zod'
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

import {
    type FileIndex,
    processTextFile,
    processTextBody,
 } from "~/utils/fileProcessing";

import { env } from "~/env.mjs";
import algoliasearch from 'algoliasearch'
import fs from 'fs'



// Connect and authenticate with your Algolia app
const client = algoliasearch(env.ALGOLIA_APP_ID, env.ALGOLIA_ADMIN_KEY)


export const hebbiaRouter = createTRPCRouter({
    getFile: publicProcedure
        .input(z.object({
            fileName: z.string()
        }))
        .query(({input}) => {
            let path: string;
            const pdfFileFolderPath = './pdffiles/'
            const textfileFolderPath = './txtfiles/'
            const fileExtension = input.fileName.split('.')[input.fileName.split('.').length - 1]
            console.log(fileExtension)
            if (fileExtension === 'pdf') {
                path = `${pdfFileFolderPath}${input.fileName}`
            } else {
                path = `${textfileFolderPath}${input.fileName}`
            }
            const contents = fs.readFileSync(path, {encoding: 'base64'});
            return {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                base64EncodedFile: contents,
                fileType: fileExtension
            }
        }),

    fileSearch: publicProcedure
        .input(z.object({ 
            query: z.string(),
        }))
        .query(({ input }) => {
            console.log(input.query)

            const index = client.initIndex('hebbib_index')
            return index.search(input.query);
        }),

    fileUpload: publicProcedure
        .input(z.object({ 
            file: z.string(),
            uploadedAt: z.number(),
            fileName: z.string(),
         }))
        .mutation(async ({ input }) => {
            const index = client.initIndex('hebbib_index')
 
            const base64Encoded = input.file
            let fileIndexes: Array<FileIndex>;

            // console.log('uploading file...')
            
            const filenameSplit = input.fileName.split('.')

            if (filenameSplit[filenameSplit.length-1] === 'txt') {
                console.log('Processing .txt file...')

                fileIndexes = await processTextFile({
                    base64: base64Encoded,
                    filename: input.fileName,
                    uploadedAt: input.uploadedAt,
                }).then(data => data)
                await index.saveObjects(fileIndexes).then(_ => {
                    console.log(`${input.fileName} was uploaded sucessfully!`)
                });

            } else if (filenameSplit[filenameSplit.length - 1] === 'pdf') {

                // console.log('Processing .pdf file...')
                // const text = await readBase64AsPDF(input.file).then(data => console.log({data}));
                // console.log({text})

                const buffer = Buffer.from(input.file, 'base64')
                // console.log(input.file); 

                fs.writeFileSync('result.pdf', buffer);
                const fileFolderPath = './pdffiles/'
                const allFileNames = fs.readdirSync(fileFolderPath).map(fileName => fileName);
                const allIndexes: FileIndex[][] = []
                for (let i = 0; i < allFileNames.length; i++) {
                    // const buffer = fs.readFileSync(`${fileFolderPath}${allFileNames[i] as string}`);
                    // const data = (await PdfParse(buffer).then(pdfData => pdfData)).text;
                    // allIndexes.push(processTextBody(data, allFileNames[i] as string, new Date().getTime()))

                    const data = fs.readFileSync(`${fileFolderPath}${allFileNames[i] as string}`, 'utf8');
                    allIndexes.push(processTextBody(data, allFileNames[i] as string, new Date().getTime()))   
     
                }
                // await Promise.all(allIndexes.map((indexArray) => 
                //     index.saveObjects(indexArray).wait()
                // ))
            }
            
        }),

    // triggerUpload: publicProcedure
    //     .input(z.object({
    //         x: z.string()
    //     }))
    //     .query(async () => {
    //         const index = client.initIndex('hebbib_index');
    //         console.log('UPLOADING ALL THE FILES NOW')
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         const allIndexes = oneTimeMegaUploadProcess();
    //         await Promise.all(allIndexes.map((indexArray) => 
    //             index.saveObjects(indexArray).wait()
    //         ))
    //     })

        
})
