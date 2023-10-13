# Configuration
> **[IMPORTANT]** This step **must** be completed to enable communication between server and database.

Create a `.env` file in the current working directory. Here's an example:

```diff
    server
+   ├── .env
    ├── .gitignore
    ├── README.md
    ├── index.ts
    ├── node_modules
    ├── nodemon.json
    ├── package-lock.json
    ├── package.json
    ├── src
    └── tsconfig.json
```
Here's an example of a `.env` configuration file, where you can copy directly:

```dotenv
# ---------------
# ExpressJS configuration
PORT= 2000

# ---------------
# MongoDB connection configuration
MONGO_HOST= localhost
MONGO_PORT= 27017
MONGO_DB = peewee
MONGO_TLS = FALSE
MONGO_USER = #Can be left blank
MONGO_PASS = #Can be left blank
```


# API Design Guidelines
https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/

Here's an example of API `URI` routes: 
`/users`
`/incidents`
`/routes`

Guidelines for naming of API `URI` (for collections)
- 3 layers deep only
- plural nouns
- no verbs (use HTTP methods instead)
- use dashes for readability (/traffic-conditions)

#### HTTP Methods
`CRUD` Operations. More Information [here](https://www.codecademy.com/article/what-is-crud).
>C - Create
R - Read
U - Update
D - Delete

- HTTP **`GET`** (Read)
- HTTP **`POST`** (Create)
- HTTP **`PUT`** (Update)
- HTTP **`DELETE`** (Delete)

#### HTTP Status Codes
More Information [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

1. 200  (Success/OK)
2. 301 (Permanent Redirect)
3. 302 (Temporary Redirect)
4. 304 (Not Modified)
5. 400 (Bad Request)
6. 401 (Unauthorized Error)
7. 403 (Forbidden)
8. 404 (Not Found)
9. 500 (Internal Server Error)
10. 501 (Not Implemented)



# Routes

## Authentication (Cheng Yao)

`/login`
`/register`
`/forgot-password`

## Incidents
> Location, Type, Description, Time

`/incidents`
(CRUD)

```javascript
{
    location: {
        long: 1.021201
        lat: 1.212121
    },
    type: "Crash",
    description: "Test"
}
```

## Routes
> Route Data (GMAPS?)

`/routes`
> or /favorites ?

(CRUD)

Maybe Route can just include source and destination.

## Traffic
> Current Conjestion levels, History of Car counts

`/traffic-conditions` 
- Return all traffic camera locations and car counts

```javascript
{
    camera1:{
        location: {
            long: 1.021201,
            lat: 1.212121
        },
    car-count-history:[
        {
            timestamp: 1pm,
            car-count: 100
        },
        {
            timestamp: 2pm,
            car-count: 120
        },
        {
            timestamp: 3pm,
            car-count: 140
        }
    ]
    }
}
```

## Cameras
> Picture, Location, Time, Car Count

`/cameras`
- Request for traffic camera feed from specified location

GET /cameras/{cameraId}

```javascript
{
    picture: picture (maybe url),
    location:{
        long: 1.21212,
        lat: 1.1212121
    }
}
```