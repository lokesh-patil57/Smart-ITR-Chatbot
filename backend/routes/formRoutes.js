const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/download/:formId', (req, res) => {
  const { formId } = req.params;
  const formPath = path.join(__dirname, `../../frontend/public/assets/forms/itr${formId}.pdf`);
  
  res.download(formPath, `ITR-${formId}.pdf`, (err) => {
    if (err) {
      res.status(404).json({ error: 'Form not found' });
    }
  });
});

module.exports = router; 