import { useState } from 'react'
import axios from 'axios'
import { MdOutlineVerified } from 'react-icons/md'

export default function Newsletter() {
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
        <>
            <div className='flex flex-wrap justify-end'>
                <input
                    className='w-full pl-2 h-10'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div
                    className='bg-sky-600 text-white text-lg text-bold w-fit cursor-pointer px-7 py-2 mt-2'
                    type='button'
                    disabled={state === 'LOADING'}
                    onClick={subscribe}
                >
                    Submit
                </div>
                {state === 'SUCCESS' && (
                    <div className='footer-newsletter-submission-success'>
                        <MdOutlineVerified className='text-white text-4xl mt-2'/>
                    </div>
                )}
            </div>
            {state === 'ERROR' && (
                <p className='text-white text-base mt-2'>{errorMessage}</p>
            )}
        </>
    )
}