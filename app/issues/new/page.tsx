import styles from "./newissue.module.css";

const New = () => {
    return (
        <div>
            <h1>New</h1>
            <button className={styles.button}>Create Issue</button>
        </div>
    );
}

export default New;