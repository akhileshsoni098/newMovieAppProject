## Project - Job Portal


### Key points
- In this project we will work feature wise. That means we pick one object like user/admin,movies , watchList, etc at a time. We work through it's feature. The steps would be:
  1) We create it's model.
  2) We build it's APIs.
  3) We test these APIs.
  4) We deploy these APIs.
  5) We integrate these APIs with frontend.
  6) We will repeat steps from Step 1 to Step 5 for each feature in this project.


- In this project we are changing how we send token with a request. Instead of using a custom header key like x-api-key, you need to use Authorization header and send the JWT token as Bearer token.


## FEATURE I - User/Admin
### Models
- User/Admin Model
yaml
```
{
  fname: {String, mandatory},
  lname: {String, mandatory},
  role: {enum:["user", "admin"], default "user"},
  email: {String, mandatory},
  password: {String , mandatory},
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

## User/Admin APIs

### POST /registeration
 _Request format_
yaml
{
  fname, lname, role, email, password,

}


- Create a User/Admin document from request body. 
- Save password in encrypted format. (use bcrypt)
- _Response format_
  - *On success* - Return HTTP status 201.
  - *On error* - Return a suitable error message with a valid HTTP status code.
yaml
```
{
    "status": true,
    "message": "Admin created successfully",
    "data": {
        "fname": "John",
        "lname": "Doe"
        "email": "johndoe@mailinator.com",
        "role":"user"
        "password": "$2b$10$DpOSGb0B7cT0f6L95RnpWO2P/AtEoE6OF9diIiAEP7QrTMaV29Kmm",
        "_id": "6162876abdcb70afeeaf9cf5",
        "createdAt": "2021-10-10T06:25:46.051Z",
        "updatedAt": "2021-10-10T06:25:46.051Z",
        "__v": 0
    }
}
```


### POST /login

_Request format_
yaml
{
   email, password,

}

- Allow an Admin to login with their email and password.
- On a successful login attempt return the userId and a JWT token contatining the userId
>
- _Response format_
  - *On success* - Return HTTP status 200 and JWT token in response body.
  - *On error* - Return a suitable error message with a valid HTTP status code.
yaml
```
{
    "status": true,
    "message": "login successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTYyODc2YWJkY2I3MGFmZWVhZjljZjUiLCJpYXQiOjE2MzM4NDczNzYsImV4cCI6MTYzMzg4MzM3Nn0.PgcBPLLg4J01Hyin-zR6BCk7JHBY-RpuWMG_oIK7aV8"
    
}
```


## GET /getUser (Authentication required)

_Request format_(by query)
yaml



- Allow an admin to fetch details of their profile.
- Make sure that userId in url param and in token is same
- _Response format_
  - *On success* - Return HTTP status 200 and returns the user document.
  - *On error* - Return a suitable error message with a valid HTTP status code.
yaml
```
{
    "status": true,
    "message": "all details",
    "data": {}
}
```
### PUT /updateUser

_Request format_
yaml
```
{
   fname, lname, email, password
}
```
- Updates a User/admin data by changing at least one or all fields
- Check if the adminId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404


### DELETE /deleteUser

Request format_
yaml
```
{
  paramsId
}
```
- Deletes a user by admin id if it's not already deleted and if user is admin deleting all the tthe movies uploadedby him an claer all the watchList reviews and rating given by the user/admin
- _Response format_
  - *On success* - Return HTTP status 200.




## FEATTURE II - movie Model (authentication required as authorization header - bearer token)

### movies model
- only admin can upload the movies
# use Api key to store the movie in db search by title
```
{
  title: {String,mandatory},
  year: {String},
  imdbID: {String},
  type: {String},
  poster: {String},
  adminId:{ref: userModel}
  timestamps

}
```

## movie APIs
### POST /saveMovie

Request format_
```
yaml
{

"title":"movie name"

}
```
- _Response format_
  
yaml
```
{
   "status": true,
    "message": "Movie saved successfully",
    "data": {
        "title": "Chhupa Rustam: A Musical Thriller",
        "year": "2001",
        "imdbID": "tt0279021",
        "type": "movie",
        "poster": "https://m.media-amazon.com/images/M/MV5BNGI4YWQ3MzQtNTM2Ny00YzcyLWIzYjQtZmNkOGVlYWIyM2EzXkEyXkFqcGdeQXVyNTM0MDc1ODE@._V1_SX300.jpg",
        "adminID": "6435bd6d7f9fcbb0d1ff9271",
        "isDeleted": false,
        "_id": "6437b57dec6ca4e25e8bbd95",
        "__v": 0
    }
}
```
### get /getAllMovies

Request format_

yaml

 _Response format_
yaml
```
{
    "status": true,
    "message": "Movie saved successfully",
    "data": [ {
        "title": "Chhupa Rustam: A Musical Thriller",
        "year": "2001",
        "imdbID": "tt0279021",
        "type": "movie",
        "poster": "https://m.media-amazon.com/images/M/MV5BNGI4YWQ3MzQtNTM2Ny00YzcyLWIzYjQtZmNkOGVlYWIyM2EzXkEyXkFqcGdeQXVyNTM0MDc1ODE@._V1_SX300.jpg",
        "adminID": "6435bd6d7f9fcbb0d1ff9271",
        "isDeleted": false,
        "_id": "6437b57dec6ca4e25e8bbd95",
        "__v": 0
    },
    {
        "title": "Chhupa Rustam: A Musical Thriller",
        "year": "2001",
        "imdbID": "tt0279021",
        "type": "movie",
        "poster": "https://m.media-amazon.com/images/M/MV5BNGI4YWQ3MzQtNTM2Ny00YzcyLWIzYjQtZmNkOGVlYWIyM2EzXkEyXkFqcGdeQXVyNTM0MDc1ODE@._V1_SX300.jpg",
        "adminID": "6435bd6d7f9fcbb0d1ff9271",
        "isDeleted": false,
        "_id": "6437b57dec6ca4e25e8bbd95",
        "__v": 0
    }]
}
```


## GET /getFilterMovies (Authentication required)
Request format_
yaml
```
{
  userId
}
```
- Allow an user to fetch details of their profile.
- Make sure that userId in url param and in token is same


### GET /getById/:movieId
Request format_
yaml
```
{
  movieId should be in params

}
```

- Check if the moviesId/userId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404


### DELETE /movies/:movieId
Request format_
yaml
```
{
  movieId

}
```
- Deletes a movie by movieId if it's not already deleted
- _Response format_
  - *On success* - Return HTTP status 200.






## FEATURE III - watchList
### watchList Models
- watchList
yaml
```
{

 userID: {
    type: ObjectId,
    ref: "User",
  },

  movies: {
    type: ObjectId,
    ref: "Movie",
  }

}

```



## watcList APIs
### POST API - /addWatchList/:movieId
- add to watchList

Request format_
```
{
  
  movieId

}
```
- _Response format_

yaml
```
{
"_id":"9435bd6d7f9fcbb0d1ff9270"

"userId":"6435bd6d7f9fcbb0d1ff9271"
"movieId":"6475bd6d7f9fcbb0d1ff0983"


}
```
### GET API - /getWatchList

Request format_
```
{
  userId from token

}
```

### delete API - /deleteMovieWatchList/:movieId"

- user/ admin can remove any selected movie from the watchList
- Check if the movie exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404
Request format_
```
{
  movieId
}
```

### clear wattchList

### DELETE /clearAllWatchList
Request format_
```
{
  user/admin id token 

}
```


### Successful Response structure
yaml
```
{
  status: true,
  message: 'Success',
  data: {


  }
}
```
### Error Response structure
yaml
```
{
  status: false,
  message: ""
}
```
//....  Reviews remains ..... //






