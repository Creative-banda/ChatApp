import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

export default function InputBox({ placeholder, Label, editable, value, onChangeText }) {
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
      {Label && <Text style={styles.label}>{Label}</Text>}
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
  },
  label: {
    position: 'absolute',
    maxWidth: '60%',
    textAlign: 'right',
    right: 15,
    top: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ccc',
  }
})
