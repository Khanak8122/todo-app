const express=require('express');
const {Pool}=require('pg'); //used to connect Node.js to PostgreSQL as Node.js cannot talk to Postgres directly

const app=express(); //creates backend server using Express framework
app.use(express.json());//Middleware that allows express to understand JSON body in incoming requests
app.use(express.static('public'));

//Connect to PostgreSQL using environment variables
const pool=new Pool({   //Pool is a collection of reusable database connections
    host:process.env.DB_HOST || 'locahhost',
    user:process.loadEnvFile.DB_USER || 'postgress',
    password: process.env.DB_PASSWORD || 'postgres',
    database:process.env.DB_NAME || 'todos',
    port: 5432,
});

// let todos=[];
// let nextId=1;

//Create the todos table if it doesn't exist
async function initDB(){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN DEFAULT false
        )
    `);
    console.log('Database Ready');
}

//Get all todos
app.get('/todos',(req,res)=>{
    const result=await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(result.rows);
});

//POST-Create a new todo
app.post('/todos',(req,res)=>{
    const {title}=req.body;

    if(!title)
    {
        return res.status(400).json({error:'Title is required'});
    }

    // const todo={id:nextId++,title,done:false};
    // todos.push(todo);
    // res.status(201).json(todo);
    const result=await pool.query('INSERT INTO todos (title) VALUES (&1) RETURNING *',
        [title]
    );
    res.status(201).json(result.rows[0]);
});

//PUT-Mark a  todo as done/undone
app.put('/todos/:id', (req,res)=>{
    //  const todo=todos.find(t=>t.id===parseInt(req.params.id));
    //  if(!todo) return todo.status(404).json({error:'Todo not found'});

    //  todo.done=!todo.done;
    //  res.json(todo);
    const result=await pool.query(
        'UPDATE todos SET done= NOT done WHERE id = $1 RETURNING*',
        [req.params.id]
    );
    if( result.rows.length===0) return res.status(404).json({error: 'not found'});
    res.json(result.rows[0]);
});

//DELETE-Delete a todo
app.delete('/todos/:id',(req,res)=>{
//    const index=todos.findIndex(t=>t.id===parseInt(req.params.id));
//    if(index===-1) return res.status(404).json({error:'Todo not found'});
//    todos.splice(index,1);
//    res.status(204).send();
    const result= await pool.query(
        'DELETE FROM todos WHERE id= $1 RETURNING *',
        [req.params.id]
    );
    if(result.rows.length===0) return res.status(404).json({error: 'not found'});
    res.status(204).send();
});

initDB().then(()=>{
app.listen(3000,()=> console.log('Server is running on http://localhost:3000'));
});
