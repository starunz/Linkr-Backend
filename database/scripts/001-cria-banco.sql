CREATE DATABASE "Linkr";
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "userName" TEXT UNIQUE NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL
);
CREATE TABLE "sessions" (
    "id" SERIAL PRIMARY KEY,
    "token" TEXT NOT NULL UNIQUE,
    "userId" INTEGER NOT NULL REFERENCES "users"("id")
);
CREATE TABLE "posts" (
    "id" SERIAL PRIMARY KEY,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "imageLink" TEXT,
    "titleLink" TEXT,
    "descriptionLinK" TEXT,
    "createDate" TIMESTAMP DEFAULT NOW()
);
CREATE TABLE "likes" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "postId" INTEGER NOT NULL REFERENCES "posts"("id")
    ON DELETE CASCADE
);
CREATE TABLE "hashtags" (
    "id" SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
CREATE TABLE "hashtagsposts" (
    "id" SERIAL PRIMARY KEY,
    "postId" INTEGER NOT NULL REFERENCES "posts"("id")
    ON DELETE CASCADE,
    "hashtagId" INTEGER NOT NULL REFERENCES "hashtags"("id")
    ON DELETE CASCADE
);
CREATE TABLE "follows" (
    "id" SERIAL PRIMARY KEY,
    "follower" INTEGER NOT NULL REFERENCES "users"("id"),
    "following" INTEGER NOT NULL REFERENCES "users"("id")
);
CREATE TABLE "reposts" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "userPosted" INTEGER NOT NULL REFERENCES "users"("id"),
    "postId" INTEGER NOT NULL REFERENCES "posts"("id")
    ON DELETE CASCADE,
    "createDate" TIMESTAMP DEFAULT NOW()
);
CREATE TABLE "comments" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    "postId" INTEGER NOT NULL REFERENCES "posts"("id")
    ON DELETE CASCADE,
    "text" TEXT NOT NULL
);