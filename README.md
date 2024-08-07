# To-do List Básico em React
Esse projeto é feito em React.js com o auxílio da biblioteca json-server para o armazenamento permanente dos itens. Essa documentação servirá para fazer o projeto funcionar e explicar a lógica, para mais informações (incluindo os arquivos css) acesse:

![Tecnologias Usadas](https://skillicons.dev/icons?i=react,nodejs&paperline=3)

## Pré-Requisitos
- Conhecimento Básico de HTML, CSS, JS;
- Node.js e npm instalados; 
- VisualStudio Code ou semelhantes;

## ⚡Começando

Comece criando o projeto
``` shell
npx create-react-app todo_list
```

Instale a dependência
``` shell
npm install json-server
```

Modifique o arquivo package.json para ser mais fácil de iniciar o "backend", em "scripts" adicione "backend":
``` json
  "scripts": {
    "start": "react-scripts start",
    "backend": "json-server --watch db.json --port 5000",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

Navegue até o diretório criado
``` shell
cd todo_list
```

Comece seu projeto!

``` shell
npm start
```

Depois de criar o arquivo **db.json** mencionado posteriormente, também deixe rodando:
``` shell
npm run backend
```

## Estruturando o Projeto
A estruturação do projeto segue:

``` pasta
src
|  form
|  |   Input.jsx
|  |   Input.module.css
|  |   Options.jsx
|  |   Options.module.css
|  project
|  |   TodoItem.jsx
|  |   TodoItem.module.css
|  |   TodoList.jsx
|  |   TodoList.module.css
|  App.css
|  App.jsx
db.json

```


Crie os arquivos e pastas necessários, incluindo **db.json**. Você poderá copiar essas informações para testes e noção de estrutura:
``` json
{
  "Todos": [
    {
      "id": "9ca9",
      "content": "Teste 7",
      "done": false
    },
    {
      "id": "feee",
      "content": "Tete 3",
      "done": false
    },
    {
      "id": "4a71",
      "content": "Consulta",
      "done": false
    }
  ]
}
```

O armazenamento do projeto tem como base justamente esse arquivo, e junto com o comando acionado anteriormente, ele irá ser mantido (e podendo ser verificado) em "localhost:5000", no caso, em "localhot:5000/Todos". 
### App

Eu recomendo ir colocando o componente que está trabalhando atualmente em App.jsx a fim de testá-lo, no final, ele irá ficar:
``` jsx
import './App.css';
import TodoList from './components/project/TodoList'
  
function App() {
  return (
    <div className="App">
      <TodoList/>
    </div>
  );
}

export default App;
```
### Componentes form:
Achei interessante separar os arquivos de input para ser mais fácil de organizar e expandir, caso necessário.
``` jsx
import styles from './Input.module.css'

function Input({handleSubmit, value, onChange, placeholder}){
    return(
        <form onSubmit={handleSubmit} className={styles.forms}>
            <button type="submt">Adicionar</button>
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
        </form>
    )
}

export default Input
```

``` jsx
function Options({onChange, onclick}){
    return(
        <form action="" onClick={onclick} onChange={onChange}>
            <input type="radio" name="display" id="All" defaultChecked />
            <label htmlFor="All">All</label>
            <input type="radio" name="display" id="Undone" />
            <label htmlFor="Undone">Undone</label>
            <input type="radio" name="display" id="Done" />
            <label htmlFor="Done">Done</label>
        </form>
    )
}

export default Options
```

### Componentes project:

Nesses componentes que reside toda a lógica da aplicação. No início, o componente **TodoItem** também tinha uma parte para pegar as informações dentro do "banco de dados" **db.json**, mas para torná-lo mais dinâmico e foi necessário modificá-lo. 

Ele atua principalmente no registro do estado "done", monitorando o checkbox com "**onCheckBoxChange**" e posteriormente passando as informações necessárias para a modificação desse estado para o componente "pai". 

``` jsx
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
```

O arquivo **TodoList** é o mais extenso, e nele reside toda a lógica da operação:

``` jsx
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
```

Segue as partes mais pertinentes para explicação da lógica:
#### Pegando as Informações

Essa é (quase) a parte que coloquei originalmente em TodoItem para testar:
``` jsx
...
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
    ...
```
Ela pega os dados e armazena em "todos" com o "setTodos" usando os Hooks do React.

#### Guardando Informações 
Para guardar as informações, é necessário pensar em 2 partes para ser dinâmico, com "handleInputChange" e "handleAddTodo".
``` jsx 
...
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
    ...
```
O "handleInputChange" vai armazenando a string que está digitando no componente Input (lá em baixo em return no código completo), para quando apertar o botão (mais ou menos na mesma região), ele irá acionar o "handleAddTodo".

Primeiro ele verifica se o newTodo está vazio, caso não esteja, ele armazena a string dentro da lista "todo" contendo "content" e "done", assim, basta passá-lo com a função "fetch" em "body:JSON.sringify(todo)"

Outra etapa importante é a de atualizar a variável local: depois de fazer toda a operação, ela é atualizada em `setTodos([...todos, data]);` e depois a variável "newTodo" é limpada com `setNewTodo('');`.

#### Removendo Informações
Aproveitando o botão dentro do componente "todoItem", e relembrando, ele e está repassando o que acontece ao clicar para o componente pai com "handleRemove" passando seu id, ele irá acionar a seguinte função:

``` jsx
...
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
    ...
```

Usando a função "fetch", ele estabelece a conexão, descreve seu método, e remove especificamente com base no "id" passado. Depois, ele tira o respectivo "todo" da variável local da aplicação com `setTodos(todos.filter((todo) => todo.id !== id));`.

#### Sincronizando Done

O principal motivo de fazer com que a atualização dos itens seja inteiramente pelo componente todoList, e não dividindo a função com TodoItem, é justamente pela sincronização dos "checkbox". Foi usando esse método que fui capaz de sincronizar a aplicação rodando juntamente com o "banco de dados" em **db.jason**, e acontece em "handleBoxChange". 

``` jsx
...
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
...
```

Relembrando, em **"todoItem"** sempre que a "checkbox" é alterada, ele aciona "OnChange" armazenando o estado usando o react hook "done" com `setDone(newDoneStatus);`, e após, ele da a disponibilidade para ser puxado essas informações pelo componente "pai" passando ambos seu "id" e esse estado mencionado `handleBoxChange(id_todo, newDoneStatus);`

No componente todoList, ele irá atualizar o "backend" em **"db.json"** com a função "handleBoxChange" pegando o "id" e o estado mencionado anteriormente. Ele irá tentar realizar a conexão com a função "fetch" usando o método "PATCH" para atualiza o valor com `body: JSON.stringify({ done: newDoneStatus }),`. Depois, basta atualizar o estado local com a função:

``` jsx
...
() => {
            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo.id === id ? { ...todo, done: newDoneStatus } : todo
                )
            );
        }
...

```

#### Renderização Condicional por Filtragem
E finalmente, a renderização baseado na opção desejada. Sua lógica é feita em duas partes:
``` jsx
...
    const handleOptions = (e) => {
        setFilter(e.target.id.toLowerCase());
    }

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'all') return true;
        if (filter === 'done') return todo.done;
        if (filter === 'undone') return !todo.done;
    });
...
```

Relembrando, no componente dentro de forms "Options", ele repassa o que acontece ao mudar seu estado com "OnChange", e nele guardamos o "id/nome" da opção desejada usando o hook `setFilter(e.target.id.toLowerCase());`. 

Assim, criamos rapidamente um "todo" filtrado com a opção desejada, e após isso, mostramos justamente esse "todo filtrado" na div:
``` jsx
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
```
