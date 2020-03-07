import "react-native-gesture-handler";
import React, { Component, Fragment } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  TouchableOpacityBase
} from "react-native";
import { Line, defaults } from "react-chartjs-2";
import { Dimensions } from "react-native";

defaults.global.animation = false;

class MicrometerChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July"
      ],
      datasets: [
        {
          label: "Fiber Diameter",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 5,
          data: [
            200,
            201,
            202,
            201,
            200,
            200,
            202,
            200,
            201,
            202,
            201,
            200,
            200,
            202
          ]
        }
      ]
    };
  }

  askData() {
    return Math.floor(Math.random() * 3 + 200);
  }

  getData() {
    var oldDataset = this.state.datasets[0];
    var newData = oldDataset.data.slice();

    newData.shift();
    newData.push(this.askData());

    var newDataSet = oldDataset;
    newDataSet.data = newData;

    this.setState({ datasets: [newDataSet] });
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.getData(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div>
        <Line
          data={this.state}
          width={Dimensions.get("window").width / 2}
          height={Dimensions.get("window").height / 2}
        />
      </div>
    );
  }
}

export { MicrometerChart };
