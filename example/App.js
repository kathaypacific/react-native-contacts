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
  TextInput,
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
      curr: 0,
      iterations: 20,
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

  handleInput = input => {
    this.setState({ iterations: parseInt(input) });
  };

  startBench = async () => {
    if (this.state.benchStatus === "running") {
      return;
    }
    this.setState({ benchStatus: "running" });
    await this.bench(this.loadAll, this.state.iterations, "all");
    await this.bench(this.loadMinimal, this.state.iterations, "minimal");
    this.setState({ benchStatus: "finished" });
  };

  arrData = arr => {
    const avg = arr.reduce((a, b) => a + b) / arr.length;
    // standard deviation
    const sd = Math.sqrt(
      arr.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / arr.length
    );

    return {
      avg: avg.toFixed(2),
      sd: sd.toFixed(2),
      max: Math.max(...arr).toFixed(2),
      min: Math.min(...arr).toFixed(2)
    };
  };

  formatArrData = (label, data) => {
    if (!data) {
      return null;
    }

    return (
      <Text>
        {`${label} (mean ± σ): ${data.avg} ms ± ${data.sd} ms\
        \n${label} Range (min … max): ${data.min} ms … ${data.max} ms`}
      </Text>
    );
  };

  bench = async (f, iters, key) => {
    let results = [];

    for (let i = 0; i < iters; i++) {
      const start = new Date();

      await f();

      const end = new Date();

      this.setState({ curr: i + 1 });

      results.push(end - start);
    }

    this.setState({ [key]: this.arrData(results) });
  };

  loadMinimal = () => {
    return new Promise((resolve, reject) => {
      const start = new Date();
      Contacts.getMinimal((err, contacts) => {
        if (err) {
          console.warn("Permission to access contacts was denied");
          this.setState({ err });
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
        if (err) {
          console.warn("Permission to access contacts was denied");
          this.setState({ err });
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
        <TextInput
          keyboardType="numeric"
          onChangeText={this.handleInput}
          defaultValue="20"
          placeholder="iterations"
          style={{ borderColor: "gray", borderWidth: 1 }}
        />
        <ScrollView style={{ flex: 1 }}>
          <Text>{`bench status: ${this.state.benchStatus}`}</Text>
          <Text>{`iteration: ${this.state.curr} / ${
            this.state.iterations
          }`}</Text>
          <Text>{`# of contacts: ${this.state.contacts.length}`}</Text>

          {!!this.state.err && <Text>{`error: ${this.state.err}`}</Text>}
          {this.formatArrData("All", this.state.all)}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />
          {this.formatArrData("Minimal", this.state.minimal)}
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
