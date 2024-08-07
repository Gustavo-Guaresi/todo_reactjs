import styles from './Input.module.css'

function Input({handleSubmit, value, onChange, placeholder}){
    return(
        <form onSubmit={handleSubmit} className={styles.forms}>
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
            <button type="submt">Adicionar</button>
        </form>
    )
}

export default Input