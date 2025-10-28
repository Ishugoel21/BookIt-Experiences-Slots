# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for the slot booking application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or sign in
3. Complete the registration process

## Step 2: Create a Cluster

1. Click **"Create"** or **"Build a Database"**
2. Choose the **FREE (M0)** tier
3. Select a cloud provider and region close to you (e.g., AWS, US East)
4. Click **"Create Cluster"**
5. Wait for the cluster to be created (takes a few minutes)

## Step 3: Create Database User

1. In the **Security** section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username (e.g., `slotbooking_user`)
5. Enter a secure password (save this!)
6. Under "Database User Privileges", select **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Configure Network Access

1. In the **Security** section, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
   - Or add your specific IP address for production
4. Click **"Confirm"**

⚠️ **Note**: Allowing access from anywhere is fine for development but should be restricted in production.

## Step 5: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** as your driver
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Your Backend

1. In the `backend` folder, create a `.env` file
2. Copy the connection string and update it:

```env
# MongoDB Atlas Connection
# Replace <password> and <username> with your actual credentials
MONGODB_URI=mongodb+srv://slotbooking_user:YourActualPassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Database Name
DB_NAME=slot-booking

# Server Port
PORT=3001
```

3. The connection string should look like:
```env
MONGODB_URI=mongodb+srv://slotbooking_user:MySecurePass123@cluster0.abcd1.mongodb.net/?retryWrites=true&w=majority
```

## Step 7: Test the Connection

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

You should see:
```
⏳ Connecting to MongoDB...
✅ Connected to MongoDB successfully!
📦 Database: slot-booking
...
🚀 Server is running on port 3001
```

## Troubleshooting

### Connection Refused Error
- Verify your username and password are correct
- Check that your IP address is whitelisted in Network Access
- Ensure you copied the entire connection string correctly
- The password might contain special characters that need to be URL-encoded

### Authentication Failed
- Double-check your username and password
- Verify the user has read/write permissions
- Make sure there are no extra spaces in the connection string

### Timeout Error
- Check your internet connection
- Verify the cluster is running (not paused)
- Try a different region if the current one is slow

## Security Best Practices

For production:
1. Use environment-specific users with limited permissions
2. Restrict network access to specific IP addresses
3. Enable encryption at rest
4. Use MongoDB Atlas monitoring and alerts
5. Rotate passwords regularly
6. Enable IP Whitelisting with specific addresses only

## Free Tier Limits

MongoDB Atlas free tier (M0) includes:
- 512 MB storage
- Shared RAM and vCPU
- 100 connections
- Sufficient for development and small applications

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Options](https://docs.mongodb.com/manual/reference/connection-string/)
- [Atlas Security Best Practices](https://docs.atlas.mongodb.com/security-best-practices/)

