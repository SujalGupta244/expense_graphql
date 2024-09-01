const transactionTypeDef = `#graphql
    type Transaction{
        _id: ID!
        userId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        data: String!
    }

    type Query{
        transactions: [Transaction!]
        transaction(transactionId:ID!): Transaction
    }

    type Mutation{
        createTransaction(input: CreateTransaction!): Transaction!
        updateTransaction(input: UpdateTransaction!): Transaction!
        deleteTransaction(transactionId:ID!): Transaction!
    }

    input CreateTransaction{
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        data: String!
    }

    input UpdateTransaction{
        transactionId: ID!
        description: String
        paymentType: String
        category: String
        amount: Float
        location: String
        data: String
    }

`

export default transactionTypeDef