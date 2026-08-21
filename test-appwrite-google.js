import { Client, Account, ID } from 'node-appwrite';
const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6a859c9e000dbd956790')
// wait, I don't need admin key, I'll use the web sdk
