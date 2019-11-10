import React, { Component } from "react";
import axios from "axios";
import FormData from "form-data";

import RecordingAPI from "./recorder";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
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
    axios.get("http://localhost:8000/api/v1.0/words").then(res => {
      this.setState({
        words: res.data.words,
        audios: [...new Array(res.data.words.length).fill(null)]
      });
    });
    axios
      .get(`http://localhost:8000/api/v1.0/status?id=${params.id}`)
      .then(response => {
        this.setState({
          completed: [...response.data.completed],
          name: `${response.data.first_name}`
        })
      })
      .catch(e => {
        // Replace this part by routing to 404 page
        this.setState({ error: e.message });
      })
  }

  addAudio(audio, index, id, cancel) {
    const new_audio_object = {
      blob: audio,
      id: id
    };
    const { audios } = this.state;
    if (!cancel) audios[index] = new_audio_object;
    else audios[index] = null;
    this.setState({ audios });
    console.log("audio vaala array", audios);
  }

  removeAudio(index) {
    const { audios } = this.state;
    audios[index] = null;
    this.setState({ audios });
  }

  submitData() {
    const { words, audios } = this.state;
    const { match: { params } } = this.props;
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

    axios({
      method: "post",
      url: `http://localhost:8000/api/v1.0/submit_data?id=${params.id}`,
      data: formData,
      config: {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    }).then(function(response) {
      console.log(response);
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
    const { words, audios, completed, name, error } = this.state;
    if (!error) {
      return (
        <div className="container">
          <h3 className="center-align">Welcome, { name }</h3>
          <div className="pt-2 progress-bar right-align">
            <div className="progress ">
              <div
                className="determinate"
                style={{width: `${completed.length/words.length*100}%`}}>
              </div>
            </div>
            <span className="progress-label">{completed.length}/{words.length}</span>
          </div>

          <div className="mt-2">
            { words.map((word, index) => {
              return completed.includes(word.id) ?
                <div key={ word.id } id={ word.id } className="row recorder">
                 <span className="recorder-word col s2 offset-s2" style={{ "fontSize": '18px' }}>
                    { `${index+1}. ${word.value}` }
                 </span>
                 <span className="green-text" style={{ "fontSize": '16px' }}>Completed</span>
                </div> :
                <div key={ word.id } id={ word.id } className="row">
                  <span className="recorder-word col s2 offset-s2" style={{ "fontSize": '18px' }}>
                    { `${index+1}. ${word.value}` }
                  </span>
                  <RecordingAPI
                    id={index}
                    onDataSubmit={ audio => this.addAudio(audio, index, word.id) }
                    onDataRemove={ () => this.removeAudio(index) }
                  />
                </div>
              }
            )}
          </div>
          <div className="row center-align mt-2">
            <button
              className="btn"
              type="submit"
              onClick={this.submitData.bind(this)}
              disabled={audios.filter(x => x === null).length >= 4}
            >
              Submit
            </button>
          </div>
        </div>
      );
    } else {  // This part will also be removed
      return <div>{ error }</div>
    }
  }
}
