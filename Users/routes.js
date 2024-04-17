import * as dao from './dao.js';
let globalCurrentUser;
export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    try {
      const user = await dao.createUser(req.body);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  app.post('/api/users', createUser);
  const deleteUser = async (req, res) => {
    try {
      const status = await dao.deleteUser(req.params.userId);
      res.json(status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  const findAllUsers = async (req, res) => {
    try {
      const users = await dao.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  app.get('/api/users', findAllUsers);
  const findUserById = async (req, res) => {};
  const updateUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const status = await dao.updateUser(userId, req.body);
      currentUser = await dao.findUserById(userId);
      res.json(status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  const signup = async (req, res) => {
    try {
      const user = await dao.findUserByUsername(req.body.username);
      if (user) {
        res.status(400).json({ message: 'Username already taken' });
      }
      const currentUser = await dao.createUser(req.body);
      req.session['currentUser'] = currentUser;
      globalCurrentUser = currentUser;
      res.json(currentUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const currentUser = await dao.findUserByCredentials(username, password);
      if (currentUser) {
        req.session['currentUser'] = currentUser;
        globalCurrentUser = currentUser;
        res.json(currentUser);
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
  const profile = (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  app.post('/api/users', createUser);
  app.get('/api/users', findAllUsers);
  app.get('/api/users/:userId', findUserById);
  app.put('/api/users/:userId', updateUser);
  app.delete('/api/users/:userId', deleteUser);
  app.post('/api/users/signup', signup);
  app.post('/api/users/signin', signin);
  app.post('/api/users/signout', signout);
  app.post('/api/users/profile', profile);
}
