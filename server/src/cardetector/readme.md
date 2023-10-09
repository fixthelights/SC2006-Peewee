Flask server hosted on 0.0.0.0:8080

/detect POST param with file_path?=filepath in query URL
e.g. http://localhost:8080/detect?file_path=/Users/thehamcar/Work/SC2006-Peewee-main/SC2006-Peewee/server/src/cardetector/1711.jpg

returns a JSON with number of objects in each class
e.g. {
    "Car": 8,
    "Truck": 1
}

Saves the image with labelled features in same filepath as input, with "_labelled" as a suffix.
e.g. /Users/thehamcar/Work/SC2006-Peewee-main/SC2006-Peewee/server/src/cardetector/1711_labelled.jpg

