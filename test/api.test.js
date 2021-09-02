const request = require('supertest');
const app = require('../src/index');
var should = require('should');
var cookie;
describe('POST /users', () => {

     it("respond with 400 when not sending data", done => {
          request(app)
               .post('/api/register')
               .set('Accept', 'application/json')
               .expect({ message: { msgBody: "Please complete all fields", msgError: true } })
               .expect(400)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     })

     it("respond with 201 when user has been created", done => {
          const data = { "username": "Testuser", "name": "test", "surname": "test", "password": "123" }
          request(app)
               .post('/api/register')
               .send(data)
               .set('Accept', 'application/json')
               .expect('Content-Type', "application/json; charset=utf-8")
               .expect(201)
               .end(err => {
                    if (err) return done(err);
                    done();
               })

     })

     it("respond with 400 when user already exists", done => {
          const data = { "username": "Testuser", "name": "test", "surname": "test", "password": "123" }
          request(app)
               .post('/api/register')
               .send(data)
               .set('Accept', 'application/json')
               .expect({ message: { msgBody: "This username is already registered", msgError: true } })
               .expect(400)
               .end(err => {
                    if (err) return done(err);
                    done();
               })

     })
});

describe('POST /login', () => {

     it("respond with 400 when not sendig data", done => {
          request(app)
               .post('/api/login')
               .set('Accept', 'application/json')
               .expect("Bad Request")
               .expect(400)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     })



     it("respond with 200 when user sendig data user", done => {
          const data = { "username": "Testuser", "password": "123" }
          request(app)
               .post('/api/login')
               .send(data)
               .set('Accept', 'application/json')
               .expect((res) => { res.body })
               .expect(200)
               .expect((res) => { 'set-cookie', res.headers['Set-Cookie'] })
               .end((err, res) => {
                    if (err) return done(err);
                    cookie = res.headers['set-cookie'];
                    done();


               })
     })
})

describe('POST /api/list', () => {

     it("respond with 200 when the user asks for the list of cryptocurrencies", done => {

          request(app)
               .post('/api/list')
               .set(cookie)
               .set({ 'Accept': 'application/json' })
               .expect((res) => { res.body })
               .expect(200)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     })


})