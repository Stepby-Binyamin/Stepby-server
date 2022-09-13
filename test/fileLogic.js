const fs = require("fs");


function createFile(fileName = "", dataContent = "", step, description, project, enconding = "utf-8") {
    console.log("fileLogic", fileName, dataContent, step, description, project);

    if (!fs.existsSync(`${project}/${step}`)) {
        fs.mkdirSync(`${project}`)
        fs.mkdirSync(`${project}/${step}`)
    }

    if (fs.existsSync(`${project}/${step}/description.txt`)) {
        console.log( "The File exists");
    }
    try {
        // Create
        let logs = []
        if (fs.existsSync(`${project}/${step}/description.txt`)) {
            logs = fs.readFileSync(`${project}/${step}/description.txt`).toString().split("\n");
            logs.push(description)
            fs.writeFileSync(`${project}/${step}/description.txt`, `${logs}`)
        } else {
            fs.writeFileSync(`${project}/${step}/description.txt`, description)
        }
        if(fileName){
            fs.writeFileSync(`${project}/${step}/${fileName}`, dataContent, { enconding });
        }

        return `file created at ${project}/${step}/${fileName}`;
    } catch (error) {
        return "Error from existFileCreate";
    }
}

module.exports = { createFile }