import { gql } from "@apollo/client";


export const CREATE_TRANSACTION = gql`
    mutation CreateTransaction($input : CreateTransaction!){
        createTransaction(input: $input){
            _id
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`


export const UPDATE_TRANSACTION = gql`
    mutation UpdateTransaction($input : UpdateTransaction!){
        updateTransaction(input: $input){
            _id
            description
            paymentType
            category
            amount
            location
        }
    }
`

export const DELETE_TRANSACTION = gql`
    mutation DeleteTransaction($transactionId: ID!){
        deleteTransaction(transactionId: $transactionId){
            _id
        }
    }
`


