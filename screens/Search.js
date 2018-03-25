import * as React from 'react'
import {withStateHandlers} from 'recompose'
import {Text, View, StyleSheet} from 'react-native'
import {SearchBar} from 'react-native-elements'
import SearchList from '../components/SearchList'

function Search({
  inputQuery,
  setInputQuery,
  clearInputQuery
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aurity Assignment</Text>
      <SearchBar
        lightTheme
        onChangeText={setInputQuery}
        onClear={clearInputQuery}
        placeholder="Type Here..."
      />
      <SearchList inputQuery={inputQuery} />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    margin: 20
  },
  container: {
    flex: 1,
    paddingTop: 64, // Constants.statusBarHeight,
    backgroundColor: '#eee'
  }
})

const initialState = {inputQuery: ''}

const stateHandlers = {
  setInputQuery: state => inputQuery => ({inputQuery}),
  clearInputQuery: state => () => initialState
}

export default withStateHandlers(
  initialState,
  stateHandlers
)(Search)
