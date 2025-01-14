import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/user.query";

const Cards = () => {
	
	const {loading, error, data} = useQuery(GET_TRANSACTIONS)
	const { data: authUser} = useQuery(GET_AUTHENTICATED_USER)
	const { loading:load,data: userAndTransactions } = useQuery(GET_USER_AND_TRANSACTIONS,{
		variables:{
			userId: authUser?.authUser._id
		}
	})
	if(loading || error) return null;

	if(!load) console.log("data; ",userAndTransactions)
	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>History</p>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
				{/* <Card cardType={"saving"} />
				<Card cardType={"expense"} />
				<Card cardType={"investment"} />
				<Card cardType={"investment"} />
				<Card cardType={"saving"} />
				<Card cardType={"expense"} /> */}
				{!loading && data?.transactions.map(transaction =>(
					<Card key={transaction._id} transaction={transaction} authUser={authUser?.authUser}/>
				))}
			</div>
			{!loading && data?.transactions.length === 0 && (
				<p className="text-2xl font-bold text-center w-full">No Transaction history found.</p>
			)}
		</div>
	);
};
export default Cards;