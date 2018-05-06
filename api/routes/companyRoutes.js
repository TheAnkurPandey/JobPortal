'use strict';

//Imports Modules
var express = require('express');
var router = express.Router();

//Imports Company Model
var Company = require('../models/companyModel');

//API end-point: (GET) http://localhost:1000/companies/list
//List all the companies registered for placement events
router.get('/list',  function(req, res) {
    Company.find(function(err, companies) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(companies);
    });
});

//API end-point: (GET) http://localhost:1000/companies/:companyName
//List the details of company registered for placement events
router.get('/:companyName',  function(req, res) {
    Company.findById(req.params.companyName, function(err, companies) {
        if (err) {
            res.send(err);
            return;
        }
        if(!companies){
            res.json({ message: 'Company Name: ' + req.params.companyName + ' is not registered for placement event'});
            return;
        }
        res.json(companies);
    });
});

//API end-point: (POST) http://localhost:1000/companies/register
//Register the company for particular placement event
router.post('/register', function(req, res) {

    //Validate the data of json request
    req.checkBody("_id", "Enter valid company name.").isValidChars();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        Company.findById(req.body._id, function(err, companyData) {
            if (err) {
                res.send(err);
                return;
            }
            //If company already exist
            if(companyData) {
                res.json({ message: 'Company Name: ' + req.body._id + ' is already registered'});
                return;
            }
            //Otherwise store the details of company
            else {
                var company = new Company(); // new instance of a Company
                company._id = req.body._id;

                //Save the details of registered companies
                company.save(function (err) {
                    if (err) {
                        res.send(err);
                        return;
                    }
                    res.json({ message: 'Company Name: ' + req.body._id + ' registered successfully'});
                });
            }
        });
    }
});

//API end-point: (DELETE) http://localhost:1000/companies//unregister/:companyName
//Unregister the company for particular placement event
router.delete('/unregister/:companyName', function(req, res) {
    req.checkParams("companyName", "Enter valid company name.").isAlpha();
    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        Company.findById(req.params.companyName, function(err, companies) {
            if (err) {
                res.send(err);
            }
            //If company doesn't exist
            if (!companies){
                res.json({
                    message: "Company Name: " + req.params.companyName + "'s doesn't exist"
                });
            }
            //Otherwise remove the entry of company
            else {
                Company.remove({
                    _id: req.params.companyName
                }, function (err) {
                    if (err){
                        res.send(err);
                    }
                    else{
                        res.json({
                            message: req.params.companyName + " unregistered successfully"
                        })
                    }
                });
            }
        });
    }
});

module.exports = router;