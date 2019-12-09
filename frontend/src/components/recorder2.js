import React from "react";

export default class RecordingAPIv2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: false,
      stopped: true,
      recordedChunks: [],
      dataUrl: ""
    };
  }

  async startRecording() {
    const constraints = {
      audio: true,
      video: false
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.mediaRecorder = new MediaRecorder(stream);
    let buffer = [];
    this.mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        buffer.push(e.data);
        this.setState({
          recordedChunks: buffer
        });
      }
    };

    this.mediaRecorder.start(5);
    var context = this;

    this.setState({ stopped: false }, () => context.props.onRecordAudio());
  }

  async resumeRecording() {
    this.mediaRecorder.resume(5);
    var context = this;
    this.setState({ paused: false }, () => context.props.onRecordAudio());
  }

  pauseRecording(e) {
    this.mediaRecorder.pause();

    const blob = new Blob(this.state.recordedChunks, { type: "audio/wav" });
    var blobUrl = URL.createObjectURL(blob);
    var context = this;

    this.setState({ dataUrl: blobUrl, paused: true }, () => {
      context.props.onDataSubmit(blob, blobUrl);
    });
  }

  stopRecording(e) {
    this.mediaRecorder.stop();

    const blob = new Blob(this.state.recordedChunks, { type: "audio/wav" });
    var blobUrl = URL.createObjectURL(blob);
    var context = this;

    this.setState({ dataUrl: blobUrl, stopped: true, paused: false }, () => {
      context.props.onDataSubmit(blob, blobUrl);
    });
  }

  render() {
    const { paused, stopped, dataUrl } = this.state;
    return (
      <span className="recorder">
        {paused || stopped ? (
          <button
            className="waves-light btn-floating green"
            onClick={() => stopped ? this.startRecording() : this.resumeRecording()}
          >
            <i className="material-icons">play_arrow</i>
          </button> ) : null
        }
        {!paused && !stopped ? (
          <button
            className="waves-light btn-floating deep-orange"
            onClick={() => this.pauseRecording()}
          >
            <i className="material-icons">pause</i>
          </button> ) : null
        }
        <button
          className="waves-light btn-floating red"
          disabled={stopped}
          onClick={() => this.stopRecording()}
        >
          <i className="material-icons">stop</i>
        </button>
        <audio src={dataUrl} controls />
        {dataUrl !== "" && (
          <button
            className="waves-light btn-flat ml-1"
            onClick={() => {
              var context = this.props;
              this.setState({ dataUrl: "", recordedChunks: [], stopped: true, paused: false }, () => {
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
