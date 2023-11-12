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
# For convenience, a test config is provided but for future usage, replace it with your own MongoDB config
MONGO_HOST= limzhengguang.com
MONGO_PORT= 27017
MONGO_DB = peewee
MONGO_TLS = TRUE
MONGO_USER = user
MONGO_PASS = bjRUVe5o9xr7TVRd384sQ0k862SqWhVq5cbDec94

# ---------------
# Task Processing configuration (for AI trends generation)
# Only to be enabled on the main server
PROCESSING = FALSE

# ---------------
# Email Service for Authentication
# For convenience, a test API Key is provided but for future usage, replace it with your own API Key at https://developers.brevo.com/docs
BREVO_KEY = "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" 
```

To connect to our cloud mongoDB server using `mongosh` or `mongo`, enter:
```
mongosh -tls --host limzhengguang.com -u user -p bjRUVe5o9xr7TVRd384sQ0k862SqWhVq5cbDec94 peewee # Replace with your own MongoDB Configuration
```

## Starting the backend
In the `server/src` folder, run the following command:

```
npm run dev
```

The backend server will be hosted on http://localhost:2000 by default.