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