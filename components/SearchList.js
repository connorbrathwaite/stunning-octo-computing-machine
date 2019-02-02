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

const isLoading = R.equals(R.always(1))

const isFetching = R.anyPass([isFetchingMore, isLoading])

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
        if (loading) {
          return (
            <View
              style={[styles.container, styles.horizontal]}
            >
              <ActivityIndicator size="large" />
            </View>
          )
        }

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

        // onRefresh = {refetch}
        return (
          <FlatList
            data={R.pathOr([], ['search', 'nodes'], data)}
            keyExtractor={R.prop('id')}
            refreshing={isFetching(networkStatus)}
            onEndReachedThreshold={0.8}
            onEndReached={() =>
              fetchMore({
                variables: {
                  cursor: R.pathOr(
                    undefined,
                    ['search', 'pageInfo', 'endCursor'],
                    data
                  )
                },
                updateQuery: (
                  previousResult,
                  {fetchMoreResult}
                ) => {
                  console.log(previousResult)
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
                {R.pathOr(
                  [],
                  ['search', 'repositoryCount'],
                  data
                )}{' '}
                repositories containing {inputQuery}
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
