import * as React from 'react'
import * as R from 'ramda'
import {branch, renderNothing} from 'recompose'
import {
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native'
import {gql} from 'apollo-boost'
import {Query} from 'react-apollo'
import {ListItem} from 'react-native-elements'
import {getReposByName} from '../queries'

const isFetchingMore = R.equals(R.always(4))

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})
function SearchList({inputQuery}) {
  if (inputQuery === '') return null
  return (
    <Query
      query={getReposByName}
      variables={{name: inputQuery}}
      notifyOnNetworkStatusChange
    >
      {({
        loading,
        error,
        data,
        refetch,
        fetchMore,
        networkStatus
      }) => {
        if (loading || R.isEmpty(data))
          return (
            <View
              style={[styles.container, styles.horizontal]}
            >
              <ActivityIndicator size="large" />
            </View>
          )

        if (error) {
          return (
            <View
              style={[styles.container, styles.horizontal]}
            >
              <Text>
                Oops something went wrong, have you
                configured your access token correctly?
              </Text>
            </View>
          )
        }

        const {
          nodes,
          repositoryCount,
          pageInfo
        } = data.search

        return (
          <FlatList
            data={nodes}
            keyExtractor={R.prop('id')}
            refreshing={isFetchingMore(networkStatus)}
            onRefresh={refetch}
            onEndReachedThreshold={0.8}
            onEndReached={() =>
              fetchMore({
                variables: {
                  cursor: R.prop('endCursor', pageInfo)
                },
                updateQuery: (
                  previousResult,
                  {fetchMoreResult}
                ) => {
                  if (
                    fetchMoreResult.search.nodes.length ===
                    0
                  ) {
                    return previousResult
                  }
                  const {
                    search: {
                      __typename,
                      nodes: pNodes,
                      pageInfo: pPageInfo
                    }
                  } = previousResult

                  const {
                    search: {
                      nodes: nextNodes,
                      pageInfo: nextPageInfo,
                      repositoryCount: nextRepositoryCount
                    }
                  } = fetchMoreResult

                  console.log(previousResult)
                  return {
                    search: {
                      repositoryCount: nextRepositoryCount,
                      pageInfo: nextPageInfo,
                      __typename,
                      nodes: R.concat(pNodes, nextNodes)
                    }
                  }
                }
              })
            }
            ListEmptyComponent={
              <Text>
                No repositories found for {inputQuery} :'(
              </Text>
            }
            ListHeaderComponent={
              <Text>
                {repositoryCount} repositories containing{' '}
                {inputQuery}
              </Text>
            }
            renderItem={({item}) =>
              item ? (
                <ListItem
                  key={item.id}
                  title={item.owner.login}
                  subtitle={item.name}
                />
              ) : null
            }
          />
        )
      }}
    </Query>
  )
}

const branchPredicate = R.pipe(
  R.prop('inputQuery'),
  R.isEmpty
)
export default branch(branchPredicate, renderNothing)(
  SearchList
)
