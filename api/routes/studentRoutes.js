'use strict';

//Imports Modules
var express = require('express');
var router = express.Router();
var util = require('util');

//Imports Student Model
var Student = require('../models/studentModel');

//API end-point: (GET) http://localhost:1000/students/list
//List all the students present in the database
router.get('/list',  function(req, res) {
    Student.find(function(err, students) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(students);
    });
});

//API end-point: (POST) http://localhost:1000/students/add
//Insert the new student in the database
router.post('/add', function(req, res) {

    //convert the all chars to lower case
    req.body.name = req.body.name.toLowerCase();
    req.body.department = req.body.department.toLowerCase();

    //Validate the data of json request
    req.checkBody("_id", "Enter a valid Student_id.").isInt();
    req.checkBody("name", "Enter a valid name.").isValidChars();
    req.checkBody("department", "Enter a valid department name.").isValidChars().in();
    req.checkBody("cgpa", "Enter a valid cgpa, cgpa>=0.0 and cgpa<=10.0.").isFloat({min: 0.0, max: 10.0});
    if (req.body.interestedCompanies) {
        req.body.interestedCompanies = req.body.interestedCompanies.toLowerCase();
        req.checkBody("interestedCompanies", "Enter a valid company.").isValidChars();
    }
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }

    else {
        var student = new Student(); // new instance of a Student
        student._id = req.body._id;
        student.name = req.body.name;
        student.department = req.body.department;
        student.cgpa = req.body.cgpa;
        if (req.body.interestedCompanies) {
            student.interestedCompanies = req.body.interestedCompanies;
        }
        //Store the new student entry in database
        student.save(function(err) {
            if (err) {
                res.send(err);
                return;
            }
            res.json({message: "Student_id: " + req.body._id+ ' added successfully'});
        });
    }
});

//API end-point: (GET) http://localhost:1000/students/:student_id
//List the details of the given student
router.get('/:student_id', function(req, res) {

    //Validate the student_id params present in API end-point
    req.checkParams('student_id', '"student_id" must be Int').isInt();
    req.getValidationResult().then(function (validationResult) {
        if (!validationResult.isEmpty()) {
            res.json({
                result: "Failed",
                message: `Validation errors: ${util.inspect(validationResult.array())}`
            });
        }

        else {
            Student.findById(req.params.student_id, function(err, student) {
                if (err) {
                    res.send(err);
                    return;
                }
                //If student_id doesn't exist
                if (!student) {
                    res.json({
                        message: "Student_id: " + req.params.student_id + " doesn't exist"
                    });
                    return;
                }
                res.json(student);
            });
        }
    });
});

//API end-point: (PUT) http://localhost:1000/students/:student_id
//Update the details of student
router.put('/:student_id', function(req, res) {

    //convert the all chars to lower case
    req.body.name = req.body.name.toLowerCase();
    req.body.department = req.body.department.toLowerCase();

    //Validate the data of json request
    req.checkBody("name", "Enter a valid name.").isValidChars();
    req.checkBody("department", "Enter a valid department name.").isValidChars().in();
    req.checkBody("cgpa", "Enter a valid cgpa in string format, cgpa>=0.0 and cgpa<=10.0.").isFloat({min: 0.0, max: 10.0});
    if (req.body.interestedCompanies) {
        req.body.interestedCompanies = req.body.interestedCompanies.toLowerCase();
        req.checkBody("interestedCompanies", "Enter a valid company.").isValidChars();
    }
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }

    else {
        Student.findById(req.params.student_id, function(err, student) {
            if (err) {
                res.send(err);
                return;
            }
            //If student_id doesn't exist
            if (!student) {
                res.json({
                    message: "Student_id: " + req.params.student_id + " doesn't exist"
                });
                return;
            }
            //Otherwise store the updated data
            student.name = req.body.name;
            student.department = req.body.department;
            student.cgpa = req.body.cgpa;
            student.save(function (err) {
                if (err){
                    res.send(err);
                    return;
                }
                res.json({
                    message: "Student_id: " + req.params.student_id + " is updated"
                });
            });
        });
    }
});

//API end-point: (DELETE) http://localhost:1000/students/:student_id
//Delete the data of student
router.delete('/:student_id', function(req, res) {

    //Validate the student_id params present in API end-point
    req.checkParams('student_id', '"student_id" must be Int').isInt();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }

    Student.findById(req.params.student_id, function(err, student) {
        if (err) {
            res.send(err);
            return;
        }
        //If student_id doesn't exist
        if (!student) {
            res.json({
                message: "Student_id: " + req.params.student_id + " doesn't exist"
            });
            return;
        }
        //Otherwise remove the entry
        else {
            Student.remove({
                _id: req.params.student_id
            }, function (err) {
                if (err){
                    res.send(err);
                    return;
                }
                res.json({
                    message: "Student_id: " + req.params.student_id + " successfully removed"
                })
            });
        }
    });
});

//API end-point: (PUT) http://localhost:1000/students/register/:student_id
//Register the student for placement event for particular company
router.put('/register/:student_id', function(req, res) {

    //Validate the student_id params present in API end-point
    req.checkParams('student_id', '"student_id" must be Int').isInt();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }

    Student.findById(req.params.student_id, function(err, student) {
        if (err) {
            res.send(err);
            return;
        }
        //If student_id doesn't exist
        if (!student) {
            res.json({
                message: "Student_id: " + req.params.student_id + " doesn't exist"
            });
            return;
        }
        //Otherwise register the student for placement event
        student.interestedCompanies.push([req.body.interestedCompanies]);
        student.save(function (err) {
            if (err){
                res.send(err);
                return;
            }
            res.json({
                message: "Student_id: " + req.params.student_id + " is registered for the " + req.body.interestedCompanies
            });
        });
    });
});

//API end-point: (PUT) http://localhost:1000/students/unregister/:student_id
//Unregister the student for placement event for particular company
router.put('/unregister/:student_id', function(req, res) {

    //Validate the student_id params present in API end-point
    req.checkParams('student_id', '"student_id" must be Int').isInt();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }

    Student.findById(req.params.student_id, function(err, student) {
        if (err) {
            res.send(err);
            return;
        }
        //If student_id doesn't exist
        if (!student) {
            res.json({
                message: "Student_id: " + req.params.student_id + " doesn't exist"
            });
            return;
        }
        //Otherwise unregister the student for placement event
        var index = student.interestedCompanies.indexOf(req.body.uninterestedCompanies);
        //If registered already for the comapny, then unregister the student
        if (index > -1) {
            student.interestedCompanies.splice(index, 1);
            student.save(function (err) {
                if (err){
                    res.send(err);
                }
                res.json({
                    message: "Student_id: " + req.params.student_id + " is unregistered for the " + req.body.uninterestedCompanies
                });
            });
        }
        // If not registered already for the company
        else {
            res.json({
                message: "Student_id: " + req.params.student_id + " is not registered for the " + req.body.uninterestedCompanies
            });
        }
    });
});

module.exports = router;