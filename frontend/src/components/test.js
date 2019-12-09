import React, { Component } from "react";
import axios from "axios";
import FormData from "form-data";

import RecordingAPI from "./recorder";
import { server_address } from '../constants';

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      current: 0,
      audios: [],
      completed: [],
      name: "",
      error: false
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

  addAudio(audio, audioUrl, index, id, cancel) {
    const new_audio_object = {
      blob: audio,
      id: id,
      url: audioUrl
    };
    const { audios, audioUrls } = this.state;
    if (!cancel) {
      audios[index] = new_audio_object;
    }
    else {
      audios[index] = null;
    }
    this.setState({ audios, audioUrls });
  }

  removeAudio(index) {
    const { audios } = this.state;
    audios[index] = null;
    this.setState({ audios });
  }

  submitData() {
    const { words, audios } = this.state;
    const {
      match: { params }
    } = this.props;
    var data = [];
    for (var i = 0; i < words.length; i++) {
      if (audios[i]) {
        data.push({
          id: words[i].id,
          word: words[i].value,
          file: audios[i].blob
        });
      }
    }

    var formData = new FormData();

    data.forEach((item, i) => {
      formData.append(`${item.id}_${item.word}.wav`, item.file);
    });

    var context = this;
    axios({
      method: "post",
      url: `${server_address}/api/v1.0/submit_data?id=${params.id}&lang=${params.lang}`,
      data: formData,
      config: {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    }).then(function(response) {
      context.setState({
        completed: [...response.data.completed],
      });
    });
  }

  audiosIsNull() {
    for (var j = 0; j < this.state.audios.length; j++) {
      if (this.state.audios[j] != null) return false;
    }
    return true;
  }

  deleteAudio(x, num) {
    const { audios } = this.state;
    audios[num] = x;
    this.setState({ audios });
  }

  render() {
    const { words, audios, completed, name, error, current } = this.state;
    const word = words[current];
    const audio = audios[current];
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
                style={{ fontSize: "128px", "marginBottom": "1.5em" }}
              >
                {word.value}
              </h1>
              <div className="row center-align">
                {!
                  completed.includes(word.id) ?
                  audio !== null ? (
                    <RecordingAPI
                      id={current} blob={audio.blob} blobUrl={audio.url}
                      onDataSubmit={(audio, audioUrl) => this.addAudio(audio, audioUrl, current, word.id)}
                      onDataRemove={() => this.removeAudio(current)}
                    /> ) : (
                    <RecordingAPI
                      id={current} blob={null} blobUrl=""
                      onDataSubmit={(audio, audioUrl) => this.addAudio(audio, audioUrl, current, word.id)}
                      onDataRemove={() => this.removeAudio(current)}
                    /> )
                   : (
                  <span className="green-text" style={{ fontSize: "26px" }}>
                    Completed
                  </span> )
                }
              </div>
            </div>

            <div className="row"
              style={{"marginTop": "60px"}}
            >
              <button
                className="waves-light btn-floating"
                disabled={this.state.current === 0}
                onClick={() =>
                  this.setState({ current: this.state.current - 1 })
                }
              >
                <i className="material-icons white-text">navigate_before</i>
              </button>
              <button
                className="waves-light btn-floating"
                style={{"float": "right", "clear": "both"}}
                disabled={this.state.current >= words.length-1}
                onClick={() =>
                  this.setState({ current: this.state.current + 1 })
                }
              >
                <i className="material-icons white-text">navigate_next</i>
              </button>
            </div>

            <div className="row center-align mt-2">
              {completed.length < words.length &&
               audios.filter(x => x === null).length - completed.length === 0 ? (
                <button
                  className="btn"
                  type="submit"
                  onClick={this.submitData.bind(this)}
                >
                  Submit
                </button> ) :
                null
              }
              {audios.filter(x => x === null).length - completed.length >= 1 ? (
                <button
                  className="btn red"
                  type="submit"
                  onClick={this.submitData.bind(this)}
                >
                  End test
                </button> ) :
                null
              }
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
