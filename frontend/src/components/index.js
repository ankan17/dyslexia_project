import React, { Component } from "react";
import axios from "axios";
import Materialize from 'materialize-css';
import moment from "moment";
import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize.min.js";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "male",
      student_id: null
    }
  }

  componentDidMount() {
    // Initialize the datepicker
    var context = this;
    var elems = document.querySelectorAll(".datepicker");
    Materialize.Datepicker.init(elems, {
      defaultDate: new Date(),
      yearRange: 20,
      format: "mm-dd-yyyy",
      onSelect: function(date) {
        context.setState({ date_of_birth: moment(date).format("MM-DD-YYYY") });
      },
      autoClose: true
    });
  }

  submitData(e) {
    e.preventDefault();
    var valid = true;
    var firstNameElem = document.getElementById('first_name');
    var lastNameElem = document.getElementById('last_name');
    var dobElem = document.getElementById('dob');

    // Validation
    if (!this.state.first_name) {
      firstNameElem.classList.add('invalid');
      valid = false;
    } else {
      firstNameElem.classList.remove('invalid');
    }
    if (!this.state.last_name) {
      lastNameElem.classList.add('invalid');
      valid = false;
    } else {
      lastNameElem.classList.remove('invalid');
    }
    if (!this.state.date_of_birth) {
      dobElem.classList.add('invalid');
      valid = false;
    } else {
      dobElem.classList.remove('invalid');
    }

    if (valid)  {
      var data = {...this.state};
      var context = this;
      axios({
        method: 'post',
        url: 'http://localhost:8000/api/v1.0/register',
        data: data,
        config: {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
          }
        }
      }).then(function(response) {
        context.setState({student_id: response.data.id});
      });
    }
  }

  render() {
    if (!this.state.student_id) {
      return (
        <div className="container-outer valign-wrapper">
          <div className="container home-container">
            <div className="row">
              <form className="offset-s2 col s8">
                <div className="row">
                  <div className="input-field col s6">
                    <input
                      placeholder="First Name" id="first_name"
                      type="text" value={this.state.first_name}
                      onChange={(e) => this.setState({first_name: e.target.value})}
                      className="validate" />
                    <label htmlFor="first_name">First Name</label>
                    <span className="helper-text" data-error="Please fill this field"></span>
                  </div>
                  <div className="input-field col s6">
                    <input
                      placeholder="Last Name" id="last_name"
                      type="text" value={this.state.last_name}
                      onChange={(e) => this.setState({last_name: e.target.value})}
                      className="validate" required="" aria-required="true" />
                    <label htmlFor="last_name">Last Name</label>
                    <span className="helper-text" data-error="Please fill this field"></span>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s12">
                    <input
                      type="text" id="dob" className="datepicker validate"
                      value={this.state.date_of_birth}
                      onChange={(e) => this.setState({date_of_birth: e.target.value})}
                      required="" aria-required="true"
                    />
                    <label htmlFor="dob">Date of birth</label>
                    <span className="helper-text" data-error="Please fill this field"></span>
                  </div>
                </div>

                <div className="row">
                  <div className="input-field col s3">
                    <label>
                        <input
                          type="radio" className="with-gap"
                          name="gender" value="male"
                          checked={this.state.gender === "male"}
                          onChange={(e) => this.setState({gender: e.target.value})}/>
                        <span>Male</span>
                    </label>
                  </div>
                  <div className="input-field col s3">
                    <label>
                        <input
                          type="radio" className="with-gap"
                          name="gender" value="female"
                          checked={this.state.gender === "female"}
                          onChange={(e) => this.setState({gender: e.target.value})}
                        />
                        <span>Female</span>
                    </label>
                  </div>
                </div>

                <div className="row center-align">
                  <div className="col s12">
                    <button
                      type="submit"
                      className="btn mt-3"
                      onClick={this.submitData.bind(this)}>Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      var id = this.state.student_id.slice(0, 8);
      return (
        <div class="container-outer valign-wrapper">
          <div class="container center-align">
            <div class="row">
              <span className="check_icon">
                <i className="material-icons">check</i>
              </span>
              <h5 class="mt-2">Please note down your unique id: <span className="test_id">{ id }</span></h5>
              <h6 class="mt-1" style={{color: '#333'}}>Click
                <a className="test_link" href={`http://localhost:3000/test/${id}`}>here</a>
                 to head over to the test right now
              </h6>
            </div>
          </div>
        </div>
      );
    }
  }
}
