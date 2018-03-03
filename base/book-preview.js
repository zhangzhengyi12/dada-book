import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'

export default function BookPreview(props) {
  return (
    <TouchableOpacity onPress={props.onSelect}>
      <View style={styles.book}>
        <Image
          source={{
            uri: props.book.icon
          }}
          style={styles.icon}
        />
        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.bookTitle}>
            {props.book.name}
          </Text>
          <Text numberOfLines={3} style={styles.desc}>
            {props.book.desc}
          </Text>
          <Text numberOfLines={1}>
            <Text style={styles.geryTitle}>作者: </Text>
            <Text>{props.book.author}</Text>
          </Text>
          <Text numberOfLines={1}>
            <Text style={styles.geryTitle}>类型: </Text>
            <Text>{props.book.category}</Text>
          </Text>
          <Text numberOfLines={1}>
            <Text style={styles.geryTitle}>更新时间: </Text>
            <Text>{props.book.uptime}</Text>
          </Text>
          <Text numberOfLines={1}>
            <Text style={styles.geryTitle}>最新章节: </Text>
            <Text>{props.book.lastChapterName}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  book: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    paddingLeft: 10,
    marginTop: 10
  },
  icon: {
    width: 110,
    height: 150
  },
  content: {
    flex: 3,
    paddingLeft: 10,
    paddingRight: 5
  },
  geryTitle: {
    color: '#ccc'
  },
  desc: {
    marginTop: 4,
    marginBottom: 4
  },
  bookTitle: {
    fontSize: 16
  }
})
