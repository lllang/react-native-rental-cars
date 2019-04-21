import React from 'react';
import { View, Platform, DatePickerIOS, DatePickerAndroid, TimePickerAndroid } from 'react-native';

const Submit = 1, Cancel = 0;

class DatePicker extends React.Component {

  state = {
    date: new Date(this.props.date),
  };

  static defaultProps = {
    mode: 'datetime'
  };

  onDateChange(value) {
    this.setState({
      date: new Date(value),
    });
    this.props.onDateChange && this.props.onDateChange(value);
  }

  render() {
    return (
      <DatePickerIOS {...this.props}
        date={ this.state.date }
        mode={ this.props.mode }
        onDateChange={ this.onDateChange.bind(this) } />
    )
  }
}

export default {
  open: (options) => new Promise((resolve, reject) => {
    const state = store.getState();
    const currentRouteName = state.routing.routes[state.routing.index].name;
    let date = options.default || new Date();
    let mode = options.mode || 'date';
    // ios
    if (Platform.OS === 'ios'){
      store.dispatch({
        type: 'dialog/show',
        payload: {
          options: {
            dialogContent: (
              <View style={ { flex: 1, width: '100%' } }>
                <DatePicker minuteInterval={10} date={ date } mode={ mode } onDateChange={ value => date = value } />
              </View>
            ),
            routeName: currentRouteName,
            actions: [
              {
                label: '取消',
                action: () => {
                  store.dispatch({ type: 'dialog/hide'});
                  resolve({ action: Cancel });
                }
              }, {
                label: '确定',
                action: () => {
                  let year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate(),
                    hour = date.getHours(),
                    minute = date.getMinutes();
                  store.dispatch({ type: 'dialog/hide'});
                  resolve({
                    action: Submit,
                    year, month, day, hour, minute,
                    timeStamp: new Date(year, month, day, hour, minute).getTime(),
                  });
                }
              }
            ]
          }
        }
      })
    }
    // Android
    if (Platform.OS === 'android') {
      let dateResult = {} , timeResult = {};

      const returnData = (action) => {
        const { year, month, day } = dateResult;
        const { hour = 0, minute = 0 } = timeResult;
        const timeStamp = new Date(year, month, day, hour, minute).getTime();
        resolve({ action, ...dateResult, ...timeResult, timeStamp });
      }

      const dateCallback = (datePickerResult) => {
        if (datePickerResult.action ===  DatePickerAndroid.dismissedAction) {
          returnData(Cancel);
          return;
        }
        delete datePickerResult.action;
        dateResult = datePickerResult;
        if (mode === 'date') {
          returnData(Submit);
          return;
        } else if (mode === 'datetime') {
          promise.then(timeCallback);
          return TimePickerAndroid.open({ mode: 'spinner' });
        }
      }

      const timeCallback = (timePickerResult) => {
        if (timePickerResult.action === TimePickerAndroid.dismissedAction) {
          returnData(Cancel);
          return;
        }
        delete timePickerResult.action;
        timeResult = timePickerResult;
        returnData(Submit);
      }

      let promise = DatePickerAndroid.open({
        date: options.default,
      }).then(dateCallback);
      
    }
  }),
  Cancel,
  Submit,
}