/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PassageDisplay } from '~/components/search/passageDisplay';

export const SearchDisplay = ({ data }: any) => {
    console.log(data.hits)

    return <>
        <div className="flex flex-col gap-2 text-white">
            <div>
                <h1 className='text-xl'>Results:</h1>
            </div>

            <div className="flex flex-row">
                <div className="flex gap-2 p-5">
                    <PassageDisplay passages={ data.hits } />
                </div>
            </div>
            
        </div>
    </>
    
}
