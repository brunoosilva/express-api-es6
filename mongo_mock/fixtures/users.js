var id = require('pow-mongodb-fixtures').createObjectId;

exports.users = [
    {
        "_id" : id("100000000000000000000000"),
        "name" : "Bruno",
        "email" : "bruno.silva@teste.com.br",
        "photo" : "https://s3.amazonaws.com/",
        "type" : "admin",
        "status" : "enable",
        "office": "Front-end Developer",
        "signature": "https://s3.amazonaws.com/",
        "description": "teste",
        "facebookUrl" : "https://www.facebook.com/",
        "twitterUrl" : "https://www.twitter.com/",
        "googlePlusUrl" : "https://plus.google.com/",
        "linkedInUrl" : "https://www.linkedin.com/in/brunoweb",
        "createdAt": "2016-11-29T16:36:57.043Z"
    },
    {
        "_id" : id("100000000000000000000001"),
        "name" : "Teste",
        "email" : "teste@teste.com.br",
        "photo" : "https://s3.amazonaws.com/",
        "type" : "teacher",
        "status" : "enable",
        "office": "Professor",
        "signature": "https://s3.amazonaws.com/",
        "description": "teste",
        "facebookUrl" : "https://www.facebook.com/",
        "twitterUrl" : "https://www.twitter.com/",
        "googlePlusUrl" : "https://plus.google.com/",
        "linkedInUrl" : "https://www.linkedin.com/in/",
        "createdAt": "2016-11-29T16:36:57.043Z"
    },
    {
        "_id" : id("100000000000000000000002"),
        "name" : "Editor",
        "email" : "editor@teste.com.br",
        "photo" : "https://s3.amazonaws.com/",
        "type" : "editor",
        "status" : "enable",
        "office": "Editor",
        "signature": "https://s3.amazonaws.com/",
        "description": "Editor",
        "facebookUrl" : "https://www.facebook.com/",
        "twitterUrl" : "https://www.twitter.com/",
        "googlePlusUrl" : "https://plus.google.com/",
        "linkedInUrl" : "https://www.linkedin.com/in/",
        "createdAt": "2016-11-29T16:36:57.043Z"
    }
];
