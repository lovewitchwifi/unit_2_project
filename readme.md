To Do API: Marie Kondo

This is a To Do API called Marie Kondo, designed to organize your life. Marie Kondo will allow you to create a user account, login to your account, create to do task items, show your to do task items, update your to do task items, mark them complete, and delete any to do task items. 

Tech you should have on your computer:

git
node.js
nodemon installed globally

Depencies used:

express
mongoose
dotenv
JSON-webtoken
morgan
bcrypt

Dev depencies used:

--save-dev
supertest
jest
mongodb-memory-server
postman

How to start:

Open your terminal and run the following:
git clone git@github.com:lovewitchwifi/unit_2_project.git
npm install
touch .env

sudo npm install -g nodemon

inside your .env file add the following and insert your username and password:
MONGO_URI=mongodb+srv://<username><password>@cluster0.jqopfxd.mongodb.net/?retryWrites=true&w=majority

then go to sha256.com, enter a word you'll remember and copy your hashed secret key and insert it after the equal sign:
SECRET=your-secret-key

go back into your terminal and enter: npm run dev

This will get your application running on port 3000. 

Then you will run the 8 test cases in a second terminal. In your second terminal enter: npm run test

To ensure your server is running and to load your tests enter: npm run load

This will test your throughput. 

Now you need to test with Postman. 

open your desktop postman app 
open a new request

on the left side of the URL field is where you will select the type of request you are testing. 

click the drop down arrow to the left of the URL field and click POST
in the url field enter: http://localhost:3000/users
under the url field select the BODY tab and in the body tab enter:

{
    "name": "whatever name you want here",
    "email": "any email here",
    "password": "any password here"
}

there are two fields above the body field, the first one should be selected as "raw" and the second one should be "JSON"

hit SEND.

And now you will have created a new user and you will see the user's information below the body field. 

From the body field, look for the "token" line and copy the token that's in between the quotation marks. 

Then head to the "Auth" tab and on the left side you'll see a type dropdown field. Click the arrow and select "bearer token" type. 

in the bearer token block enter the token you copied earlier from your user response. this will allow you to authenticate your existing user so you can login, update, and delete.

Let's try another request. 