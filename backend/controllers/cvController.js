/* eslint-disable no-undef */
const Cv = require('../models/Cv');
const findBadWords = require('../utils/findBadWords');

exports.createCv = async (req, res) => {
  const {
    name,
    firstname,
    email,
    phone,
    address,
    website,
    summary,
    description,
    skills,
    languages,
    certifications,
    interests,
    educationalExperiences,
    professionalExperiences,
    visibility,
  } = req.body;

  try {
    const cv = new Cv({
      name,
      firstname,
      email,
      phone,
      address,
      website,
      summary,
      description,
      skills,
      languages,
      certifications,
      interests,
      educationalExperiences,
      professionalExperiences,
      visibility,
      userId: req.user.id,
    });
    await cv.save();
    res.status(201).json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating CV' });
  }
};

exports.getUserCvs = async (req, res) => {
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
};

exports.updateCv = async (req, res) => {
  const cvId = req.params.id;
  const {
    name,
    firstname,
    email,
    phone,
    address,
    website,
    summary,
    description,
    skills,
    languages,
    certifications,
    interests,
    educationalExperiences,
    professionalExperiences,
    visibility,
  } = req.body;

  try {
    const cv = await Cv.findById(cvId);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    if (cv.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    cv.name = name;
    cv.firstname = firstname;
    cv.email = email;
    cv.phone = phone;
    cv.address = address;
    cv.website = website;
    cv.summary = summary;
    cv.description = description;
    cv.skills = skills;
    cv.languages = languages;
    cv.certifications = certifications;
    cv.interests = interests;
    cv.educationalExperiences = educationalExperiences;
    cv.professionalExperiences = professionalExperiences;
    cv.visibility = visibility;

    await cv.save();
    res.status(200).json(cv);
  } catch (error) {
    console.error('Error updating CV:', error);
    res.status(500).json({ message: 'Error updating CV' });
  }
};

exports.deleteCv = async (req, res) => {
  const cvId = req.params.id;

  try {
    const cv = await Cv.findById(cvId);
    if (!cv) {
      return res.status(404).json({message: 'CV not found'});
    }

    // Check if the user is authorized to delete the CV
    if (cv.userId !== req.user.id) {
      return res.status(403).json({message: 'Unauthorized'});
    }

    // Call findByIdAndDelete on the Cv model itself, not on the instance
    await Cv.findByIdAndDelete(cvId);
    res.status(200).json({message: 'CV deleted successfully'});
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({message: 'Error deleting CV'});
  }
};


exports.getPublicCvs = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';

    let query = { visibility: true };

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query = {
        ...query,
        $or: [{ name: searchRegex }, { firstname: searchRegex }],
      };
    }

    const publicCvs = await Cv.find(query).select(
      '_id name firstname description educationalExperiences professionalExperiences visibility userId'
    );

    res.status(200).json(publicCvs);
  } catch (error) {
    console.error('Error fetching public CVs:', error);
    res.status(500).json({ message: 'Error fetching public CVs' });
  }
};

exports.getCvById = async (req, res) => {
  const { id } = req.params;

  try {
    const cv = await Cv.findById(id);

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    if (!cv.visibility && cv.userId !== req.user.id) {
      return res.status(403).json({ message: 'This CV is private.' });
    }

    res.status(200).json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ message: 'Error fetching CV' });
  }
};

exports.addRecommendation = async (req, res) => {
  const cvId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;

  const badWords = findBadWords(content);
  if (badWords.length > 0) {
    return res.status(400).json({
      message: `Votre recommandation contient des mots interdits : ${badWords.join(
        ', '
      )}`,
    });
  }

  try {
    const cv = await Cv.findById(cvId);

    if (!cv) {
      return res.status(404).json({ message: 'CV non trouvé.' });
    }

    const newRecommendation = {
      userId,
      content,
    };

    cv.recommendations.push(newRecommendation);
    await cv.save();

    res.status(201).json({ message: 'Recommandation ajoutée avec succès.' });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la recommandation :", error);
    res.status(500).json({
      message: "Erreur lors de l'ajout de la recommandation.",
    });
  }
};

exports.getRecommendations = async (req, res) => {
  const cvId = req.params.id;

  try {
    const cv = await Cv.findById(cvId)
      .populate('recommendations.userId', 'name')
      .select('recommendations');

    if (!cv) {
      return res.status(404).json({ message: 'CV non trouvé.' });
    }

    res.status(200).json(cv.recommendations);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des recommandations :',
      error
    );
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des recommandations.' });
  }
};
