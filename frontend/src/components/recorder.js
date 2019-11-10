import React from "react";

export default class RecordingAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      recordedChunks: []
    };
  }

  async recordAudio() {
    const constraints = {
      audio: true,
      video: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.setState({
      recordedChunks: []
    });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        this.setState({
          recordedChunks: [...this.state.recordedChunks, e.data]
        });
      }
    };
    //console.log("record start", this.state.recordedChunks);
    this.mediaRecorder.start(10);
    this.setState({ recording: true });
  }

  stopRecording(e) {
    this.mediaRecorder.stop();

    const blob = new Blob(this.state.recordedChunks, { type: "audio/wav" });
    const player = this.refs["player_" + this.props.id];
    var blobUrl = URL.createObjectURL(blob);
    //console.log("record stop", this.state.recordedChunks);
    player.src = blobUrl;

    this.props.onDataSubmit(blob, false);

    this.setState({ recording: false });
  }

  render() {
    const { recording } = this.state;
    return (
      <span className="recorder">
        {!recording && (
          <button
            className="waves-effect waves-light btn-floating red record"
            id="record"
            onClick={this.recordAudio.bind(this)}
          >
            <i class="material-icons white-text">mic</i>
          </button>
        )}
        {recording && (
          <button
            className="waves-effect waves-light btn-floating deep-orange lighten-5 stop"
            id="stop"
            onClick={this.stopRecording.bind(this)}
          >
            <i class="material-icons red-text">stop</i>Stop
          </button>
        )}
        <audio ref={"player_" + this.props.id} controls />
        <button
          disabled={this.state.recordedChunks.length === 0}
          onClick={() => {
            const player = this.refs["player_" + this.props.id];
            player.src = "";
            this.setState(
              {
                recordedChunks: []
              },
              () => {
                //console.log("cancel vala", this.state.recordedChunks);
                this.props.onDataSubmit(null, true);
              }
            );
          }}
        >
          Cancel
        </button>
      </span>
    );
  }
}
