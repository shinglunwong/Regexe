const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('./bcrypt');

module.exports = (app, knex) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('local-signup', new LocalStrategy(
        {
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try{
                let users = await knex('user').where({email:email});
                if (users.length > 0) {
                    return done(null, false, { message: 'Email already taken' });
                }
                let hash = await bcrypt.hashPassword(password)
                const newUser = {
                    email: email,
                    password: hash,
                    weight: req.body.weight,
                    height: req.body.height,
                    gender: req.body.gender,
                    age: req.body.age
                };
                await knex('user').insert(newUser);
                let keepuser = [email,req.body.weight,req.body.gender,req.body.height,req.body.age];
                done(null, keepuser);
            }catch(err){
                done(err);
            }
    
        })
    );

    passport.use('local-login', new LocalStrategy(
        async (email, password, done) => {
            try{
                let users = await knex('user').where({email:email})
                if(users.length == 0){
                    return done(null, false, { message: 'Incorrect credentials' });
                }
                let user = users[0];
                let result = await bcrypt.checkPassword(password, user.password);    
                if(result) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect credentials'});
                }
            }catch(err){
                done(err);
            }
        }
    ));

passport.serializeUser((keepuser, done) => {
    done(null, keepuser);
});

passport.deserializeUser(async (id, done) => {
    let users = await knex('user').where({id:id});
    if (users.length == 0) {
        return done(new Error(`Wrong user id ${id}`));
    }
    let user = users[0];
    return done(null, user);
});
};


