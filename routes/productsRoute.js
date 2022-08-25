const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const connection = require("../config/dbmysql");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const Query = `select * from products`;

    connection.query(Query, (err, results) => {
      res.json({
        results: results,
      });
    });
  } catch (error) {
    res.json({
      status: 400,
      error: error,
    });
  }
});

router.get("/:id", (req, res) => {
  try {
    const Query = `select * from products where id = ?`;

    connection.query(Query, [req.params.id],(err, results) => {
      res.json({
        results: results,
      });
    });
  } catch (error) {
    res.json({
      status: 400,
      error: error,
    });
  }
});

/*
get-gets data
post-adds data
patch-fixes or edits data(single row of data)
put-replace data
delete-name says it all
*/

// add products
router.post("/", bodyparser.json(), (req,res) => {
  try {
  const product = req.body;
const Query = `insert into products (id, title, img, catergory, description, price) values(?,?,?,?,?,?)`;
connection.query(Query, [ product.id, product.title, product.img, product.catergory, product.description, product.price],
  (err,results) =>{
    if(err) throw err;
    res.status(200).json({
      results,
      message: "Added item Successfully"
    })
  }); 
}catch (error){
  res.json({
    status: 400,
    error: error,
  });
}
});   
   
// Edit id
router.put("/:id",(req,res)=>{
  try{
  const Query = `update products set ? where id = ${reg.params.id}`;
  const {title, img, catergory, description, price} = req.body;

  const product = { 
    title,img, catergory,description, price
  }
  connection.query(Query, product,(err, results) => {
    if (err) throw err;
    res.status(200).json({
        results,
        message : "Updated item Successfully"
    })
})
} catch (error) {
  res.json({
    status: 400,
    error: error,
  });
}
});

// delete
router.delete("/:id", (req, res) => {
  try {
      const Query =`delete from products where id = ${req.params.id}`
  
      connection.query(Query, (err, results) => {
        if (err) throw err;
        res.status(200).json({
          results,
          message : "Item Deleted"
        })
      })
  } catch (error) {
    res.json({
      status: 400,
      error: error,
    });
  }                              
  });

module.exports = router;
