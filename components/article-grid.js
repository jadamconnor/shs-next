import Image from 'next/image'
import styles from './article-grid.module.css'

export default function ArticleGrid ({ myArticles, myCategory }) {

    return (
        <>
            <div className="container">
                <div className="row">
                    {myArticles.map((el, index) => (
                        <div key={el.node.id} className="col-1">
                            <div className={styles.article}>
                                {el.node.featuredImage &&
                                    <div className={styles.articleImageWrapper}>
                                        <Image 
                                            src={el.node.featuredImage.node.sourceUrl}
                                            alt={el.node.featuredImage.node.altText}
                                            objectFit='cover'
                                            width={300}
                                            height={160}
                                            placeholder="blur"
                                            // Work-around for no out-of-box dataUrl
                                            blurDataURL={`/_next/image?url=${el.node.featuredImage.node.sourceUrl}&w=16&q=1`}
                                        />
                                    </div>
                                }
                                <div className={styles.articleCopy}>
                                    <div className={styles.articleTitle}>
                                        <a href={`../${el.node.slug}`}>
                                            {el.node.title}
                                        </a>
                                    </div>
                                    <div className={styles.articleCoCategories}>
                                        {el.node.categories.edges.filter((e) => e.node.name !== myCategory).map((cat, index) => (
                                            <span key={cat.node.id}>
                                                <a href={`../categories/${cat.node.slug}`}>{cat.node.name}</a> {index < (el.node.categories.edges.filter((e) => e.node.name !== myCategory).length - 1) ? <span>| </span> : <span></span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>     
        </>
    )
}
