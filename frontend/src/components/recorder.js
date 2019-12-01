import React from "react";

export default class RecordingAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      recordedChunks: [],
      dataUrl: ""
    };
  }

  async recordAudio() {
    const constraints = {
      audio: true,
      video: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.mediaRecorder = new MediaRecorder(stream);
    let buffer = [];
    this.mediaRecorder.ondataavailable = e => {
      //  console.log(this.state.recordedChunks, e.data);
      if (e.data.size > 0) {
        buffer.push(e.data);
        this.setState({
          recordedChunks: buffer
        });
      }
    };

    this.mediaRecorder.start(5);
    this.setState({ recording: true });
  }

  stopRecording(e) {
    this.mediaRecorder.stop();

    const blob = new Blob(this.state.recordedChunks, { type: "audio/wav" });
    var blobUrl = URL.createObjectURL(blob);
    var context = this;

    this.setState({ dataUrl: blobUrl, recording: false }, () => {
      context.props.onDataSubmit(blob);
    });
  }

  render() {
    const { recording } = this.state;
    return (
      <span className="recorder">
        {!recording && (
          <button
            className="waves-effect waves-light btn-floating deep-orange record"
            id="record"
            onClick={this.recordAudio.bind(this)}
          >
            <i className="material-icons white-text">mic</i>
          </button>
        )}
        {recording && (
          <button
            className="waves-effect waves-light btn-floating red lighten-5 stop"
            id="stop"
            onClick={this.stopRecording.bind(this)}
          >
            <i className="material-icons red-text">stop</i>Stop
          </button>
        )}
        <audio src={this.state.dataUrl} controls />
        {this.state.dataUrl !== "" && (
          <button
            className="waves-light btn-flat ml-1"
            onClick={() => {
              var context = this.props;
              this.setState({ dataUrl: "", recordedChunks: [] }, () => {
                context.onDataRemove();
              });
            }}
          >
            <i className="material-icons red-text" style={{ fontSize: "21px" }}>
              delete
            </i>
          </button>
        )}
      </span>
    );
  }
}
