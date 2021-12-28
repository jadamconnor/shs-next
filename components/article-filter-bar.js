import { useState } from 'react'

export default function ArticleFilterBar ({ myMenu, myCategory, onFilter }) {
    const tabsPaginate = 7;
    const [moreTabs, setMoreTabs] = useState(
        "hidden"
    )
    const toggleMoreTabs = () => {
        moreTabs === "hidden" ? setMoreTabs("block") : setMoreTabs("hidden")
    }
    const [activeTab, setActiveTab] = useState(
        "All"
    )
    return (
        <>
            <div className="container mb-5">
                <div className='font-semibold text-2xl mb-10 tracking-wider'>
                    More {myCategory} Articles
                </div>
                <div onClick={() => {onFilter("All"); setActiveTab("All"); setMoreTabs("hidden")}} className={activeTab !== "All" ? `inline font-semibold text-xl tracking-wider px-5 py-1 cursor-pointer` : `inline font-semibold text-xl text-white bg-black tracking-wider px-5 py-1 cursor-pointer`}>
                    All
                </div>
                {myMenu.slice(0,tabsPaginate).map((tab) => (
                    tab.label !== myCategory &&
                    <div onClick={() => {onFilter(tab.label); setActiveTab(tab.label); setMoreTabs("hidden")}} key={tab.label} className={activeTab !== tab.label ? `inline-block font-semibold text-xl tracking-wider px-5 py-1 cursor-pointer` : `inline font-semibold text-xl text-white bg-black tracking-wider px-5 py-1 cursor-pointer`}>
                        {tab.label}
                    </div>
                ))}
                {myMenu.length > tabsPaginate && 
                    <div className='inline-block'>
                        <div onClick={() => toggleMoreTabs()} className='font-semibold text-xl tracking-wider px-5 py-1 cursor-pointer'>
                            More...
                        </div>
                        <div className={`absolute bg-white z-10 ${moreTabs}`}>
                            {myMenu.slice(tabsPaginate).map((tab) => (
                                tab.label !== myCategory &&
                                <option onClick={() => {toggleMoreTabs(); onFilter(tab.label); setActiveTab(tab.label)}} style={{display: moreTabs}} key={tab.label} className={activeTab !== tab.label ? `inline-block font-semibold text-xl tracking-wider px-5 py-1 cursor-pointer` : `inline-block font-semibold text-xl text-white bg-black tracking-wider px-5 py-1 cursor-pointer`}>
                                    {tab.label}
                                </option>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}