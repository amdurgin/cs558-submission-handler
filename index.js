var fs = require("fs");

var targz = require("tar.gz");

var ClassSrcHandler = function(pathToSrcDir){
  this.topDir = pathToSrcDir;
  if(!fs.existsSync(this.topDir)){
    fs.mkdirSync(this.topDir);
  }
  this.extract = extract;

}

//where file is raw buffer of src.tar.gz
//writes src.tar.gz to topDir/name/Assignment<num>/Attempt<num>/
//extracts src directory to topDir/name/Assignment<num>/Attempt<num>/src/
var extract = function(name, aNum, attempt, file, cb){
  var topDir = this.topDir;
  var pathToTargz = topDir + "/" + name + "/" + "Assignment" + aNum + "/Attempt" + attempt + "/";
  var pathToSrc = topDir + "/" + name + "/" + "Assignment" + aNum + "/Attempt" + attempt + "/src/";
  mkdirutil(pathToTargz, function(err){
    if(err){
      console.log(err);
      cb(err);
    }else{
      fs.writeFile(pathToTargz + "/src.tar.gz", file, function(err){
        if(err){
          console.log(err);
          cb(err);
        }else{
          mkdirutil(pathToSrc, function(err){
            if(err){
              console.log(err);
              cb(err);
            }else{
              (new targz()).extract(pathToTargz + "/src.tar.gz", pathToSrc, function(err){
                if(err){
                  console.log(err);
                  cb(err);
                }
                else{
                  cb(null, pathToSrc);
                }
              });
            }
          });
        }
      });
    }
  });
}


var buildDir = function(dirArr, index){
  var ret = dirArr[0] + "/";
  for(var i = 1; i <= index; ++i){
    ret += (dirArr[i] + "/");
  }
  return ret;
}

// checks if directory exists, if it doesnt, makes, otherwise w/e
// cb of form funcion(err), this turned way more fugly than it needed
var mkdirutil = function(dir, cb){
  var dirSplit = dir.split("/");
  //find top dir that exists
  var topInd = dirSplit.length-1;
  var rec = function(ind, dirSplit, cb){
    fs.exists(buildDir(dirSplit, ind), function(exists){
      if(!exists){
        rec(ind-1, dirSplit, cb);
      }else{ //hit bottom
        var mkdircb = function(err, dirSplit, ind, cb){
          if(err){
            console.log(err);
            cb(err);
          }else{
            if(ind < dirSplit.length){
              fs.mkdir(buildDir(dirSplit, ind), function(err){
                mkdircb(null, dirSplit, ind+1, cb);
              });
            }else{
              cb();//done
            }
          }
        }
        mkdircb(null, dirSplit, ind+1, cb);
      }
    });
  }
  rec(topInd, dirSplit, cb);
}

module.exports = ClassSrcHandler;




//where file is raw buffer of src.tar.gz
//writes src.tar.gz to topDir/name/Assignment<num>/
//extracts src directory to topDir/name/Assignment<num>/src/
//NOTE: i didnt mean for it to get this fugly...
/*var extract = function(name, aNum, attempt, file, cb){
  var topDir = this.topDir;
  
  //TODO: check if submission already exists?
  var pathToTargz = topDir + "/" + name + "/" + "Assignment" + aNum + "/Attempt" + attempt + "/";
  var pathToSrc = topDir + "/" + name + "/" + "Assignment" + aNum + "Attempt" + attempt + "/src/";
  //first check if student directory exists... it might fail, its not important
  fs.exists(topDir + "/" + name, function(exists){
    if(!exists){
      fs.mkdir(topDir + "/" + name, function(err){ 
        fs.exists(pathToTargz, function(exists){
          if(!exists){
            console.log("topDir/" + name + "/ doesn't exist, building it...");
            fs.mkdir(pathToTargz, function(err){
              if(err){
                console.log(err);
                cb(err);
              }else{
                console.log("made dir topDir/" + name);
                console.log("now writing tar to it");
                fs.writeFile(pathToTargz + "/src.tar.gz", file, function(err){
                  if(err){
                    console.log(err);
                    cb(err);
                  }else{
                    console.log("now checking if pathToSrc Exists...");
                    fs.exists(pathToSrc, function(exists){
                      if(!exists){
                        console.log("pathtosrc doesnt exist, making it...");
                        fs.mkdir(pathToSrc, function(err){
                          if(err){
                            console.log(err);
                            cb(err);
                          }else{
                            console.log("made pathtosrc, now extracting src.tar.gz to it...");
                            (new targz()).extract(pathToTargz + "/src.tar.gz", pathToSrc, function(err){
                              if(err){
                                console.log(err);
                                cb(err);
                              }
                              else{
                                cb(null, pathToSrc);
                              }
                            });//end extract
                          }
                        });//end mkdir
                      }
                      else{ //exists
                        console.log("pathtosrc exists now extracting src.tar.gz to it...");
                        (new targz()).extract(pathToTargz + "/src.tar.gz", pathToSrc, function(err){
                          if(err){
                            console.log(err);
                            cb(err);
                          }
                          else{
                            cb(null, pathToSrc);
                          }
                        });//end extract
                      }
                    }); //end xists
                  }
                });//end writefile
              }
            });//end mkdir
          }
          else{//exists
              console.log("exists, now writing targz to it...");
              fs.writeFile(pathToTargz + "/src.tar.gz", file, function(err){
                if(err){
                  console.log(err);
                  cb(err);
                }
                else{
                  console.log("checking if pathtosrc exists..");
                  fs.exists(pathToSrc, function(exists){
                    if(!exists){
                      console.log("it doesnt, so making it...");
                      fs.mkdir(pathToSrc, function(err){
                        if(err){
                          console.log(err);
                          cb(err);
                        }
                        else{
                          console.log(" extracting srctargfz");
                          (new targz()).extract(pathToTargz + "/src.tar.gz", pathToSrc, function(err){
                            if(err){
                              console.log(err);
                              cb(err);
                            }
                            else{
                              cb(null, pathToSrc);
                            }
                          });//end extract
                        }
                      });//end mkdir
                    }
                    else{ //exists
                        console.log("it does... extracting srctargz");
                        (new targz()).extract(pathToTargz + "/src.tar.gz", pathToSrc, function(err){
                          if(err){
                            console.log(err);
                            cb(err);
                          }
                          else{
                            cb(null, pathToSrc);
                          }
                        });//end extract
                    }
                  }); //end exists
                }
              });//end writefile
          }
        }); //end exists
      }); //end mkdir
    }//end if(!exists) for topDir/name
    else{//topDir/name exists
    
    }
  }
}//end extract
*/
