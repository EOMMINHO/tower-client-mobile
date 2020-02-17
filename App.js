import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logo from "./assets/logo.png";

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />

      <Text style={styles.instruction}>
        To start using a tower, press log-in below!
      </Text>

      <TouchableOpacity
        onPress={() => alert("Hello, world!")}
        style={{ backgroundColor: "blue" }}
      >
        <Text style={{ fontSize: 20, color: "#fff" }}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10
  },
  instruction: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15
  }
});
