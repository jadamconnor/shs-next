import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faArrowRight } from '@fortawesome/pro-regular-svg-icons'
import { kebabCase } from '../lib/utils'

export default function Accordion({primary, secondary, onToggleNav}) {
    const [isShowing, setIsShowing] = useState(false);

    const toggle = () => {
        setIsShowing(!isShowing);
    };

    return (
        <div>
            <div
                onClick={toggle}
                className={
                    isShowing ? 
                        'flex text-white tracking-wider justify-between items-end  h-20' 
                    : 
                        'flex text-white tracking-wider justify-between items-end border-b-2 border-b-gray-400 h-20'}
            >
                <div className='text-white pb-3'>
                        <div className='flex items-center'>
                            <div  className={isShowing ? 'text-sky-600 text-xl mr-3' : 'hidden'}>
                                <FontAwesomeIcon icon={faArrowRight}/>
                            </div>
                            <div className='text-3xl '>
                                {primary}
                            </div>
                        </div>
                </div>
                <div className={isShowing ? 'hidden' : 'text-sky-600 font-light pb-3 text-2xl'}>
                    <FontAwesomeIcon icon={faChevronDown}/>
                </div>
                <div className={isShowing ? 'text-sky-600 font-light pb-3 text-2xl' : 'hidden'}>
                <FontAwesomeIcon icon={faChevronUp}/>
                </div>
            </div>
            <div className='ml-8'>
                    {secondary.map((el) => (
                        <div className={isShowing ? 'h-fit text-white text-2xl py-3 transition-all ease-in-out duration-400' : 'h-0 transition-all ease-in-out duration-400'} key={el.id}>
                            <a href={`../category/${kebabCase(el.label)}`} onClick={onToggleNav}>
                                {el.label}
                            </a>
                        </div>
                    ))}
            </div>
        </div>
    )
}
