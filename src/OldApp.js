import React, { Component } from "react";
import "./App.css";
import {
  Button,
  Icon,
  Divider,
  Message,
  Progress,
  Feed,
  Grid
} from "semantic-ui-react";
import config from './database/config'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      loading: false,
      loaded: false,
      emotionBlock: false,
      data: [],
      emotion: []
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  emotionState = e => {
    this.setState({ loaded: true });
  };

  emotion = () => {
    this.setState({ loading: true });
    var obj = this.state.data;
    var emotion = [];
    for (let i in obj) {
      fetch(
        "https://cors-anywhere.herokuapp.com/https://apiv2.indico.io/emotion",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            api_key: "43751098d41ba733826cc75dd3173717",
            data: obj[i].review
          })
        }
      )
        .then(response => response.json())
        .then(responseJson => {
          let review = obj[i].review;
          let timestamp = obj[i].timestamp;
          let user = obj[i].user;
          let picture =  obj[i].picture; 
          let analysis = obj[i].analysis; 
          let anger = (responseJson.results.anger * 100).toFixed(2);
          let fear = (responseJson.results.fear * 100).toFixed(2);
          let joy = (responseJson.results.joy * 100).toFixed(2);
          let sadness = (responseJson.results.sadness * 100).toFixed(2);
          let surprise = (responseJson.results.surprise * 100).toFixed(2);
        config.database().ref(`/master/`)
          .push({ 
            review,
            timestamp,
            user,
            picture,
            analysis,
            anger,
            fear,
            joy,
            sadness,
            surprise
        })
          .then(() => {
          console.log('db updated!')
        });
          emotion.push({
            review: obj[i].review,
            timestamp: obj[i].timestamp,
            user: obj[i].user,
            picture: obj[i].picture,
            analysis: obj[i].analysis,
            anger: (responseJson.results.anger * 100).toFixed(2),
            fear: (responseJson.results.fear * 100).toFixed(2),
            joy: (responseJson.results.joy * 100).toFixed(2),
            sadness: (responseJson.results.sadness * 100).toFixed(2),
            surprise: (responseJson.results.surprise * 100).toFixed(2)
          });
        });
      this.setState({
        emotion: emotion,
        loading: false,
        emotionBlock: true
      });
    }
  };

  componentDidMount() {
    this.setState({ loading: true });
    fetch(
      "https://cors-anywhere.herokuapp.com/https://protobulb.reviewshake.com/api/v1/reviews?perPage=50",
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-Spree-Token": "15ac4edb1dcb5bc8c2cbf6c2a66cc8cd8055d3fae783ab87"
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            list: responseJson.reviews
          },
          () => {
            var obj = this.state.list;
            var data = [];
            var fetchArr = [];
            for (let i in obj) {
              let promise = fetch(
                "https://cors-anywhere.herokuapp.com/https://apiv2.indico.io/sentiment",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    api_key: "43751098d41ba733826cc75dd3173717",
                    data: obj[i].text
                  })
                }
              ).then(response => response.json());

              fetchArr.push(promise);
            }

            Promise.all(fetchArr).then(values => {
              values.forEach((responseJson, i) => {
                //for each responseJson, push to the data array

                data.push({
                  review: obj[i].text,
                  timestamp: obj[i].review_date,
                  user: obj[i].reviewer.name,
                  picture: obj[i].reviewer.profile_picture,
                  analysis: (responseJson.results * 100).toFixed(2)
                });
              });
              this.setState({
                data: data,
                loaded: true,
                loading: false
              });
              this.emotion();
            });
          }
        );
      });
  }

  render() {
    return (
      <div className="App">
        <main className="App-main">
          <p>
            Fetching
            <br />            
            Balthazar Restaurant - 80 Spring St New York, NY 10012<br />
            <a href='https://www.yelp.com/biz/balthazar-restaurant-new-york' target='blank'>
            https://www.yelp.com/biz/balthazar-restaurant-new-york</a>
            <br />
            for demonstration purposes
            <br />
            The score is a probability representing the likelihood that the
            analyzed review is positive or negative. Values greater than 50
            indicate positive sentiment, while values less than 50 indicate
            negative sentiment.
          </p>

          {this.state.loading ? (
            <div>
              <Icon name="circle notched" loading />
              <Divider hidden />
              <p>Loading ...</p>
            </div>
          ) : null}

          <Divider hidden />
          {this.state.loaded ? (
            <div>
              <Button color="black" size="small" onClick={this.emotionState}>
                GET STARTED
              </Button>
              <Divider hidden />
              {this.state.emotion.map((item, index) => {
                return (
                  <Message color="black" key={item.analysis}>
                    <Grid padded>
                      <Grid.Row>
                        <Grid.Column width={8}>
                          <Feed>
                            <Feed.Event>
                              <Feed.Label image={item.picture} />
                              <Feed.Content>
                                <Feed.Date
                                  style={{ color: "#fff" }}
                                  content={item.timestamp}
                                />
                                <Feed.Summary style={{ color: "#fff" }}>
                                  {item.user}
                                </Feed.Summary>
                              </Feed.Content>
                            </Feed.Event>
                          </Feed>
                        </Grid.Column>
                        <Grid.Column width={8}>
                          <h3 style={{ textAlign: "center" }}>
                            Score : {item.analysis}%
                          </h3>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>

                    <Divider hidden />
                    <Message.Header>{item.review}</Message.Header>
                    <Divider hidden />

                    <Progress size="tiny" percent={item.joy} color="pink">
                      <p style={{ color: "#fff" }}>Joy</p>
                    </Progress>
                    <Progress size="tiny" percent={item.sadness} color="grey">
                      <p style={{ color: "#fff" }}>Sadness</p>
                    </Progress>
                    <Progress size="tiny" percent={item.surprise} color="green">
                      <p style={{ color: "#fff" }}>Surprise</p>
                    </Progress>
                    <Progress size="tiny" percent={item.anger} color="yellow">
                      <p style={{ color: "#fff" }}>Anger</p>
                    </Progress>
                    <Progress size="tiny" percent={item.fear} color="red">
                      <p style={{ color: "#fff" }}>Fear</p>
                    </Progress>
                  </Message>
                );
              })}
            </div>
          ) : null}
        </main>
      </div>
    );
  }
}

export default App;
