const moment = require('moment');
const { appendFileSync, existsSync, mkdirSync } = require("fs")
const chalk = require('chalk');




 const error = (message, e= false,user=null, writeToFile=false,)=>{
    const celler ="Location undefine"
    if(e){
        e=e.stack.split('\n')[1].trim().split("Stepby-server")[1].replace(")","")
    }
    let mes= `${getDate()} ERROR: ${message} ${e} user:${user}`
   console.log(chalk.red(mes))
   
   if(writeToFile){
    writeToFile(mes)
   }
}


const getDate = ()=>{
    return moment(new Date()).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
}

const writeToFile =(message)=>{
    const logDir ='./logs'
    const data =`${message}\r\n`
   if(!existsSync(logDir)){
    mkdirSync(logDir)
   }

   const options = {
    encoding: 'utf8',
    mode:438
   }
   appendFileSync(`./logs/${level}.log`, data, options )
}

  
module.exports = {error} ;
