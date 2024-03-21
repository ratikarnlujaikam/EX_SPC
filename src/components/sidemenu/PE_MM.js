import React, { Component } from "react";
import { server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import moment from "moment";

class PE_MM extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      xAxis: [],
      yAxis: [],
      yAxis2: [],
      //filter
      startDate: moment().add("days", -30).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"),
    };
  }

  doGetData = async () => {
    console.log(this.state.startDate);
    console.log(this.state.finishDate);
    let result = await httpClient.get(
      server.YIELD_URL +
        "/" +
        this.state.startDate +
        "&" +
        this.state.finishDate
    );
    console.log(result.data.result);
    let xAxis = [];
    let yAxis = [];
    let yAxis2 = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.Date);
      await yAxis.push(item["%Yield"]);
      await yAxis2.push(90);
    }

    this.setState({ data: result.data.result, xAxis, yAxis, yAxis2 });
  };

  componentDidMount = async () => {
    console.log(this.state.startDate);
    console.log(this.state.finishDate);
    let result = await httpClient.get(
      server.YIELD_URL +
        "/" +
        this.state.startDate +
        "&" +
        this.state.finishDate
    );
    console.log(result.data.result);
    let xAxis = [];
    let yAxis = [];
    let yAxis2 = [];

    for (let index = 0; index < result.data.result.length; index++) {
      const item = result.data.result[index];
      await xAxis.push(item.Date);
      await yAxis.push(item["%Yield"]);
      await yAxis2.push(90);
    }

    this.setState({ data: result.data.result, xAxis, yAxis, yAxis2 });
  };

  renderTableRow = () => {
    return this.state.data.map((item) => (
      <tr>
        <td>{item.Date}</td>
        <td>{item["%Yield"]}</td>
      </tr>
    ));
  };

  render() {
    return (
      <div className="content-wrapper" style={{ border: "1px solid #e6f7ff" }}>
        <div className="content" style={{ paddingTop: 80 }}>
          {/* ... rest of your code ... */}

          <div className="row">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item">
                <a href="/Home">
                  <i className="fa fa-arrow-left"></i> Home
                </a>
              </li>
            </ol>
            <div className="col-md-12">
              <div
                className="card card-primary card-outline"
                style={{
                  width: "100%",
                  height: "200%",
                  backgroundColor: "#e6f7ff",
                }}
              >
                <div className="col-sm-12">
                  <h2>PE&MM</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Traceability</h5>
                          </h3>
                        </div>
                        <div className="card-body">
                          {/* <li className="breadcrumb-item">
                        <a href="/"> </a>
                        <li className="breadcrumb-item"></li>
                      </li> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="card card-primary card-outline"
                        style={{
                          width: "95%",
                          height: "100%",
                          border: "2px solid #0073e6", // Set border color to a darker blue
                        }}
                      >
                        <div className="card-header">
                          <h3 className="card-title">
                            <h5>Monitoring</h5>
                          </h3>
                        </div>
                        <div className="card-body">
                          <li className="breadcrumb-item">
                        <a href="/percen_error">Cho-ko-tei Dashboard Monitoring</a>
                      </li>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 " style={{ paddingTop: 60 }}>
                    <div
                      className="card card-primary card-outline"
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "2px solid #0073e6", // Set border color to a darker blue
                      }}
                    >
                      <div className="card-header">
                        <h3 className="card-title">
                          <h5>Report</h5>
                        </h3>
                      </div>
                      <div className="card-body">
                        <li className="breadcrumb-item">
                          <a href="/Auto_machine_alarm_history">
                            Daily Auto machine alarm history
                            <img
                              src="icons8-graph-50.png"
                              alt="Icon"
                              style={{
                                width: "30px",
                                height: "30px",
                                marginLeft: "5px",
                              }}
                            />{" "}
                          </a>
                          <li className="breadcrumb-item">
                            <a href="/Auto_machine_alarm_history_Month">
                              Monthly Auto machine alarm history
                              <img
                              src="icons8-graph-50.png"
                              alt="Icon"
                              style={{
                                width: "30px",
                                height: "30px",
                                marginLeft: "5px",
                              }}
                            />{" "}
                            </a>
                          </li>
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PE_MM;
