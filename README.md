# Assignment
1. Please start the server first.  
2. Then the client.  

## Technology chosen.
Server: **nodejs / Graphql**.  
Client: **lit-element** (part of google polymer project) which use the new HTML5 [Web Components](https://open-wc.org/) which can be re-used withing ANY other frontend framework.    


## Server

### Instructions to start server.
```bash
npm install
npm run start
```

## DataBase
I chose to use plain arrays as the datasurce for my graphQL endpoint.  
This allows you to use my app easily with no DB install / setup problems.
In a production environment I would use [prisma](https://www.prisma.io/) which is very little extra work.  



#### Optional:
Open a browser and view the graphql playground at http://localhost:4000/  
Here you can play with graphql, and create your own queries.  




## Client
### Instructions to start server.
```bash
npm install
npm run test
npm run start
```

Open a browser at http://localhost:8000/ (IN CHROME) to view the client.  
I have not tested the app in a legacy browser like IE.  

#### Images for contacts
Please use small images in your tests, I have NOT enabled the http POST for large payloads.  

### Unit tests
Please note: I have only only implimented unit tests for **ant-modal** (find the results for this at the top of the test output.  
I have NOT made unit tests for the other controls which will display as errors in the test run.  



