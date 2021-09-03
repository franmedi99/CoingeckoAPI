const request = require('supertest');
const app = require('../src/index');
const should = require('should');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const agent = request.agent(app);

describe('POST /users', () => {

     it("respond with 400 when not sending data", done => {
          agent
               .post('/api/register')
               .set('Accept', 'application/json')
               .expect({ message: { msgBody: "Please complete all fields", msgError: true } })
               .expect(400)
               .end(err => {
                    if (err) return done(err);
                    done();
               });
     });

     it("respond with 201 when user has been created", done => {
          agent
               .post('/api/register')
               .send({ username: "Testuser", name: "test", surname: "test", password: "123" })
               .set('Accept', 'application/json')
               .expect('Content-Type', "application/json; charset=utf-8")
               .expect(201)
               .end(err => {
                    if (err) return done(err);
                    done();
               })

     });

     it("respond with 400 when user already exists", done => {
          agent
               .post('/api/register')
               .send({ username: "Testuser", name: "test", surname: "test", password: "123" })
               .set('Accept', 'application/json')
               .expect({ message: { msgBody: "This username is already registered", msgError: true } })
               .expect(400)
               .end(err => {
                    if (err) return done(err);
                    done();
               })

     });
});

describe('POST /login', () => {

     it("respond with 400 when not sendig data", done => {
          agent
               .post('/api/login')
               .set('Accept', 'application/json')
               .expect("Bad Request")
               .expect(400)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });



     it("respond with 200 when user sendig data user", done => {
          agent
               .post('/api/login')
               .send({ username: "Testuser", password: "123" })
               .set('Accept', 'application/json')
               .expect((res) => { res.body })
               .expect(200)
               .expect((res) => { 'set-cookie', res.headers['set-cookie'] })
               .end(err => {
                    if (err) return done(err);
                    done();


               })
     });
});

describe('POST /api/setcoinpref', () => {
     it("respond with 400 when not sendig a coin preference", done => {
          agent
               .post('/api/setcoinpref')
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: "Please complete field!!" })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });


     it("respond with 400 when sendig a invalid currency preference", done => {
          agent
               .post('/api/setcoinpref')
               .send({ coinpreference: "testingcoin" })
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: 'The currency preference can only be "ars","eur" or "usd"!!' })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });


     it("respond with 200 when currency preference successfully ", done => {
          agent
               .post('/api/setcoinpref')
               .send({ coinpreference: "ars" })
               .set({ 'Accept': 'application/json' })
               .expect((res) => { res.body })
               .expect(200)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });

});

describe('POST /api/list', () => {
     it("respond with 400 when not sendig page or not set currency preference", done => {
          agent
               .post('/api/list')
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: "first choose a currency preference and send a page!!" })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });


     it("respond with 200 when the user asks for the list of cryptocurrencies", done => {
          agent
               .post('/api/list')
               .send({ page: 1 })
               .set({ 'Accept': 'application/json' })
               .expect((res) => { res.body })
               .expect(200)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });
});

describe('POST /api/top', () => {
     it("respond with 400 when sendig a invalid order", done => {
          agent
               .post('/api/top')
               .send({ order: "ordertest" })
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: "the order can only be asc or desc" })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });


     it("respond with 200 when send order asc or desc", done => {
          agent
               .post('/api/top')
               .send({ order: "asc" })
               .set({ 'Accept': 'application/json' })
               .expect((res) => { res.body })
               .expect(200)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });
});

describe('POST /api/newcrypto', () => {

     it("respond with 400 when sendig a cryptocurrencyID empty", done => {
          agent
               .post('/api/newcrypto')
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: "Please send an ID Coin" })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });

     it("respond with 400 when sendig a cryptocurrencyID invalid", done => {
          agent
               .post('/api/newcrypto')
               .send({ cryptoID: "testCryptoID" })
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: "Please send a valid ID coin" })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });

     it("respond with 200 when send a cryptocurrencyID valid", done => {
          agent
               .post('/api/newcrypto')
               .send({ cryptoID: "bitcoin" })
               .set({ 'Accept': 'application/json' })
               .expect((res) => { res.body })
               .expect(200)
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });

     it("respond with 400 when send a repeated cryptocurrencyID", done => {
          agent
               .post('/api/newcrypto')
               .send({ cryptoID: "bitcoin" })
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: 'This coin is already at its top' })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });
});

describe('GET /api/deleteoftop/:id_coin', () => {
     let validID;
     it("respond with 400 when sendig a invalid coinID", done => {
          agent
               .get('/api/deleteoftop/invalidID')
               .set({ 'Accept': 'application/json' })
               .expect(400)
               .expect({ message: "Unauthorized" })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });

     it("Obtaining a valid ID to erase it in the next test", done => {
          agent
               .post('/api/top')
               .send({ order: "asc" })
               .set({ 'Accept': 'application/json' })
               .expect((res) => { res.body })
               .expect(200)
               .end((err, res) => {
                    if (err) return done(err);
                    validID = res.body[0].id_coin
                    done();
               })
     });

     it("respond with 200 when send a valid coinID", done => {
          agent
               .get('/api/deleteoftop/' + validID)
               .set({ 'Accept': 'application/json' })
               .expect((res) => { res.body })
               .expect(200)
               .expect({ message: "cryptocurrency successfully deleted" })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });
});



describe('POST /api/deleteaccount', () => {

     it("respond with 200 when Account successfully deleted", done => {
          agent
               .post('/api/deleteaccount')
               .set({ 'Accept': 'application/json' })
               .expect(200)
               .expect({ message: { msgBody: "Account successfully deleted", msgError: false } })
               .end(err => {
                    if (err) return done(err);
                    done();
               })
     });


});