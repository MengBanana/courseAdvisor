const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const assert = require("assert");


let url = process.env.MONGODB_URI || require("./loginDetails.js");
let db;
mongoClient.connect(url, function(error, client) {
  assert.equal(error, null);
  db = client.db("ratecourse");
});


router.get("/getAllProfessors", function(err,res) {
  db.collection("professor").find().toArray(function(error,result) {
    if(error) {
      throw error;
    }
    console.log("got p list!");
    res.send(result);
  });
});

router.get("/getAllCourses", function(err,res) {
  db.collection("course").find().toArray(function(error,result) {
    if(error) {
      throw error;
    }
    console.log("got c list!");
    res.send(result);
  });
});

router.get("/getCPList", function(err,res) {
  db.collection("CPpair").find().toArray(function(error,result) {
    if(error) {
      throw error;
    }
    console.log("got CPpair list!");
    res.send(result);
  });
});

router.get("/getMatches", function(request, response) {
  const data = request.query;
  db.collection("CPpair").find({ professor: data.professor, courseId: data.course})
    .toArray(function(error,result) {
      if(error) {
        throw error;
      }
      console.log("got MATCH list!");
      response.send(result);
    });
});

router.get("/getComments", function(request, response) {
  const data = request.query;
  db.collection("comment").find({ courseId: data.courseId, professor: data.professor}).toArray(function(error,result) {
    if(error) {
      throw error;
    }
    console.log("got comments");
    response.send(result);     
  });
});

router.post("/saveComments", function(request, response) {
  const data = request.body.data;
  db.collection("comment").insertOne({ 
    courseId: data.courseId, 
    professor: data.professor, 
    username:data.username, 
    comment: data.comment
  }),(function(error) {
    if(error) {
      throw error;
    }
    response.send("comment saved");
  });
});


router.get("/getPD", function(request, response) {
  const data = request.query;
  db.collection("professor").find({ professor: data.professor}).toArray(function(error,result) {
    if(error) {
      throw error;
    }
    console.log("got professor description");
    response.send(result);     
  });
});

router.get("/getCD", function(request, response) {
  const data = request.query;
  db.collection("course").find({ courseId: data.courseId}).toArray(function(error,result) {
    if(error) {
      throw error;
    }
    console.log("got course description");
    response.send(result);     
  });
});


module.exports = router;