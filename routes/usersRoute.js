const express = require("express");
const { hash, compare } = require("bcrypt");
const router = express.Router();
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const con = require("../config/dbcon");


// user login
router.patch("/", bodyparser.json(), (req, res) => {
  try {
    const { email, password } = req.body;
    const strQry = `select * from users where email = '${email}'`;

    con.query(strQry, async (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        res.json({
          msg: "Email not found",
        });
      } else {
        const isMatch = await compare(password, results[0].password);
        if (isMatch === true) {
          const payload = {
           user : results[0]
            // user: {
            //   id: results[0].id,
            //   username: results[0].username,
            //   email: results[0].email,
            //   usertype: results[0].usertype,
            }
            jwt.sign(
                payload,
                process.env.jwtSecret,
                {
                    expiresIn: "365d",
            },
            (err, token) => {
                if (err) throw err;
                res.json({
                    msg: "Login Successful",
                    user: payload.user,
                    token: token,
                });
                // res.json(payload.user);
            }
            );
        // };
          
        } else {
          res.json({
            msg: "Password Incorrect",
          });
        }
      }
    });
  } catch (error) {
    res.status;
  }
});


// get all users
router.get("/", (req, res) => {
  try {
    const strQry = `select * from users`;

    con.query(strQry, (err, results) => {
      if (err) throw err;
      res.status(200).json({
        results: results,
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// get one user
router.get("/:id", (req, res) => {
  try {
    const strQry = `select * from users where id = ${req.params.id}`;
    con.query(strQry, (err, results) => {
      if (err) throw err;
      res.status(200).json({
        results: results,
        msg: "One from users selected",
      });
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

// add user
router.post("/", bodyparser.json(), async (req, res) => {
  try {
    const user = req.body;
    // if (user.usertype === "" || user.usertype === null) {
    //   user.usertype = "user";
    // }
    let emailCheck = `select * from users where email = '${user.email}';`;
    con.query(emailCheck, async (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        res.json({
          msg: "Email address already taken",
        });
      } else {
        // adding to table(database)
        const strQry = `insert into users (fname, email, password) VALUES(?, ?, ?);`;
        user.password = await hash(user.password, 5);
        con.query(
          strQry,
          [user.fname, user.email, user.password],
          async (err, results) => {
            if (err) throw err;
            res.json({
              results: results,
              msg: "Registration successful",
            });
          }
        );
      }
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
});

// update user 
router.put("/:id", (req, res)=>{
    try {
        const strQry = `update users set ? where id = ${req.params.id}`;
        const  {fname, email, profile} = req.body

        const user = {
            fname, profile
        }
        con.query(strQry, user, (err, results) => {
            if (err) throw err;

            res.json({
                msg : "Updated Successfully"
            })
        })
    } catch (error) {
        res.send(400).json({
            error
        })
    }
})

// delete users 
router.delete("/:id", (req, res) => {
    try {
        const strQry = `delete from users where id = ${req.params.id}`
        
        con.query(strQry, (err, results) => {
            if (err) throw err;
            res.json({
                msg : "User deleted successfully"
            }) 
        })
    } catch (error) {
        res.status(400).json({
            error
        })
    }
})
module.exports = router;