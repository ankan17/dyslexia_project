import React, { Component } from "react";
import axios from "axios";
import FormData from "form-data";

import RecordingAPIv2 from "./recorder2";
import { server_address } from '../constants';

export default class Testv2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      current: 0,
      audios: null,
      completed: [],
      name: "",
      error: false,
      recording: false
    };
  }

  componentDidMount() {
    const {
      match: { params }
    } = this.props;
    axios.get(`${server_address}/api/v1.0/words?lang=${params.lang}`)
      .then(res => {
        this.setState({
          words: res.data.words,
          audios: [...new Array(res.data.words.length).fill(null)]
        }, () => {
          const { words } = this.state;
          this.interval = setInterval(() => {
            if (!this.state.recording || this.state.current >= words.length - 1) return;
            this.setState((prevState) => ({current: prevState.current + 1}))
          }, 2500);
        });
      });
    axios
      .get(`${server_address}/api/v1.0/status?id=${params.id}&lang=${params.lang}`)
      .then(response => {
        this.setState({
          completed: [...response.data.completed],
          name: `${response.data.first_name}`,
          current: response.data.completed.length
        });
      })
      .catch(e => {
        // Replace this part by routing to 404 page
        this.setState({ error: e.message });
      });
  }

  componentWillUnmount() {
    return () => clearInterval(this.interval);
  }

  addAudio(audio, audioUrl, id, cancel) {
    const new_audio_object = {
      blob: audio,
      id: id,
      url: audioUrl
    };
    if (!cancel) {
      this.setState({ audios: new_audio_object, recording: false });
    }
  }

  submitData() {
    const { audios, current, completed } = this.state;
    const {
      match: { params }
    } = this.props;

    var formData = new FormData();
    formData.append(`${completed.length}_${current}.wav`, audios.blob);

    var context = this;
    axios({
      method: "post",
      url: `${server_address}/api/v2.0/submit_data?id=${params.id}&lang=${params.lang}`,
      data: formData,
      config: {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    }).then(function(response) {
      console.log(response)
      context.setState({
        completed: [...response.data.completed],
        current: response.data.completed.length
      });
    }).catch(e => {
      console.log(e);
    });
  }

  render() {
    const { words, completed, name, error, current } = this.state;
    const word = words[current];
    if (!error && word) {
      return (
        <div className="container">
          <h3 className="center-align">Welcome, {name}</h3>
          <div className="pt-2 progress-bar right-align">
            <div className="progress ">
              <div
                className="determinate"
                style={{ width: `${(completed.length / words.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-label">
              {current+1}/{words.length}
            </span>
          </div>

          <div className="mt-2">
            <div id={word.id} className="row recorder">
              <h1
                className="recorder-word center-align"
                style={{ fontSize: "128px", "marginBottom": "2em" }}
              >
                {word.value}
              </h1>

              <div className="row center-align">
                {!completed.includes(word.id) ? (
                  <RecordingAPIv2
                    id={current}
                    onRecordAudio={() => this.setState({ recording: true })}
                    onDataSubmit={(audio, audioUrl) => this.addAudio(audio, audioUrl, word.id)}
                    onDataRemove={() => this.setState({ audios: [] })}
                  /> ) : (
                  <span className="green-text" style={{ fontSize: "26px" }}>
                    Completed
                  </span> )
                }
              </div>
            </div>

            <div className="row center-align mt-3">
              <button
                className="btn red"
                type="submit"
                onClick={this.submitData.bind(this)}
              >End test
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      // This part will also be removed
      return error;
    }
  }
}
