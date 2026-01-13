import styles from "./contactus.module.css";

const PhotoSection = () =>{
    return(
        <div className={styles.photosection}>
            <img src="/banner-13.jpg.png" alt="" />
            <div className={styles.text}>
                <span>Lorem, ipsum.   </span>
                <h3>Lorem ipsum dolor sit amet.</h3>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias exercitationem </p>
                <button>Shop Now</button>
            </div>
        </div>
    )
}
const Form = () =>{
    return (
        <div className={styles.form}>
  <h3>Get In Touch</h3>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
  <form>
    <div className={styles.row}>
      <div className={styles.field}>
        <label htmlFor="firstName">الاسم الاول</label>
        <input id="firstName" type="text" placeholder="Your First Name" />
      </div>
      <div className={styles.field}>
        <label htmlFor="lastName">الاسم الاخير</label>
        <input id="lastName" type="text" placeholder="Your Last Name" />
      </div>
    </div>

    <div className={styles.field}>
      <label htmlFor="email">البريد الالكتروني</label>
      <input id="email" type="email" placeholder="Your Email" />
    </div>

    <div className={styles.field}>
      <label htmlFor="message">رسالتك</label>
      <textarea
        id="message"
        className={styles.textarea}
        placeholder="Message"
      ></textarea>
    </div>

    <button type="submit">Send Message</button>
  </form>
</div>

    )
}

const  ContactUs = ()=>{
    return(
        <div className="container">
            <div className={styles.contactus}>
                <PhotoSection/>
                <Form/>
            </div>
        </div>
    )
}

export default ContactUs