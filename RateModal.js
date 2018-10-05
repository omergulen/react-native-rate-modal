import React, { Component } from "react";
import {
  Alert,
  Modal,
  Text,
  TouchableHighlight,
  View,
  StyleSheet
} from "react-native";
import { Icon } from "react-native-elements";
import PropTypes from "prop-types";

import DataStore from "./DataStore";

RateModal.propTypes = {
  rateUsText: PropTypes.string,
  starOnPressFunctions: PropTypes.arrayOf.func,
  twoStarsOnPress: PropTypes.func,
  threeStarsOnPress: PropTypes.func,
  fourStarsOnPress: PropTypes.func,
  fiveStarsOnPress: PropTypes.func,
  showFrequency: PropTypes.number,
  firstShow: PropTypes.number,
  defaultColor: PropTypes.string,
  clickedColor: PropTypes.string,
  rejectText: PropTypes.string,
  remindText: PropTypes.string,
  checkRateState: PropTypes.func,
  iconType: PropTypes.string,
  iconName: PropTypes.string,
  remindTextColor: PropTypes.string,
  rejectTextColor: PropTypes.string
};

// Default values for props
RateModal.defaultProps = {
  starOnPressFunctions: [
    () => {
      Alert.alert(1);
    },
    () => {
      Alert.alert(2);
    },
    () => {
      Alert.alert(3);
    },
    () => {
      Alert.alert(4);
    },
    () => {
      Alert.alert(5);
    }
  ],
  showFrequency: 5,
  firstShow: 2,
  defaultColor: "#AAA",
  clickedColor: "#DAA520",
  rateUsText: "Rate us!",
  rejectText: "NO!",
  remindText: "LATER!",
  iconType: "star",
  iconName: "font-awesome",
  remindTextColor: "#27ae60",
  rejectTextColor: "#d35400"
};

export default class RateModal extends Component {
  state = {
    modalVisible: false,
    activeStar: 0,
    rateCounter: 1
  };

  componentDidMount() {
    DataStore.initRate();
    this.props.checkRateState = this.checkRateState;
  }

  checkRateState() {
    DataStore.getRated().then(res => {
      if (
        res != false &&
        (this.state.rateCounter == this.props.firstShow ||
          this.state.rateCounter % this.props.showFrequency == 0)
      ) {
        this.setState({ modalVisible: true });
      }
    });
  }

  decideColor(starId) {
    if (starId <= this.state.activeStar) {
      return this.props.clickedColor;
    } else {
      return this.props.defaultColor;
    }
  }

  doActionOnStarPressed(starId) {
    this.setState({ activeStar: starId });
    setTimeout(() => {
      this.setState({ modalVisible: false });
      this.props.starOnPressFunctions[starId - 1];
    }, 300);
  }

  starPressed(count) {
    DataStore.setRated();
      this.setState({ activeStar: count });
      setTimeout(() => {
          this.setState({ modalVisible: false });
          this.props.twoStarsOnPress;
      }, 300);
  }

  render() {

    const starButtons = Array(1,2,3,4,5).map((e,i)=>{
      return (
          <TouchableHighlight
              onPress={() => {
                  this.starPressed(e);
              }}
              underlayColor="white"
          >
              <Icon
                  name={this.props.iconName}
                  type={this.props.iconType}
                  color={this.decideColor(e)}
                  size={50}
              />
          </TouchableHighlight>
      )
    });

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={styles.modal}>
          <Text style={styles.modalText}>{this.props.rateUsText}</Text>
          <View style={styles.buttons}>
              {starButtons}
          </View>
          <View style={styles.subButtons}>
            <TouchableHighlight
              onPress={() => {
                this.setState({ modalVisible: false });
              }}
              underlayColor="white"
            >
              <Text style={styles.subTextRemind}>{this.props.remindText}</Text>
            </TouchableHighlight>

            <TouchableHighlight
              onPress={() => {
                this.setState({ modalVisible: false });
                DataStore.setRated();
              }}
              underlayColor="white"
            >
              <Text style={styles.subTextReject}>{this.props.rejectText}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    height: "60%",
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: "20%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10%"
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "7%"
  },
  modalText: {
    marginLeft: "10%",
    marginRight: "10%",
    textAlign: "center",
    fontSize: 16
  },
  subButtons: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10%"
  },
  subTextRemind: {
    color: this.props.remindTextColor,
    width: "60%",
    textAlign: "center",
    fontSize: 16
  },
  subTextReject: {
    color: this.props.rejectTextColor,
    width: "60%",
    textAlign: "center",
    fontSize: 16,
    marginTop: "4%"
  }
});
