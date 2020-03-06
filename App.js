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
import logo from "./assets/logo_small2.png";
import { BorderlessButton, Switch } from "react-native-gesture-handler";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
var jwtDecode = require("jwt-decode");

const extruder = true;
const spool = true;
const heater = true;
const micrometer = false;

class AuthButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorized: this.props.isAuthorized,
      ID: this.props.ID,
      "x-auth-token": this.props["x-auth-token"]
    };
  }

  async queryAuthorization(isAuthorized) {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/admin/changeAuth",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.state["x-auth-token"]
        },
        body: JSON.stringify({
          id: this.state.ID,
          isAuthorized: isAuthorized
        })
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      return JSON.parse(responseText);
    }
  }

  render() {
    if (this.state.isAuthorized) {
      return (
        <View style={{ margin: 10 }}>
          <Button
            title="Authorized"
            color="green"
            onPress={() => {
              this.setState({ isAuthorized: false });
              this.queryAuthorization(false);
            }}
          />
        </View>
      );
    } else {
      return (
        <View style={{ margin: 10 }}>
          <Button
            title="Un-authorized"
            color="red"
            style={{ margin: 10 }}
            onPress={() => {
              this.setState({ isAuthorized: true });
              this.queryAuthorization(true);
            }}
          />
        </View>
      );
    }
  }
}

class AuthDeleteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleted: false,
      ID: this.props.ID,
      "x-auth-token": this.props["x-auth-token"]
    };
  }

  async queryAuthorization() {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/admin/deleteUser",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.state["x-auth-token"]
        },
        body: JSON.stringify({
          id: this.state.ID
        })
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      return JSON.parse(responseText);
    }
  }

  render() {
    if (this.state.isDeleted) {
      return (
        <View style={{ margin: 10 }}>
          <Button title="Deleted" color="red" disabled={true} />
        </View>
      );
    } else {
      return (
        <View style={{ margin: 10 }}>
          <Button
            title="Delete"
            color="red"
            onPress={() => {
              this.queryAuthorization();
              this.setState({ isDeleted: true });
            }}
          />
        </View>
      );
    }
  }
}

class ExtruderButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "x-auth-token": this.props["x-auth-token"],
      speed: this.props.speed,
      stop: this.props.stop,
      direction: this.props.direction
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState({ stop: this.props.stop }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  async run_extruder(direction) {
    let response = await fetch("http://tower.bnilab.com:3010/api/extruder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": this.state["x-auth-token"]
      },
      body: JSON.stringify({
        stop: false,
        speed: this.props.speed,
        direction: direction
      })
    });

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      this.setState({ stop: false });
      alert("running");
      return;
    }
  }

  async stop_extruder() {
    let response = await fetch("http://tower.bnilab.com:3010/api/extruder", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": this.state["x-auth-token"]
      },
      body: JSON.stringify({
        stop: true,
        speed: this.props.speed,
        direction: this.props.direction
      })
    });

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      this.setState({ stop: true });
      alert("stopped");
      return;
    }
  }

  render() {
    if (this.state.stop) {
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="arrow-up"
              backgroundColor="#3b5998"
              onPress={() => {
                clearInterval(this.timerID);
                this.setState({ direction: "+" });
                this.run_extruder("+");
              }}
            >
              Extruder UP
            </FontAwesome.Button>
          </View>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="arrow-down"
              backgroundColor="#3b5998"
              onPress={() => {
                clearInterval(this.timerID);
                this.setState({ direction: "-" });
                this.run_extruder("-");
              }}
            >
              Extruder DOWN
            </FontAwesome.Button>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="anchor"
              backgroundColor="#f57b51"
              onPress={() => {
                clearInterval(this.timerID);
                this.stop_extruder();
              }}
            >
              <Text style={styles.buttonText}>Stop Extruder</Text>
              <ActivityIndicator size="small" color="#00ff00" />
              <Text style={styles.buttonText}>{this.props.speed}RPM</Text>
            </FontAwesome.Button>
          </View>

          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="arrow-down"
              backgroundColor="#3b5998"
              onPress={() => {
                clearInterval(this.timerID);
                this.run_extruder(this.state.direction);
              }}
            >
              <Text style={styles.buttonText}>change Extruder</Text>
            </FontAwesome.Button>
          </View>
        </View>
      );
    }
  }
}

class SpoolButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "x-auth-token": this.props["x-auth-token"],
      RPM: this.props.speed,
      stop: this.props.stop,
      DIR: this.props.direction
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState({ stop: this.props.stop }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  async run_spool() {
    let response = await fetch("http://tower.bnilab.com:3010/api/fiber", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": this.props["x-auth-token"]
      },
      body: JSON.stringify({
        stop: false,
        speed: this.props.speed,
        direction: this.props.direction
      })
    });

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      this.setState({ stop: false });
      alert("running");
      return;
    }
  }

  async stop_spool() {
    let response = await fetch("http://tower.bnilab.com:3010/api/fiber", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": this.state["x-auth-token"]
      },
      body: JSON.stringify({
        stop: true,
        speed: 200,
        direction: "-"
      })
    });

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      this.setState({ stop: true });
      alert("stopped");
      return;
    }
  }

  render() {
    if (this.state.stop) {
      return (
        <View style={styles.iconbutton}>
          <FontAwesome.Button
            name="arrow-down"
            backgroundColor="#3b5998"
            onPress={() => {
              clearInterval(this.timerID);
              this.run_spool();
            }}
          >
            Run Spool
          </FontAwesome.Button>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="anchor"
              backgroundColor="#f57b51"
              onPress={() => {
                clearInterval(this.timerID);
                this.stop_spool();
              }}
            >
              <Text style={styles.buttonText}>Stop Spool</Text>
              <ActivityIndicator size="small" color="#00ff00" />
              <Text style={styles.buttonText}>{this.props.speed} RPM</Text>
            </FontAwesome.Button>
          </View>

          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="arrow-down"
              backgroundColor="#3b5998"
              onPress={() => {
                clearInterval(this.timerID);
                this.run_spool();
              }}
            >
              <Text style={styles.buttonText}>change spool</Text>
            </FontAwesome.Button>
          </View>
        </View>
      );
    }
  }
}

class HeaterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "x-auth-token": this.props["x-auth-token"],
      temperature: this.props.temperature,
      running: this.props.running
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState({ stop: this.props.stop }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  async run_heater(temp) {
    let response = await fetch("http://tower.bnilab.com:3010/api/temperature", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": this.props["x-auth-token"]
      },
      body: JSON.stringify({
        temp: temp
      })
    });

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else if (temp !== 0) {
      this.setState({ running: true });
      alert("running");
      return;
    } else {
      this.setState({ running: false });
      alert("stopped");
      return;
    }
  }

  render() {
    if (!this.state.running) {
      return (
        <View style={styles.iconbutton}>
          <FontAwesome.Button
            name="fire"
            backgroundColor="#3b5998"
            onPress={() => {
              clearInterval(this.timerID);
              this.run_heater(this.props.temperature);
            }}
          >
            Run Heater
          </FontAwesome.Button>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="fire-extinguisher"
              backgroundColor="#f57b51"
              onPress={() => {
                clearInterval(this.timerID);
                this.run_heater(0);
              }}
            >
              <Text style={styles.buttonText}>Stop Heater</Text>
              <ActivityIndicator size="small" color="#00ff00" />
              <Text style={styles.buttonText}>{this.props.temperature} C</Text>
            </FontAwesome.Button>
          </View>

          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="fire"
              backgroundColor="#3b5998"
              onPress={() => {
                clearInterval(this.timerID);
                this.run_heater(this.props.temperature);
              }}
            >
              <Text style={styles.buttonText}>change Heater</Text>
            </FontAwesome.Button>
          </View>
        </View>
      );
    }
  }
}

class PIDSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "x-auth-token": this.props["x-auth-token"],
      open: false
    };
  }

  render() {
    if (!this.state.open) {
      return (
        <View>
          <FontAwesome.Button
            name="gear"
            backgroundColor="#3b5998"
            onPress={() => {
              this.setState({ open: true });
            }}
          >
            PID setting
          </FontAwesome.Button>
        </View>
      );
    } else {
      return (
        <View style={styles.UserList}>
          <FontAwesome.Button
            name="save"
            backgroundColor="#3b5998"
            onPress={() => {
              this.setState({ open: false });
            }}
          >
            Save
          </FontAwesome.Button>
          <TextInput
            style={styles.textInput}
            placeholder="P"
            onChangeText={P => this.props.setState({ P: parseFloat(P) })}
            keyboardType="number-pad"
          ></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="I"
            onChangeText={I => this.props.setState({ I: parseFloat(I) })}
            keyboardType="number-pad"
          ></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="D"
            onChangeText={D => this.props.setState({ D: parseFloat(D) })}
            keyboardType="number-pad"
          ></TextInput>
        </View>
      );
    }
  }
}

class PIDButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "x-auth-token": this.props["x-auth-token"],
      running: this.props.running,
      diameter: this.props.diameter,
      P: this.props.P,
      I: this.props.I,
      D: this.props.D
    };
  }

  async SetController() {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/micrometer/pidSetting",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.props["x-auth-token"]
        },
        body: JSON.stringify({
          P: this.state.P,
          I: this.state.I,
          D: this.state.D,
          diameter: this.state.diameter
        })
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;

    // if error, return
    if (responseStatus != 200) {
      alert(responseText);
      return;
    }
  }

  async RunController() {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/micrometer/pidOn",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.props["x-auth-token"]
        }
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;

    // if error, return
    if (responseStatus != 200) {
      alert(responseText);
      return;
    }

    this.setState({ running: true });
  }

  async StopController() {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/micrometer/pidOff",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.props["x-auth-token"]
        }
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;

    // if error, return
    if (responseStatus != 200) {
      alert(responseText);
      return;
    }

    this.setState({ running: false });
  }

  render() {
    if (!this.state.running) {
      return (
        <View style={styles.iconbutton}>
          <FontAwesome.Button
            name="thumbs-up"
            backgroundColor="#3b5998"
            onPress={() => this.RunController()}
          >
            <Text style={styles.buttonText}>Run Extruder&Spool</Text>
          </FontAwesome.Button>
        </View>
      );
    } else {
      return (
        <View style={styles.iconbutton}>
          <FontAwesome.Button
            name="stop"
            backgroundColor="#f57b51"
            onPress={() => this.StopController()}
          >
            <Text style={styles.buttonText}>Stop</Text>
            <ActivityIndicator size="small" color="#00ff00" />
          </FontAwesome.Button>
        </View>
      );
    }
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: "",
      PW: "",
      ID_signUp: "",
      PW_signUp: "",
      showCTRL: false,
      isAdmin: false,
      showToolBox: false,
      showUM: false,
      showSignUp: false,
      "x-auth-token": "",
      extruderRPM: 0,
      extruderStop: true,
      extruderDIR: "-",
      spoolRPM: 0,
      spoolStop: true,
      temperature: 0,
      heaterRunning: false,
      userInfo: [],
      isPID: false,
      PIDrunning: false,
      diameter: 0,
      P: 0.25,
      I: 0.1,
      D: 0.1
    };
    this.myTextInput = React.createRef();
  }

  // Initialize the application
  async checkExtruder() {
    let response_extruder = await fetch(
      "http://tower.bnilab.com:3010/api/extruder",
      {
        method: "GET",
        "Access-Control-Allow-Origin": true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.state["x-auth-token"]
        }
      }
    );

    let responseText = await response_extruder.text();
    let responseJson = JSON.parse(responseText);
    let responseStatus = await response_extruder.status;

    if (responseStatus != 200) {
      alert("Extruder is currently unavailable! please refer to the manager");
      return;
    }

    this.setState({
      extruderStop: !responseJson.onStatus,
      extruderRPM: responseJson.speed
    });
  }

  async checkSpool() {
    let response_spool = await fetch("http://tower.bnilab.com:3010/api/fiber", {
      method: "GET",
      "Access-Control-Allow-Origin": true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": this.state["x-auth-token"]
      }
    });

    let responseText = await response_spool.text();
    let responseJson = JSON.parse(responseText);
    let responseStatus = await response_spool.status;

    if (responseStatus != 200) {
      alert("Spool is currently unavailable! please refer to the manager");
      return;
    }

    this.setState({
      spoolStop: !responseJson.onStatus,
      spoolRPM: responseJson.speed
    });
  }

  async checkHeater() {
    let response_heater = await fetch(
      "http://tower.bnilab.com:3010/api/temperature",
      {
        method: "GET",
        "Access-Control-Allow-Origin": true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.state["x-auth-token"]
        }
      }
    );

    let responseStatus = await response_heater.status;

    if (responseStatus != 200) {
      alert("Heater is currently unavailable! please refer to the manager");
      return;
    }
  }

  async checkMicrometer() {
    let response_micrometer = await fetch(
      "http://tower.bnilab.com:3010/api/micrometer",
      {
        method: "GET",
        "Access-Control-Allow-Origin": true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.state["x-auth-token"]
        }
      }
    );

    let responseStatus = await response_micrometer.status;

    if (responseStatus != 200) {
      alert("micrometer is currently unavailable! please refer to the manager");
      return;
    }
  }

  async serverCheck(extruder, spool, heater, micrometer) {
    if (extruder) this.checkExtruder();
    if (spool) this.checkSpool();
    if (heater) this.checkHeater();
    if (micrometer) this.checkMicrometer();
  }

  // initialize ends

  // query functions
  async logOut() {
    this.setState({
      showCTRL: false,
      "x-auth-token": "",
      ID: "",
      PW: "",
      isAdmin: false
    });
  }

  async fetchLogIn() {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/users/signIn",
      {
        method: "POST",
        "Access-Control-Allow-Origin": true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: this.state.ID,
          pw: this.state.PW
        })
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;
    let jwt;

    this.setState({ "x-auth-token": responseText });

    // decode jwt
    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      jwt = jwtDecode(responseText);
    }

    // jwt classification
    if (!jwt.isAuthorized) {
      alert(
        "You are not authorized. Please get authorization from admin for use."
      );
      return;
    } else if (!jwt.isAdmin) {
      this.setState({ showCTRL: true });
      this.serverCheck(extruder, spool, heater, micrometer);
      return;
    } else if (jwt.isAdmin) {
      this.setState({ showToolBox: true, isAdmin: true });
      this.serverCheck(extruder, spool, heater, micrometer);
      return;
    }
  }

  async fetchSignUp() {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/users/signUp",
      {
        method: "POST",
        "Access-Control-Allow-Origin": true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: this.state.ID_signUp,
          pw: this.state.PW_signUp
        })
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      alert("SignUp complete");
      this.setState({ showSignUp: false });
      return;
    }
  }

  async queryEveryUser() {
    let response = await fetch(
      "http://tower.bnilab.com:3010/api/admin/findEveryUser",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": this.state["x-auth-token"]
        }
      }
    );

    let responseText = await response.text();
    let responseStatus = await response.status;

    if (responseStatus != 200) {
      alert(responseText);
      return;
    } else {
      this.setState({
        showToolBox: false,
        showUM: true,
        userInfo: JSON.parse(responseText)
      });
      return JSON.parse(responseText);
    }
  }

  // showing panel
  showControlPanel() {
    if (this.state.isAdmin) {
      return (
        <View style={styles.container}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="home"
              backgroundColor="#3b5998"
              onPress={() =>
                this.setState({ showUM: false, showToolBox: true })
              }
            >
              Home
            </FontAwesome.Button>
          </View>
          {this.controlPanel()}
        </View>
      );
    } else {
      return this.controlPanel();
    }
  }

  controlPanel() {
    if (!this.state.isPID) {
      return (
        <View style={styles.container}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="sign-out"
              backgroundColor="#d63447"
              onPress={() => {
                this.logOut();
              }}
            >
              Log out
            </FontAwesome.Button>
          </View>
          <Text>Open Loop Control</Text>
          <Switch
            value={this.state.isPID}
            onValueChange={v => this.setState({ isPID: v })}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Extruder Speed"
            onChangeText={RPM => this.setState({ extruderRPM: parseInt(RPM) })}
            keyboardType="number-pad"
            clearTextOnFocus={true}
          ></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Spool Speed"
            onChangeText={RPM => this.setState({ spoolRPM: parseInt(RPM) })}
            keyboardType="number-pad"
            clearTextOnFocus={true}
          ></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Temperature"
            onChangeText={temperature =>
              this.setState({ temperature: temperature })
            }
            keyboardType="number-pad"
            clearTextOnFocus={true}
          ></TextInput>
          <ExtruderButton
            x-auth-token={this.state["x-auth-token"]}
            speed={this.state.extruderRPM}
            stop={this.state.extruderStop}
            direction={this.state.extruderDIR}
          ></ExtruderButton>
          <SpoolButton
            x-auth-token={this.state["x-auth-token"]}
            speed={this.state.spoolRPM}
            stop={this.state.spoolStop}
            direction="+"
          ></SpoolButton>
          <HeaterButton
            x-auth-token={this.state["x-auth-token"]}
            temperature={this.state.temperature}
            running={this.state.heaterRunning}
          ></HeaterButton>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="sign-out"
              backgroundColor="#d63447"
              onPress={() => {
                this.logOut();
              }}
            >
              Log out
            </FontAwesome.Button>
          </View>
          <Text>Closed Loop Control</Text>
          <Switch
            value={this.state.isPID}
            onValueChange={v => this.setState({ isPID: v })}
          />
          <PIDSetting
            x-auth-token={this.state["x-auth-token"]}
            setState={p => {
              this.setState(p);
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              placeholder="Temperature"
              onChangeText={temperature =>
                this.setState({ temperature: temperature })
              }
              keyboardType="number-pad"
            ></TextInput>
            <HeaterButton
              x-auth-token={this.state["x-auth-token"]}
              temperature={this.state.temperature}
              running={this.state.heaterRunning}
            ></HeaterButton>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              style={styles.textInput}
              placeholder="Diameter"
              onChangeText={diameter =>
                this.setState({ diameter: parseInt(diameter) })
              }
              keyboardType="number-pad"
            ></TextInput>
            <PIDButton
              x-auth-token={this.state["x-auth-token"]}
              running={this.state.PIDrunning}
              diameter={this.state.diameter}
              P={this.state.P}
              I={this.state.I}
              D={this.state.D}
            ></PIDButton>
          </View>
        </View>
      );
    }
  }

  showUserList() {
    if (this.state.userInfo.length === 1) return <Text>No User</Text>;

    let items = [];

    for (const [index, value] of this.state.userInfo.entries()) {
      if (value.isAdmin) continue;
      items.push(
        <View key={index} style={styles.UserElement}>
          <Text style={styles.UserInfo}>
            <Text style={{ color: "#381460", fontWeight: "bold", margin: 10 }}>
              ID
            </Text>
            {value.ID}
          </Text>
          <Text style={styles.UserInfo}>
            <Text style={{ color: "#B21F66", fontWeight: "bold", margin: 10 }}>
              Sign-Up date
            </Text>{" "}
            {new Date(value.date).toLocaleDateString(undefined)}
          </Text>
          <AuthButton
            isAuthorized={value.isAuthorized}
            ID={value.ID}
            x-auth-token={this.state["x-auth-token"]}
          />
          <AuthDeleteButton
            ID={value.ID}
            x-auth-token={this.state["x-auth-token"]}
          />
        </View>
      );
    }

    return <ScrollView style={styles.UserList}>{items}</ScrollView>;
  }

  render() {
    //sign up form comes up
    if (this.state.showSignUp) {
      return (
        <View style={styles.container}>
          <View style={styles.containerLine}>
            <Text style={styles.instruction}>Sign Up</Text>
            <TextInput
              style={styles.textInput}
              placeholder="ID"
              onChangeText={ID_signUp =>
                this.setState({ ID_signUp: ID_signUp })
              }
              clearTextOnFocus="true"
            ></TextInput>
            <TextInput
              style={styles.textInput}
              placeholder="PW"
              onChangeText={PW_signUp =>
                this.setState({ PW_signUp: PW_signUp })
              }
              secureTextEntry={true}
              clearTextOnFocus="true"
            ></TextInput>
            <View style={styles.iconbutton}>
              <FontAwesome.Button
                name="user-plus"
                backgroundColor="#3b5998"
                onPress={() => this.fetchSignUp()}
              >
                Sign Up
              </FontAwesome.Button>
            </View>
            <View style={styles.iconbutton}>
              <FontAwesome.Button
                name="close"
                backgroundColor="#3b5998"
                onPress={() => this.setState({ showSignUp: false })}
              >
                Close
              </FontAwesome.Button>
            </View>
          </View>
        </View>
      );
    }

    // show tower controller (normal user)
    if (this.state.showCTRL && !this.state.isAdmin) {
      return this.showControlPanel();
    }

    // show Admin tool
    if (this.state.showToolBox && this.state.isAdmin) {
      return (
        <Fragment>
          <View style={styles.container}>
            <View style={styles.iconbutton}>
              <FontAwesome.Button
                name="sign-out"
                backgroundColor="#d63447"
                onPress={() => {
                  this.logOut();
                }}
              >
                Log out
              </FontAwesome.Button>
            </View>
          </View>
          <View style={styles.container}>
            <Text>Welcome Sir!</Text>
            <Text>EGITH stands for "Even Gone, I'm The Hero"</Text>
            <Text>Just as Minho Eom, the author of this program is</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.iconbutton}>
              <FontAwesome.Button
                name="user"
                backgroundColor="#3b5998"
                onPress={() => this.queryEveryUser()}
              >
                User Management
              </FontAwesome.Button>
            </View>
            <View style={styles.iconbutton}>
              <FontAwesome.Button
                name="inbox"
                backgroundColor="#3b5998"
                onPress={() =>
                  this.setState({ showCTRL: true, showToolBox: false })
                }
              >
                Operate tower
              </FontAwesome.Button>
            </View>
          </View>
        </Fragment>
      );
    }

    // show Admin tool: user management
    if (this.state.showUM && this.state.isAdmin) {
      return (
        <View style={styles.container}>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="home"
              backgroundColor="#3b5998"
              onPress={() =>
                this.setState({ showUM: false, showToolBox: true })
              }
            >
              Home
            </FontAwesome.Button>
          </View>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="sign-out"
              backgroundColor="#d63447"
              onPress={() => {
                this.logOut();
              }}
            >
              Log out
            </FontAwesome.Button>
          </View>
          {this.showUserList()}
        </View>
      );
    }

    // show Admin tool: control panel
    if (this.state.showCTRL && this.state.isAdmin) {
      return this.showControlPanel();
    }

    // show sign In form
    return (
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} />

        <Text style={styles.instruction}>To start using a tower, sign in!</Text>

        <TextInput
          style={styles.textInput}
          placeholder="ID"
          onChangeText={ID => this.setState({ ID })}
          clearTextOnFocus={true}
        ></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={PW => this.setState({ PW })}
          secureTextEntry={true}
          clearTextOnFocus={true}
        ></TextInput>
        <View>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="sign-in"
              backgroundColor="#3b5998"
              onPress={() => this.fetchLogIn()}
            >
              Sign In
            </FontAwesome.Button>
          </View>
          <View style={styles.iconbutton}>
            <FontAwesome.Button
              name="user-plus"
              backgroundColor="#3b5998"
              onPress={() => this.setState({ showSignUp: true })}
            >
              Sign Up
            </FontAwesome.Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  containerLine: {
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 3,
    margin: 20,
    padding: 20
  },
  UserList: {
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 3,
    margin: 20,
    padding: 20
  },
  UserElement: {
    borderWidth: 1,
    borderStyle: "dotted",
    borderRadius: 3,
    padding: 10,
    margin: 20
  },
  UserInfo: {
    margin: 10,
    padding: 10
  },
  logo: {
    width: 200,
    height: 51,
    marginBottom: 200
  },
  instruction: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15
  },
  button: {
    backgroundColor: "blue",
    marginTop: 20,
    padding: 20,
    borderRadius: 5,
    marginRight: 5
  },
  buttonCaution: {
    backgroundColor: "red",
    marginTop: 20,
    padding: 20,
    borderRadius: 5,
    marginRight: 5
  },
  button_logout: {
    backgroundColor: "red",
    margin: 20,
    padding: 5,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  iconbutton: {
    margin: 10
  },
  textInput: {
    margin: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
    width: 200
  }
});
