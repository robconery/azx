const {exec} = require("child_process");

exports.run = function(cmd){

  return new Promise((resolve, reject) => {

    exec(cmd, function(err, stdout){
      if(err) return reject(err)
      return resolve(stdout);
    });
    
  }) 
}
exports.runJSON = function(cmd){

  return new Promise((resolve, reject) => {
    //console.log(cmd);
    exec(cmd, function(err, stdout){
      if(err) return reject(err)
      return resolve(JSON.parse(stdout));
    });
  }) 
}