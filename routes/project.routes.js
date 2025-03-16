const express = require('express');
const router = express.Router();
const projectModel = require('../model/project.model');
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

router.post('/addProject', verifyToken,async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    const { ProjectName, ProjectDescription, ProjectImage, ProjectLink, ProjectDuration, ProjectTechnologies } = req.body;
    try {
        let project
        project = new projectModel({
            ProjectName,
            ProjectDescription,
            ProjectImage,
            ProjectLink,
            ProjectDuration,
            ProjectTechnologies
        });
        await project.save();
        res.status(200).json({ project });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

router.get('/getProjects', async (req, res) => {
    try {
        let projects = await projectModel.find();
        res.status(200).json({ projects });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/getProject/:id',verifyToken, async (req, res) => {
    try {
        let project = await projectModel.findById(req.params.id);
        res.status(200).json({ project });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);

router.put('/updateProject/:id',verifyToken, async (req, res) => {
    const { ProjectName, ProjectDescription, ProjectImage, ProjectLink, ProjectDuration, ProjectTechnologies } = req.body;
    try {
        let project = await projectModel.findById(req.params.id);
        project.ProjectName = ProjectName;
        project.ProjectDescription = ProjectDescription;
        project.ProjectImage = ProjectImage;
        project.ProjectLink = ProjectLink;
        project.ProjectDuration = ProjectDuration;
        project.ProjectTechnologies = ProjectTechnologies;
        await project.save();
        res.status(200).json({ project });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);

router.delete('/deleteProject/:id',verifyToken, async (req, res) => {
    try {
        await projectModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: 'Project deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);

module.exports = router; 