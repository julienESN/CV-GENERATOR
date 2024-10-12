const express = require('express');
const Cv = require('../models/Cv');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/cv/create', authenticateToken, async (req, res) => {
  const {
    name,
    firstname,
    description,
    educationalExperiences,
    professionalExperiences,
    visibility,
  } = req.body;

  try {
    const cv = new Cv({
      name,
      firstname,
      description,
      educationalExperiences,
      professionalExperiences,
      visibility,
      userId: req.user.id,
    });
    await cv.save();
    res.status(201).json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating cv' });
  }
});

router.get('/cv/user', authenticateToken, async (req, res) => {
  try {
    const userCvs = await Cv.find({ userId: req.user.id });

    if (userCvs.length === 0) {
      return res
        .status(200)
        .json({ message: 'No CVs found for this user', data: [] });
    }

    res.status(200).json(userCvs);
  } catch (error) {
    console.error('Error fetching user CVs:', error);
    res.status(500).json({ message: 'Error fetching user CVs' });
  }
});

router.put('/cv/update/:id', authenticateToken, async (req, res) => {
  const cvId = req.params.id;
  const {
    name,
    firstname,
    description,
    educationalExperiences,
    professionalExperiences,
    visibility,
  } = req.body;

  try {
    const cv = await Cv.findById(cvId);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // S'assurer que l'utilisateur ne peut mettre à jour que son propre CV
    if (cv.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Mise à jour du CV
    cv.name = name;
    cv.firstname = firstname;
    cv.description = description;
    cv.educationalExperiences = educationalExperiences;
    cv.professionalExperiences = professionalExperiences;
    cv.visibility = visibility;

    await cv.save();
    res.status(200).json(cv);
  } catch (error) {
    console.error('Error updating CV:', error);
    res.status(500).json({ message: 'Error updating CV' });
  }
});

module.exports = router;
