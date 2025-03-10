const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    ProjectName: {
        type: String,
        required: true,
        unique: true
    },
    ProjectDescription: {
        type: String,
        required: true
    },
    ProjectImage: {
        type: String,
        required: true
    },
    ProjectLink: {
        type: String,
        required: true
    },
    ProjectDuration: {
        type: String,
        required: true
    },
    ProjectTechnologies: {
        type: Array,
    }
});

const projectModel = mongoose.model('Project', projectSchema);

module.exports = projectModel;