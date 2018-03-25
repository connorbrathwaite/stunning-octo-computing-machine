import * as React from 'react'
import {withStateHandlers} from 'recompose'
import {View, StyleSheet, Switch} from 'react-native'
import {Text, SearchBar} from 'react-native-elements'
import SearchList from '../components/SearchList'

function Search({
  inputQuery,
  setInputQuery,
  clearInputQuery
}) {
  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>Aurity Assignment</Text>
      <SearchBar
        lightTheme
        onClear={clearInputQuery}
        onEndEditing={setInputQuery}
        placeholder="Search for repositories by keyword here"
      />
      <SearchList inputQuery={inputQuery} />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    margin: 16
  },
  container: {
    flex: 1,
    paddingTop: 64, // Constants.statusBarHeight,
    backgroundColor: '#eee'
  }
})

const initialState = {inputQuery: ''}

const stateHandlers = {
  setInputQuery: state => e => ({inputQuery: e.nativeEvent.text}),
  clearInputQuery: state => () => initialState
}

export default withStateHandlers(
  initialState,
  stateHandlers
)(Search)
