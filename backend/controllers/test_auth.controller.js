

let allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
let studentBoard = (req, res) => {
    res.status(200).send("student Content.");
  };
  
let teacherBoard = (req, res) => {
    res.status(200).send("teacher Content.");
  };
  

  export { allAccess, teacherBoard, studentBoard }