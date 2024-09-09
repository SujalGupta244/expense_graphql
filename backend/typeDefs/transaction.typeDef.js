const transactionTypeDef = `#graphql
    type Transaction{
        _id: ID!
        userId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
    }

    type CategoryStatistics {
        category: String!
        totalAmount: Float!
    }

    type Query{
        transactions: [Transaction!]
        transaction(transactionId:ID!): Transaction
        # TODO => ADD categoryStatistics query
        categoryStatistics: [CategoryStatistics!]

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
        date: String!
    }

    input UpdateTransaction{
        transactionId: ID!
        description: String
        paymentType: String
        category: String
        amount: Float
        location: String
        date: String
    }

`

export default transactionTypeDef