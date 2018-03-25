import * as React from 'react'
import {Text, View, StyleSheet} from 'react-native'
import SearchList from '../components/SearchList'
export default function Search() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Aurity Assignment</Text>
      <SearchList />
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
