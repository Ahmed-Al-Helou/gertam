import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./reviews.module.css"

interface reviews {
    id: number;
    user_id: number;
    stars: number;
    comment: string;
    created_at: string ;
}
function Reviews({ reviews }: {reviews: reviews[]}) {
    return (
        <div className={styles.reviews_container}>
            {reviews.length > 0 ? reviews.map((review) => (
                <div key={review.id} className={styles.review_card}>

                    <div className={styles.user}>
                        {/* المستخدم */}
                        <div className={styles.review_user}>
                            بواسطة المستخدم #{review.user_id} - {new Date(review.created_at).toLocaleDateString()}
                        </div>

                        {/* التعليق */}
                        <p className={styles.review_comment}>{review.comment}</p>
                    </div>

                    {/* النجوم */}
                    <div className={styles.stars}>
                        <div className={styles.Stars}>
                            {Array.from({ length: 5 }, (_, i) =>
                                i < review.stars ? (
                                    <FaStar key={i} className={`${styles.star} ${styles.filled}`} size={22}/>
                                ) : (
                                    <FaRegStar key={i} className={`${styles.star} ${styles.empty}`} size={22}/>
                                )
                            )}
                        </div>
                        <span>2025-6-13</span>
                    </div>


                </div>
            )):(
                <span className={styles.emty}>لا توجد مراجعات حتى الان </span>
            )}
        </div>
    );
}

export default Reviews;
