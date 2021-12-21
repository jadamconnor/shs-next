import { BiSearch } from 'react-icons/bi'

export default function Header(menu) {
    return (
        <div className="header">
            <div className="top-nav">
                <div className="header-container">
                </div>
            </div>
            <div className="primary-nav">
                <div className="header-container">
                    <div className="primary-nav-wrapper">
                        <div className="logo">
                        </div>
                        <div className="nav-menu">
                            {menu?.menu?.menuItems?.nodes.map((el) => (
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