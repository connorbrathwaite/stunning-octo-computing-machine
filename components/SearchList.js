import * as React from 'react'
import * as R from 'ramda'
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
export default function SearchList({inputQuery}) {
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
        if (loading)
          return (
            <View
              style={[styles.container, styles.horizontal]}
            >
              <ActivityIndicator size="large" />
            </View>
          )

        if (error) {
          console.log(error)
          data = require('./mock').default.data
          // return null // TODO <Error {...error} />
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
            onEndReachedThreshold={0.5}
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
