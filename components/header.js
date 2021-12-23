import { BiSearch } from 'react-icons/bi'
import { FaTwitterSquare, FaInstagramSquare, FaFacebookSquare } from 'react-icons/fa'

export default function Header(menu) {
    return (
        <div className="header">
            <div className="top-nav">
                <div className="header-container">
                    <div className="top-nav-menu">
                        <div className="top-nav-menu-item">
                            Contact Us
                        </div>
                        <div className="top-nav-menu-item">
                            Subscribe
                        </div>
                        <div className="top-nav-menu-item">
                            <FaFacebookSquare/>
                        </div>
                        <div className="top-nav-menu-item">
                            <FaInstagramSquare/>
                        </div>
                        <div className="top-nav-menu-item">
                            <FaTwitterSquare/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="primary-nav">
                <div className="header-container">
                    <div className="primary-nav-wrapper">
                        <div className="logo">
                        </div>
                        <div className="nav-menu">
                            {menu?.menu?.nodes[0]?.menuItems?.nodes.map((el) => (
                                <div className="nav-menu-item" key={el.id}>
                                    {el.label}
                                </div>
                            ))}
                            <div className='nav-menu-item'>
                                <BiSearch className="nav-search"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}