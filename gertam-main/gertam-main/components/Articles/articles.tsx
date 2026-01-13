"use client"
import styles from "./Articles.module.css"
import {articlesData, usegetThereArticles} from "@/hooks/articles/useArticles";
import {useInView} from "react-intersection-observer";
import ElmentLoadin from "@/components/elemetLoadin/elmentLoadin";

const Card = ({data} : {data: articlesData})=>{
    return(
        <a href={`article/${data.id}`}>
            <div className={styles.card} >
                <img src={data?.image_url} alt="" />
                <h3>{data.title}</h3>
                <p>{data.subTitle}</p>
                <span>Lorem ipsum dolor sit amet.</span>
            </div>
        </a>
    )
}


const Articles = ()=>{
    const {ref, inView} = useInView({threshold:0.1, triggerOnce:true});
    const {data} = usegetThereArticles()
    return (
        <div className="container" ref={ref}>
            {inView ?(
                <div className={styles.Articles}>
                    {data.map((item)=>(
                        <Card data={item} key={item.id}/>
                    ))}

                </div>
            ): <ElmentLoadin />}
        </div>
    )
}

export default Articles