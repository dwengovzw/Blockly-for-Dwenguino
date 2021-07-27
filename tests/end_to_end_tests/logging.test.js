import {afterEach, beforeEach, expect, jest, test} from '@jest/globals'
import express from 'express'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { app } from "../../backend/server"
import http from 'http';

const httpServer = http.createServer(app);

beforeEach((done) => {
    httpServer.listen(12030, () => {
        console.log("Running HTTP server on port ");
    });
    done();
});

afterEach((done) => {
    httpServer.close();
    done();
});

test('Test if request for new sessionId has a result.', async () => {
    await supertest(httpServer).get('/logging/newSessionId')
        .expect(200)
        .then((response) => {
            console.log("Request result: -----------------------> " + JSON.stringify(response));
            expect(response.text).toBeDefined();
        });
});




