const Authentication = (app, JWT) => {
    //Authentication
    app.use(["/addExercise", "/getAllExercises", "updateUser", "updateExerciseById", "/getUser", "/deleteUser"], (req,res,next) => {        
        try {
            // const Token =  req.cookies.Token;
            const Token =  req.headers.authorization;
            if (Token==null) {
                res.status(400).send("No Token Available!")
            }
            else {
                JWT.verify(Token, process.env.JWT_KEY, (err,user) => {
                    if(err) {
                        res.status(401).send("Not Authenticated!")
                    }
                    req.data = user;
                    next()
                })
            }
        } catch (error) {
            res.send(error.message);
        }
    })
}

module.exports = Authentication;