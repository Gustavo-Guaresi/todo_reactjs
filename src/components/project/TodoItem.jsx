import styles from './TodoItem.module.css'
import { useEffect, useState } from 'react'

function TodoItem({ id_todo, todo, handleRemove, handleBoxChange }) {
    const [done, setDone] = useState(todo.done);

    function onCheckboxChange(e) {
        const newDoneStatus = e.target.checked;
        setDone(newDoneStatus);
        handleBoxChange(id_todo, newDoneStatus);
    }

    return (
        <div className={styles.Todo}>
            <div className={styles.Todo_Content}>
                <input type="checkbox" onChange={onCheckboxChange} checked={done} />
                <p>{todo.content}</p>
            </div>
            <button onClick={() => handleRemove(id_todo)}>Deletar</button>
        </div>
    )
}

export default TodoItem
