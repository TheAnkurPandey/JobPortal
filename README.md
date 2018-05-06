# JobPortal
RestAPIs for Job offering websites

#Run following commands
npm install
node server.js

//Models contains Student and Company
//Routes contains api endpoints

#Full Postman Documentation of the above APIs:
https://documenter.getpostman.com/view/2260784/restapi-for-placement-events/RW1boKct

#APIs

(GET)http://localhost:1000/students/list
List all the students present in the database

(POST)http://localhost:1000/students/add
Insert the new student in the database

(GET)http://localhost:1000/students/:student_id
List the details of the given student

(PUT)http://localhost:1000/students/:student_id
Update the details of student

(DELETE)http://localhost:1000/students/:student_id
Delete the data of student

(PUT)http://localhost:1000/students/register/:student_id
Register the student for placement event for particular company

(PUT)http://localhost:1000/students/unregister/:student_id
Unregister the student for placement event for particular company


(GET)http://localhost:1000/companies/list
List all the companies registered for placement events

(GET)http://localhost:1000/companies/:companyName
List the details of company registered for placement events

(POST)http://localhost:1000/companies/register
Register the company for particular placement event

(DELETE)http://localhost:1000/companies//unregister/:companyName
Unregister the company for particular placement event

#Schema

student {
    _id: Number,
    name: String,
    department: String,
    cgpa: Number,
    interestedCompanies: {
        type: [String],
        required: false
    }
}

company {
    _id: String
}

#Allowed branches: 
["Information Technology", "Computer Science", "Electronics", "Mechanical"]