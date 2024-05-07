const jwt = require('jsonwebtoken')
const JWT_SECRET = 'piyushisgoodboy'

const fetchuser = (req, res, next)=>{
    const token= req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.doctor = data.doctor
        next()
        
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})
    }
}

module.exports = fetchuser