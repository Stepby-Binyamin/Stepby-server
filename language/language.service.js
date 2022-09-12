const languageControl = require('./language.model')

async function create(data){
    
    if (data.code !== 0 && !data.code )
    throw {code: 400, message: "code missing" };
    if (!data.language)
    throw {code: 400, message: "language missing" };
    const lanExsist = await languageControl.readOne({language: data.language})
    if(lanExsist) 
    throw({code: 405, message: "language already exists"});
    const codeExsist = await languageControl.readOne({code: data.code})
    if(codeExsist) 
    throw({code: 405, message: "code already exists"});

    const language = await languageControl.create(data)
    return language;

}

async function read(){

    const language = await languageControl.read({});

    if (!language) 
    throw({ code: 404, message: "languages not found" });

    return language;

}

async function readOne(code, proj){

    if (!code)
    throw {code: 400, message: "code not provided" };

    const language = await languageControl.readOne({code}, proj)
    
    if (!language) 
    throw({ code: 404, message: "language not found" });

    return language;

}

async function update(code, newData){

    if (code !== 0 && !code)
    throw {code: 400, message: "code not provided" };
    if (!newData)
    throw {code: 400, message: "no new data provided" };
    
    const findLanguage = await languageControl.readOne({code}, proj)
    if (!findLanguage) 
    throw({ code: 404, message: "language not found" });
    
    const language = await languageControl.update({code}, newData)
    return language;

}

async function updateWordInOne(code, newData){

    if (code !== 0 && !code)
    throw {code: 400, message: "code not provided" };
    if (!newData)
    throw {code: 400, message: "no new data provided" };
    
    const findLanguage = await languageControl.readOne({code}, proj)
    if (!findLanguage) 
    throw({ code: 404, message: "language not found" });
    
    const language = await languageControl.update({code}, {dict: newData})
    return language;

}

async function updateWordInAll(newData){

    if (!newData)
    throw {code: 400, message: "no new data provided" };
    
    const language = await languageControl.updateAll({}, newData)
    return language;

}

async function del(_id){

    if (!_id)
    throw {code: 400, message: "ID not provided" };

    const exsist = await languageControl.readOne({_id})
    if(!exsist) 
    throw({code: 404, message: "language not found" });

    const language = await languageControl.del({_id})
    return language;

}

module.exports = { create, read, readOne, update, updateWordInAll, updateWordInOne, del }