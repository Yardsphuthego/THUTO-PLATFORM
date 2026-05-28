// Document Controller
const documents = [];

exports.createDocument = (req, res) => {
  const { title, content, ownerId } = req.body;
  
  if (!title || !ownerId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const document = {
    id: Date.now(),
    title,
    content: content || '',
    ownerId,
    collaborators: [ownerId],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  documents.push(document);
  res.status(201).json({ message: 'Document created', document });
};

exports.getDocuments = (req, res) => {
  res.json(documents);
};

exports.getDocumentById = (req, res) => {
  const document = documents.find(d => d.id == req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(document);
};

exports.updateDocument = (req, res) => {
  const document = documents.find(d => d.id == req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  document.content = req.body.content || document.content;
  document.title = req.body.title || document.title;
  document.updatedAt = new Date();
  
  res.json({ message: 'Document updated', document });
};

exports.deleteDocument = (req, res) => {
  const index = documents.findIndex(d => d.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  const deletedDoc = documents.splice(index, 1);
  res.json({ message: 'Document deleted', document: deletedDoc[0] });
};

exports.addCollaborator = (req, res) => {
  const document = documents.find(d => d.id == req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  const { userId } = req.body;
  if (!document.collaborators.includes(userId)) {
    document.collaborators.push(userId);
  }
  
  res.json({ message: 'Collaborator added', document });
};
