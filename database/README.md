# Database Access Guide

This project is connected to a remote MySQL database hosted on [Railway](https://railway.app/). All connection parameters are securely managed via your local `.env` file.

Below are instructions on how to access and manage your remote database.

## Connecting via MySQL Workbench (Recommended)

MySQL Workbench provides a visual interface to view tables, run SQL queries, and manage your data.

### Step-by-Step Setup

1. Open **MySQL Workbench**.
2. Click the **`+`** icon next to "MySQL Connections" on the home screen to add a new connection.
3. In the "Setup New Connection" window, configure the following:
   - **Connection Name:** `Railway Internship Portal` *(or any name you prefer)*
   - **Connection Method:** `Standard (TCP/IP)`
   - **Hostname:** `yamanote.proxy.rlwy.net`
   - **Port:** `53513`
   - **Username:** `root`
4. Click on the **Store in Vault...** button next to Password and enter your password: **`dEHVJngUAxkOSZxWMtFqTqcostWhRXKm`**
   - *(Note: This is the `DB_PASSWORD` from your `.env` file)*
5. *(Optional)* Set **Default Schema:** `railway`

### Testing and Saving
- Click the **Test Connection** button at the bottom. 
- If everything is entered correctly, you will see a success popup!
- Click **OK** to save the connection. You can now click on your new connection box on the home screen to open the database and view tables like `STUDENT`, `FACULTY`, `APPLICATION`, etc.

---

## Connecting via CLI (Command Line)

If you have MySQL installed locally and prefer the terminal, you can connect directly using the following command:

```bash
mysql -h yamanote.proxy.rlwy.net -P 53513 -u root -pdEHVJngUAxkOSZxWMtFqTqcostWhRXKm railway
```

*Note: There is no space between `-p` and your password.*

---
**⚠️ Security Note:** 
Never commit your `.env` file or share your `DB_PASSWORD` publicly. If the password is ever compromised, rotate it immediately in your Railway dashboard and update your `.env` file.

---

## Accessing MongoDB via MongoDB Atlas (Web)

This project uses a MongoDB Atlas cloud cluster for storing unstructured data like **Activity Logs** and **File Uploads (Reports)**. 

You can view and manage this data directly from your web browser without installing any extra software!

### Step-by-Step Instructions

1. **Log in:** Go to [mongodb.com](https://www.mongodb.com/cloud/atlas) and sign in to your Atlas account.
2. **Navigate to the Database:** In the left-hand menu under the **Deployment** section, click on **Database**.
3. **Open Collections:** Next to your cluster (usually named `Cluster0`), click the **Browse Collections** button.
4. **View Data:** 
   - On the left side, you will see a list of databases. Click on **`internship_portal`**.
   - Inside that database, click on the **`activity_logs`** collection.
   - You will now see the actual JSON documents representing your platform's activity logs! 
   
*Tip: You can refresh this page to see new logs appear in real-time as users interact with the application.*
---

## Accessing MongoDB via MongoDB Compass

In addition to MySQL for structured data, this project uses a MongoDB Atlas cloud cluster for storing unstructured data like **Activity Logs** and **File Uploads (Reports)**. 

The easiest way to view and manage this data is by using **[MongoDB Compass](https://www.mongodb.com/products/compass)**, a free graphical interface for MongoDB.

### Step-by-Step Setup

1. Download and open **MongoDB Compass**.
2. On the welcome screen, you will see a text box asking for a connection string (URI).
3. Copy your exact `MONGO_URI` string from your `.env` file. It will look like this:
   `mongodb+srv://sharmamohan2457:TeamHello@cluster0.drmbt1j.mongodb.net/?appName=Cluster0`
4. Paste that string directly into the text box in MongoDB Compass.
5. Click the **Connect** button.

Once connected, you will see your `internship_portal` database. Click on it to view the `activity_logs` collection, where you can easily read, edit, or delete any generated logs!
