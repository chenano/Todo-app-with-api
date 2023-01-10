import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';


const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(cors());

/* Disabling the strict mode for queries. */
mongoose.set('strictQuery', false);
/* Connecting to the database. */
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase',
{useNewUrlParser: true});


// Création d'un schéma et d'un modèle
const Schema = mongoose.Schema;
/* Creating a new ObjectId. */
const ObjectId = Schema.ObjectId;

/* Creating a new model called Task. */
const Task = mongoose.model("Task", new Schema({
    ObjectId: ObjectId,
    name: String,
    status: Boolean
}));

// Récupère la liste complète des tâches
/* Getting the list of tasks. */
app.get('/tasks', (req, res) => {
    Task.find((error, tasks) => {
      if (error) {
        res.send(error);
      } else {
        res.json(tasks);
      }
    });
  });
  
// Crée une nouvelle tâche
app.post('/tasks',  (req, res) => {
    console.log(req.body);
    const task =  new Task({
        name:  req.body.name,
        status:  req.body.status
    });
    task.save((error) => {
        if (error) {
            res.send(error);
        } else {
            res.json({ message: 'Task created successfully' });
        }
    });
});
  
// Récupère une tâche spécifique en fonction de son identifiant
app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id, (error, task) => {
      if (error) {
        res.send(error);
      } else {
        res.json(task);
      }
    });
  });


// Met à jour une tâche spécifique en fonction de son identifiant
app.put('/tasks/:id', (req, res) => {
  Task.findById(req.params.id, (error, task) => {
    if (error) {
      res.send(error);
    } else {
      task.name = req.body.name;
      task.status = req.body.status;
      task.save((error) => {
        if (error) {
          res.send(error);
        } else {
          res.json({ message: 'Task updated successfully' });
        }
      });
    }
  });
});

// Supprime une tâche spécifique en fonction de son identifiant
app.delete('/tasks/:id', (req, res) => {
  Task.remove({ _id: req.params.id }, (error) => {
    if (error) {
      res.send(error);
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

const port = 3000;
/* Listening to the port 3000. */
app.listen(port, () => {
  console.log(`API running on port ${port}`)
});