import React, { Component } from "react";
import { key, server } from "../../constants";
import { httpClient } from "../../utils/HttpClient";
import Chart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import Swal from "sweetalert2";

import { CSVLink } from "react-csv";

class MOTORDIM extends Component {
  constructor(props) {
    super(props);

    //set state
    this.state = {
      //data average per hour
      title: [],
      data: [],
      seriesMC: [],
      seriesMCSTD: [],

      xAxis: [],
      yAxis: [],
      yAxisUSL: [],
      yAxisLSL: [],
      yAxisUCL: [],
      yAxisLCL: [],
      yAxisCL: [],

      //raw data per hour
      Raw_Dat: [],
      Raw_Dat1: [],

      //standard deviation per hour
      yAxisUCLSD: [],
      yAxisLCLSD: [],
      yAxisCLSD: [],
      yAxisSD: [],

      // Table per hour
      datatable: [],
      tablerow: [],

      //data average per day
      titleday: [],
      dataday: [],
      seriesMCday: [],
      seriesMCSTDDay: [],

      xAxisday: [],
      yAxisday: [],
      yAxisUSLday: [],
      yAxisLSLday: [],
      yAxisUCLday: [],
      yAxisLCLday: [],
      yAxisCLday: [],

      //standard deviation per hour
      yAxisdaySD: [],
      yAxisUCLdaySD: [],
      yAxisLCLdaySD: [],
      yAxisCLdaySD: [],

      // Table per hour
      datatableday: [],
      tablerowday: [],

      // criteria
      model: [],
      productionline: [],
      parameter: [],
      selectMCname: [],
      aiPress: [],

      selectDate: moment().add("days", -1).format("yyyy-MM-DD"), //moment().format("yyyy-MM-DD"),
      startDate: moment().add("days", -30).format("yyyy-MM-DD"),
      finishDate: moment().format("yyyy-MM-DD"),

      // criteria options
      listModel: [],
      listParameter: [],
      listProductionline: [],
      listMachine: [],
      listAiPress: [],

      optionSelected: null,
      isDisable: false,
      isDisableDays: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = async () => {
    await this.getModel();
    await this.getAiPress();
    await this.getParameter();
    await this.getProductionline();
    await this.getMachine();
  };

  doGetData = async () => {
    let result = await httpClient.get(
      server.MOTORDIMAI_URL +
        "/" +
        this.state.selectDate +
        "/" +
        this.state.model +
        "/" +
        this.state.parameter[0].label +
        "/" +
        this.state.productionline[0].label +
        "/" +
        this.state.selectMCname[0].label +
        "/" +
        this.state.aiPress
    );

    let title = result.data.seriesY.title;
    let xAxis = [];
    for (let index = 0; index < result.data.resultAVG.length; index++) {
      const item = result.data.resultAVG[index];
      await xAxis.push(item.Time);
    }

    //Raw_Data
    let rawData = result.data.listRawData;
    console.log(rawData);
    // for (let i = 1; i < rawData.length; i++) {
    //   rawData[0].push(...rawData[i])
    // }
    this.setState({ Raw_Dat1: rawData[0] });
    console.log(this.state.Raw_Dat1);

    //AVG
    let yAxis = result.data.seriesY;
    let yAxisUSL = result.data.seriesUSL;
    let yAxisLSL = result.data.seriesLSL;
    let yAxisCL = result.data.seriesCL;
    let yAxisUCL = result.data.seriesUCL;
    let yAxisLCL = result.data.seriesLCL;

    var seriesMC = [];
    seriesMC.push(
      Object.assign({}, yAxisUSL),
      Object.assign({}, yAxisLSL),
      Object.assign({}, yAxisUCL),
      Object.assign({}, yAxisLCL),
      Object.assign({}, yAxisCL),
      Object.assign({}, yAxis)
    );

    for (let i = 0; i < result.data.seriesMC.length; i++) {
      seriesMC.push(Object.assign({}, result.data.seriesMC[i]));
    }

    //STD
    let yAxisSD = result.data.seriesSTD;
    let yAxisLCLSD = result.data.seriesLCL_STD;
    let yAxisUCLSD = result.data.seriesUCL_STD;
    let yAxisCLSD = result.data.seriesCL_STD;

    var seriesMCSTD = [];
    seriesMCSTD.push(
      Object.assign({}, yAxisUCLSD),
      Object.assign({}, yAxisLCLSD),
      Object.assign({}, yAxisCLSD),
      Object.assign({}, yAxisSD)
    );

    for (let i = 0; i < result.data.seriesMCSTD.length; i++) {
      seriesMCSTD.push(Object.assign({}, result.data.seriesMCSTD[i]));
    }

    var datatable = [];

    for (let i = 0; i < result.data.listResult.length; i++) {
      datatable.push(result.data.listResult[i]);
    }

    this.setState({
      title,
      data: result.data.resultAVG,
      datatable,

      seriesMC,
      seriesMCSTD,
      xAxis,

      isDisable: false,
    });
  };

  // doGetDataperday
  doGetDataDay = async () => {
    let resultday = await httpClient.get(
      server.MOTORDIMAIDAY_URL +
        "/" +
        this.state.startDate +
        "/" +
        this.state.finishDate +
        "/" +
        this.state.model +
        "/" +
        this.state.parameter[0].label +
        "/" +
        this.state.productionline[0].label +
        "/" +
        this.state.selectMCname[0].label +
        "/" +
        this.state.aiPress
    );

    let titleday = resultday.data.seriesYday.titleday;
    let xAxisday = [];

    for (let index = 0; index < resultday.data.resultAVGday.length; index++) {
      const item = resultday.data.resultAVGday[index];
      await xAxisday.push(item.Date);
    }
    //Raw_Data
    let rawData = resultday.data.listRawData;
    console.log(rawData);
    for (let i = 1; i < rawData.length; i++) {
      rawData[0].push(...rawData[i]);
    }
    this.setState({ Raw_Dat1: rawData[0] });
    console.log(this.state.Raw_Dat1);
    //AVG
    let yAxisday = resultday.data.seriesYday;
    let yAxisUSLday = resultday.data.seriesUSL;
    let yAxisLSLday = resultday.data.seriesLSL;
    let yAxisUCLday = resultday.data.seriesUCL;
    let yAxisLCLday = resultday.data.seriesLCL;
    let yAxisCLday = resultday.data.seriesCL;

    var seriesMCday = [];
    seriesMCday.push(
      Object.assign({}, yAxisUSLday),
      Object.assign({}, yAxisLSLday),
      Object.assign({}, yAxisUCLday),
      Object.assign({}, yAxisLCLday),
      Object.assign({}, yAxisCLday),
      Object.assign({}, yAxisday)
    );

    for (let i = 0; i < resultday.data.seriesMCday.length; i++) {
      seriesMCday.push(Object.assign({}, resultday.data.seriesMCday[i]));
    }

    //STD
    let yAxisdaySD = resultday.data.seriesSTDDay;
    let yAxisUCLdaySD = resultday.data.seriesUCL_STD;
    let yAxisLCLdaySD = resultday.data.seriesLCL_STD;
    let yAxisCLdaySD = resultday.data.seriesCL_STD;

    var seriesMCSTDDay = [];
    seriesMCSTDDay.push(
      Object.assign({}, yAxisUCLdaySD),
      Object.assign({}, yAxisLCLdaySD),
      Object.assign({}, yAxisCLdaySD),
      Object.assign({}, yAxisdaySD)
    );

    for (let i = 0; i < resultday.data.seriesMCSTDDay.length; i++) {
      seriesMCSTDDay.push(Object.assign({}, resultday.data.seriesMCSTDDay[i]));
    }

    var datatableday = [];
    //datatableday.push(resultday.data.resultAVGday);

    for (let i = 0; i < resultday.data.listResultday.length; i++) {
      datatableday.push(resultday.data.listResultday[i]);
    }

    this.setState({
      titleday,
      dataday: resultday.data.resultAVGday,
      datatableday,

      seriesMCday,
      seriesMCSTDDay,
      xAxisday,

      isDisableDays: false,
    });
  };

  getModel = async () => {
    const array = await httpClient.get(server.MOTORDIMAIMODEL_URL);
    // console.log(array.data.result);
    const options = array.data.result.map((d) => ({
      label: d.Model,
    }));
    this.setState({ listModel: options });
  };

  getParameter = async () => {
    const array = await httpClient.get(
      server.MOTORDIMAIPARAM_URL + "/" + this.state.model
    );
    // console.log(array.data.result);
    const options = array.data.result.map((d) => ({
      label: d.Parameter,
    }));
    this.setState({ listParameter: options });
  };

  getProductionline = async () => {
    const array = await httpClient.get(
      server.MOTORDIMAILINE_URL + "/" + this.state.model
    );
    const options = array.data.result.map((d) => ({
      label: d.Line,
    }));
    this.setState({ listProductionline: options });
  };

  getMachine = async () => {
    const array = await httpClient.get(
      server.MOTORDIMAIMACHINE_URL +
        "/" +
        this.state.productionline[0].label +
        "/" +
        this.state.model
    );
    const options = array.data.result.map((d) => ({
      label: d.Machine_no,
    }));
    this.setState({ listMachine: options });
  };

  getAiPress = async () => {
    const array = await httpClient.get(server.MOTORDIMAIPRESS_URL);
    const options = array.data.result.map((d) => ({
      label: d.Machine_no,
      value: d.Machine_no,
    }));
    this.setState({ listAiPress: options });
  };

  handleChange = async (event) => {
    const Newevent = Object.keys(event).map((key) => event[key].label);
    const json_string = JSON.stringify(Newevent);
    this.setState({ aiPress: json_string });
    this.setState({ optionSelected: event });
    console.log(Newevent);
    console.log(json_string);
    console.log(this.state.aiPress);
    // console.log(this.state.optionSelected);
  };

  renderTableRow = () => {
    var tablerow = [];
    for (let i = 0; i < this.state.datatable.length; i++) {
      tablerow.push(
        this.state.datatable[i].map((item) => (
          <tr>
            <td>{item.Fixture}</td>
            <td>{item["Time"]}</td>
            <td>{item["%Yield"]}</td>
            <td>{item["AVG"]}</td>
            <td>{item["STD"]}</td>
            <td>{item["CPK"]}</td>
            <td>{item["Cycle_time (sec)"]}</td>
            <td>{item["Down time (min)"]}</td>
          </tr>
        ))
      );
    }
    return tablerow;
  };

  renderTableRowday = () => {
    var tablerowday = [];
    for (let i = 0; i < this.state.datatableday.length; i++) {
      tablerowday.push(
        this.state.datatableday[i].map((item) => (
          <tr>
            <td>{item.Fixture}</td>
            <td>{item["Date"]}</td>
            <td>{item["%Yield"]}</td>
            <td>{item["AVG"]}</td>
            <td>{item["STD"]}</td>
            <td>{item["CPK"]}</td>
            <td>{item["Cycle_time (sec)"]}</td>
            <td>{item["Down time (min)"]}</td>
          </tr>
        ))
      );
    }
    return tablerowday;
  };

  render() {
    return (
      <div class="content-wrapper">
        <div className="content" style={{ paddingTop: 70 }}>
          <section className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-9">
                  <h1>Ai-press data SPC chart</h1>
                </div>
                <div className="col-sm-3">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item">
                      <a href="/Home">Home</a>
                    </li>
                    <li className="breadcrumb-item active">
                    Ai-press data SPC chart
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            {/* /.container-fluid */}
          </section>
          <div class="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="card card-primary card-outline">
                  <div className="card-header">
                    <h3 className="card-title">
                      <label>Select Parameter</label>
                    </h3>
                  </div>

                  <div className="card-body">
                    <div className="row">
                      {/* //Select Critiria "Model" */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Model</label>
                          <Select
                            options={this.state.listModel}
                            onChange={async (e) => {
                              await this.setState({ model: e.label });
                              await this.setState({
                                seriesMC: [],
                                seriesMCSTD: [],
                                seriesMCday: [],
                                seriesMCSTDDay: [],
                              });
                              await this.getParameter();
                              await this.getProductionline();
                              await this.setState({
                                productionline: [
                                  { label: "Select Production Line" },
                                ],
                              });
                              await this.setState({
                                parameter: [{ label: "Select Parameter" }],
                              });
                              await this.setState({
                                selectMCname: [
                                  { label: "Selected Tester No." },
                                ],
                              });
                              await this.setState({
                                optionSelected: "Select Ass'y Fixture",
                              });
                            }}
                            // type="text"
                            // className="form-control"
                            placeholder="Select Model"
                          />
                        </div>
                      </div>

                      {/* //Select Critiria "Production line" */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>Production line</label>
                          <Select
                            options={this.state.listProductionline}
                            value={this.state.productionline[0]}
                            onChange={async (e) => {
                              await this.setState({ productionline: [] });
                              this.state.productionline.push({
                                label: e.label,
                              });
                              await this.setState({
                                seriesMC: [],
                                seriesMCSTD: [],
                                seriesMCday: [],
                                seriesMCSTDDay: [],
                              });
                              await this.getMachine();
                              await this.setState({
                                selectMCname: [
                                  { label: "Selected Tester No." },
                                ],
                              });
                              await this.setState({
                                optionSelected: "Select Ass'y Fixture",
                              });
                            }}
                            // type="text"
                            // className="form-control"
                            placeholder="Select Production Line"
                          />
                        </div>
                      </div>

                      {/* //Select Critiria "Parameter" */}
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Parameter</label>
                          <Select
                            options={this.state.listParameter}
                            value={this.state.parameter[0]}
                            onChange={async (e) => {
                              await this.setState({ parameter: [] });
                              this.state.parameter.push({ label: e.label });
                              await this.setState({
                                seriesMC: [],
                                seriesMCSTD: [],
                                seriesMCday: [],
                                seriesMCSTDDay: [],
                              });
                            }}
                            // type="text"
                            // className="form-control"
                            placeholder="Select Parameter"
                          />
                        </div>
                      </div>

                      {/* //Select Critiria "Machine No." */}
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Tester No.</label>
                          <Select
                            options={this.state.listMachine}
                            value={this.state.selectMCname[0]}
                            onChange={async (e) => {
                              await this.setState({ selectMCname: [] });
                              this.state.selectMCname.push({ label: e.label });
                            }}
                            // type="text"
                            // className="form-control"
                            placeholder="Select Tester No."
                          />
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Ass'y Fixture</label>
                          <Select
                            isMulti
                            options={this.state.listAiPress}
                            onChange={this.handleChange.bind(this)}
                            displayValue="label"
                            selectionLimit="2"
                            allowSelectAll={true}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={true}
                            value={this.state.optionSelected}
                            // type="text"
                            // className="form-control"
                            placeholder="Select Ass'y Fixture"
                          />
                        </div>
                      </div>

                      {/* //Select Start Date */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            By Hourly Select Date &nbsp;
                            <i
                              class="fas fa-question-circle"
                              style={{ fontSize: 18, color: "Dodgerblue" }}
                              onClick={() => {
                                Swal.fire({
                                  icon: "info",
                                  title: "Hourly Data",
                                  text: "Hourly data over the course of the selected day",
                                });
                              }}
                            ></i>
                          </label>
                          <input
                            value={this.state.selectDate}
                            onChange={(e) => {
                              this.setState({ selectDate: e.target.value });
                            }}
                            type="date"
                            className="form-control"
                            placeholder="Select Start Date"
                          />
                        </div>
                      </div>

                      {/* Submit button */}
                      <div className="col-md-1">
                        <button
                          disabled={this.state.isDisable}
                          onClick={(e) => {
                            this.setState({ isDisable: true });
                            this.doGetData();
                            this.setState({ showHourly: true  , showDaily: false});
                            Swal.fire({
                              icon: "info",
                              title: "Loading Data",
                              timer: 60000,
                              allowOutsideClick: false,
                              didOpen: async () => {
                                Swal.showLoading();
                                await this.doGetData();
                                console.log(this.state.seriesMC[5].data);
                                Swal.close();
                              },
                            }).then(() => {
                              if (this.state.seriesMC.length > 0) {
                                if (this.state.seriesMC[5].data.length > 0) {
                                  Swal.fire({
                                    icon: "success",
                                    title: "Success",
                                    text: "Data has been loaded successfully",
                                  });
                                } else if (
                                  this.state.seriesMC[5].data.length == 0
                                ) {
                                  Swal.fire({
                                    icon: "error",
                                    title: "No production data",
                                    text: "Please select other date",
                                  }).then(() => {
                                    // รีเฟรชหน้าใหม่
                                    window.location.reload();
                                  });
                                }
                              } else {
                                Swal.fire({
                                  icon: "error",
                                  title:
                                    "Data loading has encountered some error, please try again",
                                  }).then(() => {
                                    // รีเฟรชหน้าใหม่
                                    window.location.reload();
                                });
                              }
                            });
                          }}
                          type="submit"
                          className="btn btn-primary"
                          style={{ marginTop: 30 }}
                        >
                          Submit
                        </button>
                      </div>
                      <div className="col-md-8">
                        <CSVLink data={this.state.Raw_Dat}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginTop: 30 }}
                          >
                            Download
                          </button>
                        </CSVLink>
                      </div>

                      {/* //Select Start Date */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>
                            By Daily Select From &nbsp;
                            <a
                              class="fas fa-question-circle"
                              style={{ fontSize: 18, color: "Dodgerblue" }}
                              onClick={() => {
                                Swal.fire({
                                  icon: "info",
                                  title: "Day-to-Day Data",
                                  text: "Day-to-Day data over the course of the selected date",
                                });
                              }}
                            ></a>
                          </label>
                          <input
                            value={this.state.startDate}
                            onChange={(e) => {
                              this.setState({ startDate: e.target.value });
                            }}
                            type="date"
                            className="form-control"
                            placeholder="Select Start Date"
                          />
                        </div>
                      </div>

                      {/* //Select Finish Date */}
                      <div className="col-md-3">
                        <div className="form-group">
                          <label>To</label>
                          <input
                            value={this.state.finishDate}
                            onChange={(e) => {
                              this.setState({ finishDate: e.target.value });
                            }}
                            type="date"
                            className="form-control"
                            placeholder="Select Finish Date"
                          />
                        </div>
                      </div>
                      <div className="row">
                        {/* Submit button */}
                        <div className="col-md-6">
                          <button
                            disabled={this.state.isDisableDays}
                            onClick={(e) => {
                              this.setState({ isDisableDays: true });
                              this.doGetDataDay();
                              this.setState({
                                showHourly: false, // ไม่แสดง Hourly
                                showDaily: true  // แสดง Daily
                              });
                              Swal.fire({
                                icon: "info",
                                title: "Loading Data",
                                timer: 120000,
                                allowOutsideClick: false,
                                didOpen: async () => {
                                  Swal.showLoading();
                                  await this.doGetDataDay();
                                  Swal.close();
                                },
                              }).then(() => {
                                // ตรวจสอบเงื่อนไขว่าเกิด error หรือไม่
                                if (this.state.seriesMCday.length > 0) {
                                  if (
                                    this.state.seriesMCday[5].data.length > 0
                                  ) {
                                    Swal.fire({
                                      icon: "success",
                                      title: "Success",
                                      text: "Data has been loaded successfully",
                                    });
                                  } else if (
                                    this.state.seriesMCday[5].data.length === 0
                                  ) {
                                    Swal.fire({
                                      icon: "error",
                                      title: "No production data",
                                      text: "Please select another date",
                                    }).then(() => {
                                      // รีเฟรชหน้าเว็บ
                                      window.location.reload();
                                    });
                                  }
                                } else {
                                  Swal.fire({
                                    icon: "error",
                                    title:
                                      "Data loading encountered an error, please try again",
                                  }).then(() => {
                                    // รีเฟรชหน้าเว็บ
                                    window.location.reload();
                                  });
                                }
                              });
                            }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginTop: 30 }}
                          >
                            Submit
                          </button>
                        </div>
                        <div className="col-md-2">
                          <CSVLink data={this.state.Raw_Dat1}>
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ marginTop: 30 }}
                            >
                              Download
                            </button>
                          </CSVLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time data per hour */}
        {this.state.showHourly&&(
        <div className="content" style={{ paddingTop: 20 }}>
          <div className="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-">
                  <h1 className="brand-text font-weight-light">
                    Hourly SPC Chart on {this.state.selectDate}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {/* Chart per hour*/}
          <div class="content">
            <div class="container-fluid">
              <div className="row">
                <div className="col-6">
                  <div className="card card-primary card-outline">
                    {/* Chart Title */}
                    <div className="card-header">
                      <h3 className="card-title">
                        <i className="far fa-chart-bar" />
                        <label>Xbar Chart</label>
                      </h3>
                    </div>

                    {/* Insert Xbar Chart */}
                    <div className="card-body" style={{ height: 415 }}>
                      <div className="chart">
                        <div id="areaChart">
                          <Chart
                            options={{
                              chart: {
                                id: "basic-bar",
                              },
                              xaxis: {
                                categories: this.state.xAxis,
                              },
                              legend: {
                                showForSingleSeries: false,
                                showForNullSeries: false,
                                showForZeroSeries: false,
                                position: "right",
                              },

                              title: {
                                text: this.state.title,
                                align: "bottom",

                                style: {
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                },
                              },
                              markers: {
                                size: [0, 0, 0, 0, 0, 5, 5, 5, 6],
                              },
                              stroke: {
                                width: [2, 2, 2, 2, 2, 4, 4, 4, 2],
                                dashArray: [0, 0, 6, 6, 6, 0, 0, 0, 0],
                              },

                              colors: [
                                "#C62828",
                                "#C62828",
                                "#FF5722",
                                "#FF5722",
                                "#78909C",
                                "#FF8A65",
                                "#4DD0E1",
                                "#9CCC65",
                                "#1976D2",
                              ],
                            }}
                            series={this.state.seriesMC}
                            type="line"
                            height="350"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card card-primary card-outline">
                    {/* Chart Title */}
                    <div className="card-header">
                      <h3 className="card-title">
                        <i className="far fa-chart-bar" />
                        <label>Standard Deviation Chart</label>
                      </h3>
                    </div>
                    {/* Insert R Chart */}
                    <div className="card-body" style={{ height: 415 }}>
                      <div className="chart">
                        <div id="areaChart">
                          <Chart
                            options={{
                              chart: {
                                id: "basic-bar",
                              },
                              xaxis: {
                                categories: this.state.xAxis,
                              },

                              title: {
                                text: this.state.title,
                                align: "bottom",

                                style: {
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                },
                              },
                              legend: {
                                showForSingleSeries: false,
                                showForNullSeries: false,
                                showForZeroSeries: false,
                                position: "right",
                              },
                              markers: {
                                size: [0, 0, 0, 5, 5, 5, 6],
                              },
                              stroke: {
                                width: [2, 2, 2, 4, 4, 4, 2],
                                dashArray: [6, 6, 6, 0, 0, 0, 0],
                              },
                              colors: [
                                "#FF5722",
                                "#FF5722",
                                "#78909C",
                                "#FF8A65",
                                "#4DD0E1",
                                "#9CCC65",
                                "#1976D2",
                              ],
                            }}
                            series={this.state.seriesMCSTD}
                            type="line"
                            height="350"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Table per hour*/}
          <div class="content">
            <div class="container-fluid">
              <div className="card card-primary">
                <div className="row">
                  <div className="col-12">
                    {/* /.card-header */}
                    <div
                      className="card-body table-responsive p-0"
                      style={{ height: 500 }}
                    >
                      <table className="table table-head-fixed text-nowrap table-hover">
                        <thead>
                          <tr>
                            <th width="150">Fixture</th>
                            <th width="175">Time</th>
                            <th width="175">%Yield</th>
                            <th width="175">Average</th>
                            <th width="175">STD</th>
                            <th width="175">Cpk</th>
                            <th width="175">AVG Cycle Time (sec)</th>
                            <th width="175">Down time (min)</th>
                          </tr>
                        </thead>
                        <tbody>{this.renderTableRow()}</tbody>
                      </table>
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
                </div>
              </div>
            </div>
          </div>
        </div>
)}
        {/* Real-time data per day */}
        {this.state.showDaily&&(
        <div className="content" style={{ paddingTop: 20 }}>
          <div className="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-">
                  <h1 className="brand-text font-weight-light">
                    Daily SPC Chart from {this.state.startDate} to{" "}
                    {this.state.finishDate}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {/* Chart per day*/}
          <div class="content">
            <div class="container-fluid">
              <div className="row">
                <div className="col-6">
                  <div className="card card-primary card-outline">
                    {/* Chart Title */}
                    <div className="card-header">
                      <h3 className="card-title">
                        <i className="far fa-chart-bar" />
                        <label>Xbar Chart</label>
                      </h3>
                    </div>
                    {/* Insert Chart */}
                    <div className="card-body" style={{ height: 415 }}>
                      <div className="chart">
                        <div id="areaChart" style={{}}>
                          <Chart
                            options={{
                              chart: {
                                id: "basic-bar",
                              },
                              xaxis: {
                                categories: this.state.xAxisday,
                              },
                              legend: {
                                showForSingleSeries: false,
                                showForNullSeries: false,
                                showForZeroSeries: false,
                                position: "right",
                              },

                              title: {
                                text: this.state.titleday,
                                align: "bottom",

                                style: {
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  fontFamily: undefined,
                                  color: "#263238",
                                },
                              },
                              markers: {
                                size: [0, 0, 0, 0, 0, 5, 5, 5, 6],
                              },
                              stroke: {
                                width: [2, 2, 2, 2, 2, 4, 4, 4, 2],
                                dashArray: [0, 0, 6, 6, 6, 0, 0, 0, 0],
                              },

                              colors: [
                                "#C62828",
                                "#C62828",
                                "#FF5722",
                                "#FF5722",
                                "#78909C",
                                "#FF8A65",
                                "#4DD0E1",
                                "#9CCC65",
                                "#1976D2",
                              ],
                            }}
                            series={this.state.seriesMCday}
                            type="line"
                            height="350"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="card card-primary card-outline">
                    {/* Chart Title */}
                    <div className="card-header">
                      <h3 className="card-title">
                        <i className="far fa-chart-bar" />
                        <label>Standard Deviation Chart</label>
                      </h3>
                    </div>
                    {/* Insert R Chart */}
                    <div className="card-body" style={{ height: 415 }}>
                      <div className="chart">
                        <div id="areaChart">
                          <Chart
                            options={{
                              chart: {
                                id: "basic-bar",
                              },
                              xaxis: {
                                categories: this.state.xAxisday,
                              },

                              title: {
                                text: this.state.titleday,
                                align: "bottom",

                                style: {
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  fontFamily: undefined,
                                  color: "#263238",
                                },
                              },
                              legend: {
                                showForSingleSeries: false,
                                showForNullSeries: false,
                                showForZeroSeries: false,
                                position: "right",
                              },
                              markers: {
                                size: [0, 0, 0, 5, 5, 5, 6],
                              },
                              stroke: {
                                width: [2, 2, 2, 4, 4, 4, 2],
                                dashArray: [6, 6, 6, 0, 0, 0, 0],
                              },
                              colors: [
                                "#FF5722",
                                "#FF5722",
                                "#78909C",
                                "#FF8A65",
                                "#4DD0E1",
                                "#9CCC65",
                                "#1976D2",
                              ],
                            }}
                            series={this.state.seriesMCSTDDay}
                            type="line"
                            height="350"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insert Table per day*/}
          <div class="content">
            <div class="container-fluid">
              <div className="card card-primary">
                <div className="row">
                  <div className="col-12">
                    {/* /.card-header */}
                    <div
                      className="card-body table-responsive p-0"
                      style={{ height: 500 }}
                    >
                      <table className="table table-head-fixed text-nowrap table-hover">
                        <thead>
                          <tr>
                            <th width="150">Fixture</th>
                            <th width="175">Date</th>
                            <th width="175">%Yield</th>
                            <th width="175">Average</th>
                            <th width="175">STD</th>
                            <th width="175">Cpk</th>
                            <th width="175">AVG Cycle Time (sec)</th>
                            <th width="175">Down time (min)</th>
                          </tr>
                        </thead>
                        <tbody>{this.renderTableRowday()}</tbody>
                      </table>
                    </div>
                    {/* /.card-body */}
                  </div>
                  {/* /.card */}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    );
  }
}
export default MOTORDIM;
