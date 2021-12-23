export default function Header({ myMenu }) {
    return (
        <div className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-1">
                        <div className="footer-newsletter-callout-heading">
                            Sign up for our newsletter
                        </div>
                    </div>
                    <div className="col-1">
                    </div>
                    <div className="col-1">
                        <div className="footer-menu-left">
                            {myMenu.slice(0,2).map((el) => (
                                <div className="footer-menu-wrapper" key={el.id}>
                                    {el.name}
                                    {el.menuItems.nodes.map((e) => (
                                        <div className="footer-menu-item" key={e.id}>
                                            {e.label}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-1">
                        <div className="footer-menu-right">
                            {myMenu.slice(2,4).map((el) => (
                                <div className="footer-menu-wrapper" key={el.id}>
                                    {el.name}
                                    {el.menuItems.nodes.map((e) => (
                                        <div className="footer-menu-item" key={e.id}>
                                            {e.label}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}