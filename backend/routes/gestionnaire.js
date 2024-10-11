const express = require('express');
const Cv = require('../models/Cv');
const router = express.Router();


router.post('/create', async (req, res) => {
    const {name, firstName, description, educationalExperiences, professionalExperiences, visibility} = req.body;
    console.log(req.user);
    try {
        const cv = new Cv({
            name,
            firstName,
            description,
            educationalExperiences,
            professionalExperiences,
            visibility,
            userId: req.user.id
        });
        await cv.save();
        res.status(201).json(cv);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error creating cv'});
    }
});

router.put('/update/:id', async (req, res) => {
    const cvId = req.params.id;

    try {
        const cv = await Cv.findById(cvId);
        if (!cv) {
            return res.status(404).json({message: 'CV not found'});
        }
        const {name, firstName, description, educationalExperiences, professionalExperiences, visibility} = req.body;

        const updatedCv = await Cv.findByIdAndUpdate(cvId, {
            name,
            firstName,
            description,
            educationalExperiences,
            professionalExperiences,
            visibility
        }, {new: true});
        res.status(200).json(updatedCv);
    } catch (error) {
        res.status(500).json({message: 'Error updating cv'});
    }
});

router.get('/cv/public', async (req, res) => {
    try {
        const publicCvs = await Cv.find({visibility: true});

        if (publicCvs.length === 0) {
            return res.status(404).json({message: 'No visible CVs found'});
        }

        res.status(200).json(publicCvs);
    } catch (error) {
        res.status(500).json({message: 'Error fetching visible CVs'});
    }
});

router.get('/cv/user', async (req, res) => {
    try {
        const userCvs = await Cv.find({userId: req.user.id});

        if (userCvs.length === 0) {
            return res.status(404).json({message: 'No CVs found for this user'});
        }

        res.status(200).json(userCvs);
    } catch (error) {
        res.status(500).json({message: 'Error fetching user CVs'});
    }
});

module.exports = router;
