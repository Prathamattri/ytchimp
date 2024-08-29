# SYM (Simple Youtube Manager)

Manage your YouTube team access without any tensions

A simple upload manager that notifies the YouTuber every time any editor wants to upload a new video to their YT channel.

---

## Using the backend with docker

If you want to contribute just to the frontend then you can run the server in a container. Follow the steps below:

- Ensure your machine has latest versions of docker and docker-compose
- Update the .env.development file with your environment variables (optional)
- Run the below command
- Ensure the PORT 3001 is free on your machine

```bash
docker-compose up
```

The server will be running on PORT 3001

- Now, since we are using prisma and we have just created a new postgres service, the database schema will not be defined in the service.

  - To create new database schema do the following:

    ```bash
    docker exec -it ytchimp_server bash
    cd /base/packages/database && npx prisma migrate dev -- init
    exit
    ```

> **NOTE:** Run the frontend on port 3005 for now, due to CORS policy in the backend set for _localhost:3005 only_
