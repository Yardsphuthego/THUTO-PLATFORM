// User Controller
const users = [];

exports.createUser = (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const user = {
    id: Date.now(),
    name,
    email,
    password,
    createdAt: new Date()
  };
  
  users.push(user);
  res.status(201).json({ message: 'User created', user: { id: user.id, name: user.name, email: user.email } });
};

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

exports.updateUser = (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  Object.assign(user, req.body);
  res.json({ message: 'User updated', user });
};

exports.deleteUser = (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(index, 1);
  res.json({ message: 'User deleted', user: deletedUser[0] });
};
