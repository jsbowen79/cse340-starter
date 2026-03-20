const { Pool } = require("pg")

const testController = {}

//controller that intentionally throws an error
testController.trigger = async (req, res, next) => {
    try {
        //intentionally access wrong database url
        const pool = new Pool ({
            connectionString: "postgresql://wrongUser:wrongPassword@localhost:1234/nonexistent_database"
        })
        const result = await pool.query("SELECT * FROM fakeTable")
        res.send(result.rows)
    } catch (err) {
        err.status = 500; 
        next(err)
    }
}

module.exports = testController