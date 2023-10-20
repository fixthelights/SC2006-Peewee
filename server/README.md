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
MONGO_HOST= limzhengguang.com
MONGO_PORT= 27017
MONGO_DB = peewee
MONGO_TLS = TRUE
MONGO_USER = user
MONGO_PASS = bjRUVe5o9xr7TVRd384sQ0k862SqWhVq5cbDec94

# ---------------
# Task Processing configuration (for AI trends generation)
PROCESSING = FALSE
```

To connect to our cloud mongoDB server using `mongosh` or `mongo`, enter:
```
mongosh -tls --host limzhengguang.com -u user -p bjRUVe5o9xr7TVRd384sQ0k862SqWhVq5cbDec94
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
The traffic API endpoint has 2 collection of resources: `conditions` and `trends`.

Do **note** that the following endpoints **may not return data on all 90 traffic cameras**. It depends on LTA's data and our AI's error rate.

### Traffic Conditions

#### `GET` `/traffic/combined-conditions`
> Returns the latest, information on traffic conditions by consolidating all processed traffic cameras.
```json
{
    "camera_count": 89,
    "vehicle_total": 167,
    "vehicle_avg": 2,
    "taken_at": "10/16/2023, 2:57:23 AM"
}
```
---
#### `GET` `/traffic/conditions`
> Returns the latest information on traffic conditions of all processed traffic cameras.
```json
{
    "date": "10/19/2023, 7:57:26 PM",
    "camera_count": 88,
    "cameras": [
        ...
        {
            "camera_name": "1705",
            "camera_id": "6529c74b46a5bed4455081b3",
            "location": {
                "long": 103.8587986,
                "lat": 1.375925022
            },
            "url": "https://images.data.gov.sg/api/traffic-images/2023/10/28af481a-eda4-4f8a-8bf3-c5bb96d5d5db.jpg",
            "vehicle_count": 12,
            "peakedness": 0.7058823529411765
        },
        {
            "camera_name": "1706",
            "camera_id": "6529c74c46a5bed4455081b7",
            "location": {
                "long": 103.85806,
                "lat": 1.38861
            },
            "url": "https://images.data.gov.sg/api/traffic-images/2023/10/a164144d-b94c-4907-8ac7-e1005f9872cb.jpg",
            "vehicle_count": 16,
            "peakedness": 0.9411764705882353
        },
        ...
    ]
}
```

**Notes**
`peakedness` provides a percentage number, from 0 to 1, of the current traffic "peakedness" by comparing with Trend data. Be careful, **peakednes** may return **null** if there are missing Trend data. Type is (number | null).

---
#### `GET` `/traffic/conditions/:cameraId`
> Returns the latest information on traffic conditions of one processed traffic camera.
```json
{
    "date": "10/16/2023, 2:57:23 AM",
    "camera_name": "1001",
    "camera_id": "6529c77c46a5bed4455082dc",
    "location": {
        "long": 103.871146,
        "lat": 1.29531332
    },
    "url": "https://images.data.gov.sg/api/traffic-images/2023/10/e461432d-7643-4735-9504-86048e8af35d.jpg",
    "vehicle_count": 0,
    "peakedness": 0
}
```
**Defined Error Types**
> Check with error.type === "MyErrorType"

**Notes**
`peakedness` provides a percentage number, from 0 to 1, of the current traffic "peakedness" by comparing with Trend data. Be careful, **peakednes** may return **null** if there are missing Trend data. Type is (number | null).

`CameraNotFoundError`

### Traffic Trends

#### `GET` `/traffic/combined-trends`
> Returns traffic trends by consolidating all processed traffic cameras.
- time_of_day ranges from 0 to 23

```json
{
    "generated_at": "10/14/2023, 11:52:33 AM",
    "hourly_counts": [
        {
            "time_of_day": 0,
            "vehicle_avg": 5,
            "vehicle_total": 416
        },
        {
            "time_of_day": 1,
            "vehicle_avg": 4,
            "vehicle_total": 344
        },
        ...
        {
            "time_of_day": 23,
            "vehicle_avg": 5,
            "vehicle_total": 444
        }
    ]
}
```
---
#### `GET` `/traffic/trends/:cameraId`
> Returns the traffic trends of one processed traffic camera.
```json
{
    "camera_id": "6529c77c46a5bed4455082dc",
    "last_updated": "10/14/2023, 11:52:33 AM",
    "location": {
        "long": 103.871146,
        "lat": 1.29531332
    },
    "hourly_counts": [
        {
            "time_of_day": 0,
            "vehicle_count": 0
        },
        {
            "time_of_day": 1,
            "vehicle_count": 0
        },
        ...
        {
            "time_of_day": 23,
            "vehicle_count": 0
        }
    ]
}
```
**Defined Error Types**
> Check with error.type === "MyErrorType"

`CameraNotFoundError`

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