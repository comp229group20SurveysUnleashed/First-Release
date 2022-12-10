import { UserDisplayName } from "../utils/index.js";
import UserSchema from '../models/user.js';
import { UserId } from '../utils/index.js';


export function DisplayProfilePage(req, res, next){
    let id = req.params.id;
    res.render('index', { title: 'Profile', page: 'profile', displayName: UserDisplayName(req),
});
}

export  function ProcessProfileChangePage(req, res, next){
    let id = UserId(req).toString();

  
    let newProfile = UserSchema({
       _id: id,
        emailAddress: req.body.email,
        username: req.body.username,
        displayName: req.body.first_name + " " + req.body.last_name
 
    });
  
console.log(req.body.username + " username");
    UserSchema.updateOne({_id: id }, newProfile, (err, User) => {
        if(err){
            console.error(err);
            res.end(err);
        };

        res.redirect('/profile')
    } )

}