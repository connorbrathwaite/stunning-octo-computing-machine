import * as React from 'react'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import Search from './screens/Search'

const client = new ApolloClient({
	uri: 'https://api.github.com/graphql'
})

export default () => (
	<ApolloProvider client={client}>
		<Search />
	</ApolloProvider>
)
