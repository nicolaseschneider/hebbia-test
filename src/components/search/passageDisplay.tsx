/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExpandableWindow } from "./expandableWindow"
export const PassageDisplay = ({ passages }: any) => {

    return (<>
        <div className="flex flex-col p-3 gap-2">
            
            { passages.map((hit: {
                filename: string, _highlightResult: { body: { value: string } } 
            })=> {
                console.log(hit);
                const htmlText = `<p>${hit._highlightResult.body.value}</p>`
                return (
                    <div className='border-b-2 border-white border-solid' key={Math.random() * 1500 }>
                        <div className='border-b-2 border-blue-900 border-solid'>
                            <h2 className='text-xl'> Filename: {hit.filename}</h2>
                        </div>
                        <h2 className='text-xl'>Passage: </h2>
                        <div
                            dangerouslySetInnerHTML={{__html: htmlText}}
                        />
                        <ExpandableWindow fileName={hit.filename} target={hit._highlightResult.body.matchedWords}/>
                    </div>)
                
            })}
        </div>
    </>)
}
