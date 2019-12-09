import React, { Component } from "react";
import axios from "axios";

import { server_address } from '../constants';

export default class Subjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: []
    };
  }
  componentDidMount() {
    axios.get(`${server_address}/api/v1.0/subjects`)
      .then((response) => {
        this.setState({
          subjects: response.data.subjects
        });
    })
  }
  render() {
    const { subjects } = this.state;
    return (
      <div className="container">
        <table className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>English</th>
              <th>Bengali</th>
            </tr>
          </thead>
          <tbody>
          {subjects.map((subject) => {
            return [
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>
                  {subject.eng_test_status ? (
                    <span className="green-text">Completed</span>
                  ) : (
                    <a href={`test/eng/${subject.id.slice(0, 8)}`}>
                      {`${subject.id.slice(0, 8)}`}
                    </a>
                  )}
                </td>
                <td>
                  {subject.ben_test_status ? (
                    <span className="green-text">Completed</span>
                  ) : (
                    <a href={`test/ben/${subject.id.slice(0, 8)}`}>
                      {`${subject.id.slice(0, 8)}`}
                    </a>
                  )}
                </td>
              </tr>
            ];
          })}
          </tbody>
        </table>
      </div>
    )
  }
}
