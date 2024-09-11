import Transaction from "../models/transaction.model.js"
import User from "../models/user.model.js"
const transactionResolver = {
    Query:{
        transactions: async(_,__,context) =>{
            try {
                if(!context.getUser()) throw new Error("Unauthorized")
                const userId = await context.getUser()._id
                const transactions = await Transaction.find({userId})
                return transactions

            } catch (error) {
                console.error("Error getting transactions: ", err)
                throw new Error("Error getting transactions")
            }
        },

        transaction: async(_, {transactionId}) =>{
            try {
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (error) {
                console.error("Error getting transaction: ", err)
                throw new Error("Error getting transaction")
            }
        },
        // TODO => ADD categoryStatistics query
        categoryStatistics: async (_,__, context) =>{
            if(!context.getUser()) throw new Error("Unauthorized")
            const userId = await context.getUser()._id
            const transactions = await Transaction.find({userId})
            const categoryMap = {};

            transactions.forEach((transaction) =>{
                if(!categoryMap[transaction.category]){
                    categoryMap[transaction.category] = 0;
                }
                categoryMap[transaction.category] += transaction.amount;

            })

            return Object.entries(categoryMap).map(([category, amount]) => ({category, totalAmount: amount}))
        }
    },
    Mutation: {
        createTransaction: async(_,{input},context) =>{
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                })

                await newTransaction.save();
                return newTransaction;
            } catch (error) {
                console.error("Error creating transaction: ", error)
                throw new Error("Error creating transaction")
            }
        },
        updateTransaction: async(_,{input}) =>{
            try {
                const updateTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true})

                return updateTransaction

            } catch (error) {
                console.error("Error updating transaction: ", error)
                throw new Error("Error updating transaction")
            }
        },
        deleteTransaction: async(_,{transactionId}) =>{
            try {
                const deleteTransaction = await Transaction.findByIdAndDelete(transactionId)

                return deleteTransaction

            } catch (error) {
                console.error("Error deleting transaction: ", error)
                throw new Error("Error deleting transaction")
            }
        },
    },
    Transaction: {
        user: async (parent) =>{
            const userId = parent.userId;
            try {
                const user = await User.findById(userId)
                return user;
            } catch (error) {
                console.error("Error in user resolver: ", error)
                throw new Error(error.message || "Internal server error")
            }
        }
    }
}

export default transactionResolver