import * as React from 'react'
import {
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native'
import {Query} from 'react-apollo'
import {gql} from 'apollo-boost'
import * as R from 'ramda'

const isFetchingMore = R.equals(R.always(4))

export const getRepoByOwnerAndName = gql`
  query {
    repository(owner: "facebook", name: "react") {
      id
      nameWithOwner
      homepageUrl
      watchers(first: 5) {
        edges {
          node {
            id
            avatarUrl
            name
          }
        }
      }
    }
  }
`
export default function SearchList() {
  return (
    <Query
      query={getRepoByOwnerAndName}
      fetchPolicy="cache-first"
    >
      {({
        loading,
        error,
        data,
        refetch,
        fetchMore,
        networkStatus
      }) => {
        if (loading) return null
        if (error) {
          console.error(error)
          return null // TODO <Error {...error} />
        }

        return <Text>{JSON.stringify(data)}</Text>
      }}
    </Query>
  )
}
