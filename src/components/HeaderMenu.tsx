import { useState } from 'react'

const HeaderMenu = () => {
    const [isShown, setIsShown] = useState(false);

    if (isShown) {
        return (
            <div className="menu">
                <p>Layout Nodes</p>
            </div>
        )
    }
}

export default HeaderMenu