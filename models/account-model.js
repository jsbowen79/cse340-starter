const { check } = require("express-validator");
const pool = require("../database/index"); 
const bcrypt = require("bcryptjs"); 

/******************************
 * Register New Account
 ***************************** */

async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/**********************************************************************
 * Check for existing email
 ******************************************************************* */
async function checkExistingEmail(account_email) {
    try {
        const sql = "SELECT * FROM account where account_email = $1"
        const result = await pool.query(sql, [account_email])

        return result.rowCount
    } catch (error) {
        return error.message
    }
}

/*************************************************************************
 * Return account data using email address
 *********************************************************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email =$1',
            [account_email])
            return result.rows[0]
    } catch (error) {
        return new Error("no matching email found")
    }
}

/*************************************************************************
 * REturn account data using account_id
 *********************************************************************** */
async function getAccountById(account_id) {
    console.log("In account by id")
    console.log("Account Id: ", account_id); 
    try {
        const result = await pool.query(
            'SELECT * FROM account WHERE account_id =$1',
            [account_id])
        console.log("Result: ", result);
        console.log("Result.rows[0]", result.rows[0])
        console.log(result.rows); 
        return result.rows[0]
    } catch (error) {
        return new Error ("No matching account_id found")
        }
}

/*****************************************************************************
 * Update Password
 ************************************************************************** */

async function updatePassword(account_id, hashedPassword) {
    try {
        const result = await pool.query('UPDATE account SET account_password = $2 WHERE account_id = $1 RETURNING *',
            [account_id, hashedPassword])
        if (result) { return true; }
        else return false; 

    } catch (error) {
        new Error("Database Error")
        return false; 
    }
}

/*****************************************************************************
 * Update Password
 ************************************************************************** */

async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
    try {
        const result = await pool.query('UPDATE account SET account_firstname = $2, account_lastname = $3, account_email = $4 WHERE account_id = $1 RETURNING *',
            [account_id, account_firstname, account_lastname, account_email])
        if (result) { return true; }
        else return false; 

    } catch (error) {
        new Error("Database Error")
        return false; 
    }
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updatePassword, updateAccount }