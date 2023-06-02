/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from 'react';
import { api } from "~/utils/api";

export const ExpandableWindow = ({ fileName, target }: { fileName: string, target: string}) => {

    const { data, error, isFetching } = api.hebbia.getFile.useQuery({ fileName });
    const [expanded, setExpanded] = useState(false);

    if (!expanded) {
        return <>
            <div
                className='border-b-1 border-white border-solid'
                onClick={() => setExpanded(true)}
            >Click Me to view this file!</div>
        </>
    }
    if (data && data.fileType === 'txt') {
        const decodedContent = atob(data.base64EncodedFile)
        return (<>

            <a className='border-solid border-2 border-white rounded'href={`#${target}${fileName}`}>Jump to Highlighted text</a>
            <div className='text-display border-solid border-2 border-white rounded scroll-smooth' style={{
                height: '300px',
                overflow: 'auto',
            }}>
                <>
                    {
                        decodedContent.split('\n').map(line => {
                            if (line.includes(target)) {
                                return <span id={`${target}${fileName}`} key={Math.random() * 20000}>{line}</span>
                            }
                            return <p key={Math.random() * 20000}>{line}</p>
                        })
                    }
                </>
            </div>
        </>)
    } else if (data && data.fileType === 'pdf') {
        return <>
        <iframe style={{ height: '800px', width:'1200px', overflow: 'auto' }}src={`data:application/pdf;base64,${data.base64EncodedFile}`} />
        </>
    } else {
        return <></>
    }
};
