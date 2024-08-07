import TodoItem from './TodoItem'
import { useEffect, useState } from 'react'
import Input from '../form/Input'
import Options from '../form/Options'
import styles from './TodoList.module.css'

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch(`http://localhost:5000/Todos`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        }).then((resp) => resp.json())
            .then((data) => {
                setTodos(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleInputChange = (e) => {
        setNewTodo(e.target.value);
    }

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (!newTodo) return;

        const todo = {
            content: newTodo,
            done: false,
        }

        fetch(`http://localhost:5000/Todos`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(todo),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setTodos([...todos, data]);
                setNewTodo('');
            })
            .catch((err) => console.log(err));
    }

    function removeTodo(id) {
        fetch(`http://localhost:5000/Todos/${id}`, {
            method: "DELETE",
            headers: { 'Content-type': 'application/json' },
        }).then((resp) => resp.json())
            .then(() => {
                setTodos(todos.filter((todo) => todo.id !== id));
            })
            .catch((err) => console.log(err));
    }

    function handleBoxChange(id, newDoneStatus) {
        fetch(`http://localhost:5000/Todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ done: newDoneStatus }),
        })
        .then((resp) => resp.json())
        .then(() => {
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id ? { ...todo, done: newDoneStatus } : todo
                )
            );
        })
        .catch((err) => console.log(err));
    }

    const handleOptions = (e) => {
        setFilter(e.target.id.toLowerCase());
    }

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'all') return true;
        if (filter === 'done') return todo.done;
        if (filter === 'undone') return !todo.done;
    });

    return (
        <div className={styles.Todo}>
            <div className={styles.Todo_Container}>

                <h2>Comece seu To-Do List!</h2>
                
                <div className={styles.Input}>
                    <Input 
                        handleSubmit={handleAddTodo} 
                        value={newTodo} 
                        onChange={handleInputChange} 
                        placeholder="Adicione um Item" 
                    />
                </div>

                <div className={styles.Radio}>
                    <Options onChange={handleOptions} />
                </div>

                <div>
                    {filteredTodos.length > 0 && filteredTodos.map((todo) => (
                        <div key={todo.id}>
                            <TodoItem 
                                id_todo={todo.id} 
                                todo={todo} 
                                handleRemove={removeTodo} 
                                handleBoxChange={handleBoxChange} 
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default TodoList
