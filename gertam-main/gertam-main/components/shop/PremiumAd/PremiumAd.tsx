import  styles from './PremiumAd.module.css';

import {useAd} from "@/hooks/shop/useAd";
import Loading from "@/app/ui/loaders/Loading";

const PremiumAd = ()=>{
const {data , isLoading, error} = useAd();

if(isLoading) return <Loading />;
    return (
        <div className="container">
            <div className={styles.premiumAd}>
                <img src={data?.image_url || "/PremiumAd.png"} alt="" />
            </div>
        </div>
        
    )
}

export default PremiumAd;