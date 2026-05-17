const express=require('express');
const app=express();
app.use(express.json());
app.use(express.static('public'));

let todos=[];
let nextId=1;

//Get all todos
app.get('/todos',(req,res)=>{
    res.json(todos);
});

//POST-Create a new todo
app.post('/todos',(req,res)=>{
    const {title}=req.body;

    if(!title)
    {
        return res.status(400).json({error:'Title is required'});
    }

    const todo={id:nextId++,title,done:false};
    todos.push(todo);
    res.status(201).json(todo);
});

//PUT-Mark a  todo as done/undone
app.put('/todos/:id', (req,res)=>{
     const todo=todos.find(t=>t.id===parseInt(req.params.id));
     if(!todo) return todo.status(404).json({error:'Todo not found'});

     todo.done=!todo.done;
     res.json(todo);
});

//DELETE-Delete a todo
app.delete('/todos/:id',(req,res)=>{
   const index=todos.findIndex(t=>t.id===parseInt(req.params.id));
   if(index===-1) return res.status(404).json({error:'Todo not found'});
   todos.splice(index,1);
   res.status(204).send();
});

app.listen(3000,()=>{
    console.log('Server is running on http://localhost:3000');
});