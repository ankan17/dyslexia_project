import React from 'react';

export default class RecordingAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false
    };
  }

  async recordAudio() {
    const constraints = {
      audio: true,
      video: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    this.mediaRecorder.start(10);
    this.setState({ recording: true });
  }

  stopRecording(e) {
    this.mediaRecorder.stop();

    const blob = new Blob(this.recordedChunks, {'type' : 'audio/wav'});

    const player = this.refs['player_' + this.props.id];
    player.src = URL.createObjectURL(blob);

    this.props.onDataSubmit(blob);

    this.setState({ recording: false });
  }

  render() {
    const {recording} = this.state;
    return (
      <div>
        <audio ref={"player_" + this.props.id} controls></audio>
        {!recording && <button id="record" onClick={this.recordAudio.bind(this)}>Record</button>}
        {recording && <button id="stop" onClick={this.stopRecording.bind(this)}>Stop</button>}
      </div>
    );
  }
}
