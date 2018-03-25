import * as React from 'react'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo'
import Config from './config'
import Search from './screens/Search'

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    if (Config.token) {
      operation.setContext({
        headers: {Authorization: `Bearer ${Config.token}`}
      })
    }
  }
})

export default () => (
  <ApolloProvider client={client}>
    <Search />
  </ApolloProvider>
)
