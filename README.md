cs558-submission-handler
=======================

Handles unpacking submissions properly and in the right place.

Usage:
```javascript
//The module exposes a single function, a constructor for a ClassSrcHandler object.
//Which takes one argument, path to the top of the submission src directory.
var createSrcHandler = require("cs558-submission-handler");

var srcHandler = createSrcHandler(pathToSubmissions);

//This object in turn only exposes one function, extract(), which takes 
//as arguments, in order, the student's name, the assignment number, the 
//attempt number, the raw tar.gz buffer, and a callback which if there is
//an error will receive an error string as its first argument, otherwise it 
//is null, and the second argument is the path to the source unpacked...
srcHandler.extract(studentName, assignmentNumber, attemptNumber, targzBuff, function(err, val){
  if(err){
    //error extracting
  }else{
    //successfully unpacked submission, val = pathToUnpackedSubmission
  }
});
```
