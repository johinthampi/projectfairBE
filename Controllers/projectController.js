
const project= require('../Models/projectSchema')
exports.addproject = async (req, res) => {
    console.log("inside add project controller");
    const userId = req.payload;
    console.log("userId:", userId);
    
    
    //request we are getting is form data
    //so it is not possible to directly access the data
    //we need to use multer module to deal with multpart/form part
    const projectImage = req.file.filename
    console.log("image file name",projectImage);
    const { title, language, github, website, overview } = req.body;
    try {
        const existingProject = await project.findOne({ github: github });
        if (existingProject) {
            res.status(409).json("project already exist")
        }
        else {
            const newProject = new project({
                title,
                language,
                github,
                website,
                overview,
                projectImage,
                userId
            })
            await newProject.save();
            res.status(200).json("project upload successfully")
        }
    }
    catch(err) {
        res.status(401).json("project upload failed")
    }
}
    //1)get any 3 project details for home page
exports.getHomeProject = async (req, res) => {
        try {
            const homeProject = await project.find().limit(3);
            res.status(200).json(homeProject)
        }
        catch (err) {
            res.send(401).json("request failed due to:",err)
        }
    }
    //2)gell all projects
exports.getAllProject = async (req, res) => {
    const searchKey = req.query.search;
    console.log(searchKey);
    const searchQuery = {
        // language: {
        //     //i used to remove case sensitivity
        //     $regex:searchKey,$options:'i'
        //}
        $or: [
            {
                language: {
                    //i used to remove case sensitivity
                    $regex: searchKey,
                    $options: 'i'
                }
            },
            {
                title: {
                    $regex: searchKey,
                    $options: 'i'
                    
                }
            }
        ]
    };
    
        try {
            const allProject = await project.find(searchQuery);
            res.status(200).json(allProject)
        }
        catch (err) {
            res.send(401).json("request failed due to:",err)
        }
    }
    //3)get all  projects uploaded by the specific user
    exports.getUserProject = async (req, res) => {
        userId = req.payload;
        try {
            const allUserProject = await project.find({ userId: userId });
            res.status(200).json(allUserProject)
        }
        catch (err) {
            res.send(401).json("request failed due to:",err)
        }
    }
   //4)edit user project 
exports.editUserProject = async(req, res) => {
    const { id } = req.params;
    const userId = req.payload;
    const { title, language, github, website, overview, projectImage } = req.body;
    const uploadedProjectImage = req.file ? req.file.filename : projectImage
    try {
        const updateProject = await project.findByIdAndUpdate(
            { _id: id }, {
            title: title,
            language: language,
            github: github,
            website: website,
            overview: overview,
            projectImage: uploadedProjectImage,
            userId: userId
        }, {
            //for know it is true 
            new: true
        }
        );
        await updateProject.save();
        res.status(200).json("update the project successfull")
    }
    catch (err){
        res.status(401).json(err)
    }
    }
//5)delete a project
exports.deleteUserProject = async (req, res) => {
    const { id } = req.params;
    try {
        const removeProject = await project.findByIdAndDelete({ _id: id })
        res.status(200).json(removeProject)
        console.log("project remove:",removeProject);
        
    }
    catch (err){
        res.status(401).json(err)
    }
}
