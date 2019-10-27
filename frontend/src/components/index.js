import React, { Component } from "react";
import axios from "axios";
import FormData from "form-data";

import RecordingAPI from "./recorder";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      words: [],
      audios: []
    };
  }

  componentDidMount() {
    // axios.get('http://localhost:8000/api/v1.0/words')
    //   .then(res => {
    //     this.setState({
    //       words: res.data.words,
    //       audios: [...new Array(res.data.words.length).fill(null)]
    //     });
    //   });
    this.setState({
      words: [
        {id: "bdji2379rgq0r3481", value: "happy" },
        {id: 'b09r093yrh79rgq0r', value: 'birthday'},
      ],
      audios: [...new Array(0).fill(null)]
    });
  }

  addAudio(audio, index, id) {
    const new_audio_object = {
      blob: audio,
      id: id
    };
    const { audios } = this.state;
    audios[index] = new_audio_object;
    this.setState({ audios });
  }

  submitData() {
    const { words, audios } = this.state;
    var data = [];
    for (var i = 0; i < words.length; i++) {
      data.push({
        word: words[i].value,
        file: audios[i].blob
      });
    }

    var formData = new FormData();
    var filename = new Date().toISOString();

    data.forEach((item, i) => {
      formData.append(`${filename}-${i}`, item.file);
    });

    axios({
      method: 'post',
      url: 'http://localhost:8000/api/v1.0/submit_data',
      data: formData,
      config: {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*"
        }
      }
    }).then(function (response) {
      console.log(response);
    });
  }

  render() {
    const { words, audios } = this.state;
    return (
      <div>
        <ul>
          {words.map((word, index) => (
            <li key={word.id}>
              <span>{word.value}</span>
              <RecordingAPI
                id={index}
                onDataSubmit={audio => this.addAudio(audio, index, word.id)}
              />
            </li>
          ))}
        </ul>
        <button
          onClick={this.submitData.bind(this)}
          disabled={audios.indexOf(null) > -1}
        >
          Submit
        </button>
      </div>
    );
  }
}
