import { View, TextInput, StyleSheet } from 'react-native'
import React from 'react'
export default function InputBox({ placeholder, editable, value, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        {...(editable && { value: value })}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#aaa"
        editable={editable}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#888',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 16,
    color: '#fff',
  }
})