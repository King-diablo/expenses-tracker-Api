# Expense Tracker API

A simple api that keeps records of your expenses

## Installation

> git clone https://github.com/King-diablo/expenses-tracker-Api.git
> 
> cd expenses-tracker-Api
>
> npm install
>
> npm start

### OR

> download the zip
>
> extract it
>
> open the folder in your code editor
>
> npm install
>
> npm start


## Environment Variables
> * PORT
> * SALT_ROUND
> * SECRET_KEY
> * DATABASE_URL

## BaseURL
```
https:localhost:3000/api/user
```

## ROUTES
> * Create (Creating a user)
```
https:localhost:3000/api/user/create

METHOD: POST
body parameter
{
  email*
  password*
}

a token is created after a successful account creation
```
> * Login (Logging in a user)
```
https:localhost:3000/api/user/login

METHOD: POST
body parameter
{
  email*
  password*
}

a token is created after you successfully login
```
> * Update (Updating a user)
```
https:localhost:3000/api/user/update

METHOD: POST
body parameter
{
  name*
  Gender*
  picture*
}

a token is required to access the route

Authorization: Bearer "token"
```
> * Delete (Deleting a user)
```
https:localhost:3000/api/user/delete

METHOD: POST
a token is required to access the route

Authorization: Bearer "token"
```
> * Credit (Creating a Credit Transaction)
```
https:localhost:3000/api/user/transaction/credit

METHOD: POST
body parameter
{
  amount*
  description*
}
a token is required to access the route

Authorization: Bearer "token"
```
> * Debit (Creating a Debit Transaction)
```
https:localhost:3000/api/user/transaction/debit

METHOD: POST
body parameter
{
  amount*
  description*
}
a token is required to access the route

Authorization: Bearer "token"
```
> * Fetch (Get All Transaction)
```
https:localhost:3000/api/user/transaction/fetch

METHOD: GET

a token is required to access the route

Authorization: Bearer "token"
```
> * Fetch/:transactionType (Get A Specific Transaction)
```
https:localhost:3000/api/user/transaction/fetch/:credit||debit

METHOD: GET

a token is required to access the route

Authorization: Bearer "token"
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)