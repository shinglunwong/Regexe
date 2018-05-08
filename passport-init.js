// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('./bcrypt');


// module.exports = (app) => {
//     app.use(passport.initialize());
//     app.use(passport.session());

//     passport.use('local-signup', new LocalStrategy(
//         async (email, password, done) => {
//             try{
//                 let users = await knex('user_profile').where({email:email});
//                 if (users.length > 0) {
//                     return done(null, false, { message: 'Email already taken' });
//                 }
//                 let hash = await bcrypt.hashPassword(password)
//                 const newUser = {
//                     email:email,
//                     password: hash
//                 };
//                 let userId = await knex('user_profile').insert(newUser).returning('id');
//                 done(null,newUser);
//             }catch(err){
//                 done(err);
//             }
    
//         })
//     );
//     // passport.use('local-signup', new LocalStrategy(
//     //     (email, password, weight, height, gender, age, done) => {
//     //         knex('user_profile').where({ email: email }).select('email').then(function(array){
//     //             if (array) {
//     //                 return done(null, false, { message: 'Email already taken' });
//     //             } else {
//     //                 bcrypt.hashPassword(password)
//     //                     .then(hash => {
//     //                         const newUser = {
//     //                             email: email,
//     //                             password: hash,
//     //                             weight: weight,
//     //                             height: height,
//     //                             gender: gender,
//     //                             age: age
//     //                         };
//     //                         console.log(email, password, weight, height, gender, age)
//     //                         knex('user_profile').insert({newUser});
//     //                         done(null, newUser);
//     //                     })
//     //                     .catch(err => console.log(err));
//     //             }
//     //         });
//     //     }
//     // ));

    

//     passport.use('local-login', new LocalStrategy(
//         async (email, password, done) => {
//             try{
//                 let users = await knex('user_profile').where({email:email})
//                 if(users.length == 0){
//                     return done(null, false, { message: 'Incorrect credentials' });
//                 }
//                 let user = users[0];
//                 let result = await bcrypt.checkPassword(password, user.password);    
//                 if(result) {
//                     return done(null, user);
//                 } else {
//                     return done(null, false, { message: 'Incorrect credentials'});
//                 }
//             }catch(err){
//                 done(err);
//             }
//         }
//     ));

//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     passport.deserializeUser((id, done) => {
//         let user = users.find((user) => user.id == id);
//         if (user == null) {
//             done(new Error('Wrong user id.'));
//         }

//         done(null, user);
//     });
// };




const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.DB_NAME,
        user:     process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
});

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('local-login', new LocalStrategy(
        async (email, password, done) => {
            try{
                let users = await knex('user_profil').where({email:email});
                if (users.length == 0) {
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
                let user = users[0];
                if (user.password === password) {
                    return done(null, user);
                }else{
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
            }catch(err){
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        let users = await knex('user_profile').where({id:id});
        if (users.length == 0) {
            return done(new Error(`Wrong user id ${id}`));
        }
        let user = users[0];
        return done(null, user);
    });
};