/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from "react-native";
import Contacts from "react-native-contacts";

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      start: 0,
      loaded: 0,
      rendered: 0,
      avgAll: 0,
      avgMin: 0,
      curr: 0,
      done: false,
      benchStatus: "idle"
    };

    this.loadMinimal.bind(this);
    this.loadAll.bind(this);
  }

  async componentWillMount() {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts."
      });
    }
  }

  componentDidUpdate = (_props, _state) => {
    if (!this.state.done) {
      this.setState({ rendered: new Date(), done: true });
    }
  };

  startBench = async () => {
    this.setState({ benchStatus: "starting" });
    await this.bench(this.loadAll, 24, "avgAll");
    await this.bench(this.loadMinimal, 24, "avgMin");
    this.setState({ benchStatus: "finished" });
  };

  bench = async (f, iters, key) => {
    let sum = 0;

    for (let i = 0; i < iters; i++) {
      const start = new Date();

      await f();

      const end = new Date();

      this.setState({ curr: i });

      sum += end - start;
    }

    this.setState({ [key]: sum / iters });
  };

  loadMinimal = () => {
    return new Promise((resolve, reject) => {
      const start = new Date();
      Contacts.getMinimal((err, contacts) => {
        if (err === "denied") {
          console.warn("Permission to access contacts was denied");
          reject();
        } else {
          const loaded = new Date();
          this.setState({ contacts, start, loaded });
          resolve();
        }
      });
    });
  };

  loadAll = () => {
    return new Promise((resolve, reject) => {
      const start = new Date();
      Contacts.getAll((err, contacts) => {
        if (err === "denied") {
          console.warn("Permission to access contacts was denied");
          reject();
        } else {
          const loaded = new Date();
          this.setState({ contacts, start, loaded });
          resolve();
        }
      });
    });
  };

  render = () => {
    return (
      <SafeAreaView style={styles.container}>
        <Button onPress={this.startBench} title="start" />
        <ScrollView style={{ flex: 1 }}>
          <Text>{`bench status: ${this.state.benchStatus}`}</Text>
          <Text>{`curr: ${this.state.curr}`}</Text>
          <Text>
            {`AllAvg: ${this.state.avgAll}\nMinAvg: ${this.state.avgMin}`}
          </Text>
          <Text>{JSON.stringify(this.state.contacts, null, "  ")}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingTop: "50%"
  },
  instructions: {
    textAlign: "left",
    color: "#333333",
    marginBottom: 5
  }
});
