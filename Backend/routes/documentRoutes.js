const express = require('express');
const documentController = require('../controllers/documentController');
const router = express.Router();

router.post('/', documentController.createDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);
router.post('/:id/collaborators', documentController.addCollaborator);

module.exports = router;
