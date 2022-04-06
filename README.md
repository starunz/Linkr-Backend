<h1 >  Linkr  🔗  &nbsp  </h1><br>

 <p align="center"><a  href="https://linkr-drab.vercel.app/">deploy: linkr - vercel</a></p>


##  :link: About

Linkr is a link-sharing social network! Enjoy and share those awesome materials you find about development with very cool hashtags <3

<div align="center">

![GitHub Org's stars](https://img.shields.io/github/stars/lusntgo?style=social)

</div>


## :hammer: Features

:ballot_box_with_check: `Sign Up` - Receives username, avatar, email and password.

:ballot_box_with_check: `Login` - Receives email and password.

:ballot_box_with_check: `Search` - you can search for users or hashtags

:ballot_box_with_check: `Follow and Unfollow` - other users and see other users posts on their personal pages

:ballot_box_with_check: `Timeline` - you can publish a post and see in your timeline yours posts and posts from users you follow

:ballot_box_with_check: `Posts` - posts load progressively as the page scrolls, you can like, comment, repost, edit and delete a post.
## :woman_technologist: Technologies

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
 <img alt="expressjs" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />

</p>
<br>  

## :tada: How to run

To use this API, you will need the following tools on your machine:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Also, we recommend using a code editor such as  [VSCode](https://code.visualstudio.com/)!


### Installing the API
```bash

# Clone this repo
$ git clone https://github.com/starunz/Linkr-Backend.git

# Clone the front-end repository and follow the instructions to run
$ git clone https://github.com/starunz/Linkr.git

# change to project directory
$ cd Linkr-Backend

# install the dependencies
$ npm or yarn install 

```

### Create the database

```bash

# Access the postgres
sudo su postgres

# Start up psql 
psql

# Create the database
CREATE DATABASE linkr;

# Connect with the database
\c linkr


```


### Preparando setup
In the main API folder, create a `.env` file in the same way as the file [`.env.example`](https://github.com/starunz/Linkr-Backend/.env.example).

### Initializing the API
```bash

# Run the application in development mode
$ npm run start

# The server will start on port:PORT (chosen from the .env file) - go to <http://localhost:PORT>

```

<br/>

## :sparkles: Authors

| [<img src="https://avatars.githubusercontent.com/starunz" width=115><br><sub>Bruna Souza</sub>](https://github.com/starunz) |  [<img src="https://avatars.githubusercontent.com/luis-garbelotti" width=115><br><sub>Luis Garbelotti</sub>](https://github.com/luis-garbelotti) |  [<img src="https://avatars.githubusercontent.com/lusntgo" width=115><br><sub>Luiza Santiago</sub></sub>](https://github.com/lusntgo) |  [<img src="https://avatars.githubusercontent.com/Mateusr337" width=115><br><sub>Mateus Cruz Rossetto</sub>](https://github.com/Mateusr337) |  [<img src="https://avatars.githubusercontent.com/thalesor" width=115><br><sub>Thales de Oliveira Ruano</sub>](https://github.com/thalesor) 
| :---: | :---: | :---: | :---: | :---: |