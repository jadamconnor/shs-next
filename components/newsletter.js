import { useState } from 'react'
import axios from 'axios'
import { MdOutlineVerified } from 'react-icons/md'

export default function Newsletter({ mode }) {
    const [email, setEmail] = useState('')
    const [state, setState] = useState('IDLE')
    const [errorMessage, setErrorMessage] = useState(null)

    const subscribe = async () => {
        setState('LOADING')
        setErrorMessage(null)

        try {
            const response = await axios.post('../api/newsletter', { email })
            setState('SUCCESS')
        } catch (e) {
            setErrorMessage(e.response.data.error)
            setState('ERROR')
        }
    }

    return (
        <div className='w-full'>
            <div className='flex flex-wrap justify-end'>
                <input
                    className={mode === 'light' ? `bg-gray-200 w-full pl-2 h-10` : `bg-white w-full pl-2 h-10`}
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {state === 'SUCCESS' && (
                    <div className={mode === 'light' ? 'inline-flex text-black items-center w-1/2 text-2xl mt-2' : 'inline-flex text-white items-center w-1/2 text-2xl mt-2'}>
                        <MdOutlineVerified/><span className='ml-1'> Subscribed</span>
                    </div>
                )}
                <div
                    className='bg-sky-600 text-white text-lg text-bold w-fit cursor-pointer px-7 py-2 mt-2 appearance-none'
                    type='button'
                    disabled={state === 'LOADING'}
                    onClick={subscribe}
                >
                    Submit
                </div>
            </div>
            {state === 'ERROR' && (
                <div className={mode === 'light' ? 'text-black text-base mt-2' : 'text-white text-base mt-2'}>
                    {errorMessage}
                </div>
            )}
        </div>
    )
}