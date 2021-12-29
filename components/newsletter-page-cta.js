import Newsletter from '../components/newsletter'

export default function NewsLetterPageCTA() {
    
    return (
        <div className='flex justify-center bg-black py-12 px-5 sm-px-0'>
            <div className='text-sky-600 w-80 text-2xl font-bold tracking-wider'>
                Sign up for our newsletter for news, deals, and other stuff
            </div>
            <div className='w-72 ml-5'>
                <Newsletter />
            </div>
        </div>
    )
}