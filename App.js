import * as React from 'react'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import Search from './screens/Search'

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
    request: operation => {
    const token = 'c1ffefdfe6a7115d48897686a79ef9b09c25a0f0' // TOFIX
    if (token) {
      operation.setContext({
        headers: {Authorization: `Bearer ${token}`}
      })
    }
  }
})

export default () => (
  <ApolloProvider client={client}>
    <Search />
  </ApolloProvider>
)
