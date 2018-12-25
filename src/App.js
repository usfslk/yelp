import React, { Component } from "react";
import "./App.css";
import "./progress.css";
import {
  Button,
  Icon,
  Divider,
  Progress,
  Feed,
  Grid,
  Card,
  Label
} from "semantic-ui-react";
import config from "./database/config";
import CircularProgressbar from "react-circular-progressbar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loaded: false,
      emotionBlock: false,
    };
  }

  componentDidMount = () => {
    this.setState({ loading: true });
    config
      .database()
      .ref(`/master/`)
      .on("value", snapshot => {
        var obj = snapshot.val();
        var list = [];
        for (let a in obj) {
          list.push(obj[a]);
        }
        this.setState({
          list: list,
          loading: false,
          loaded: true
        });
      });
  };

    emotionState = e => {
    this.setState({ emotionBlock: !this.state.emotionBlock });
  };


  render() {
    return (
      <div className="App">
        <main className="App-main">
          <p>
            Fetching
            <br />
            Balthazar Restaurant - 80 Spring St New York, NY 10012
            <br />
            <a
              href="https://www.yelp.com/biz/balthazar-restaurant-new-york"
              target="blank"
            >
              https://www.yelp.com/biz/balthazar-restaurant-new-york
            </a>
            <br />
            for demonstration purposes
            <br />
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

          {this.state.loaded ? (
            <div>
            <Divider hidden />
              <Button fluid color={this.state.emotionBlock ? 'black' : 'white'} size="small" onClick={this.emotionState}>
                {this.state.emotionBlock ? 'DISABLE EMOTIONS ANALYSIS' : 'ENABLE EMOTIONS ANALYSIS' }
              </Button>
              <Divider hidden />
              {this.state.list.map((item, index) => {
                return (
                  <Card
                    fluid
                    style={{
                      backgroundColor: "#111",
                      boxShadow: "0px 0px 0px #000 "
                    }}
                  >
                    <Card.Content>
  
                      <Label color="black"  attached='bottom left'>{item.timestamp}</Label>

                      <Feed>
                        <Feed.Event>
                          <Feed.Label image= {item.picture} />
                          <Feed.Content>
                            <Feed.Summary style={{ color: "#fcfcfc" }}>
                               {item.user}
                            </Feed.Summary>
                          </Feed.Content>
                        </Feed.Event>
                      </Feed>
                      <Card.Description style={{ color: "#fcfcfc" }}>
                         {item.review}
                      </Card.Description>

                      <Divider hidden />

                      <Progress size="tiny" percent={item.analysis} color="blue">
                        <p style={{ color: "#fcfcfc" }}>Score : {item.analysis}%</p>
                      </Progress>

                      <br />

                      {this.state.emotionBlock ?

                      <Grid>
                        <Grid.Row columns={5} className="emotionGrid">
                          <Grid.Column>
                            <CircularProgressbar
                              strokeWidth={5}
                              styles={{
                                path: {
                                  stroke: "red"
                                }
                              }}
                              percentage={item.anger}
                              text={`anger`}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <CircularProgressbar
                              styles={{
                                path: {
                                  stroke: "yellow"
                                }
                              }}
                              strokeWidth={5}
                              percentage={item.joy}
                              text={`joy`}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <CircularProgressbar
                              styles={{
                                path: {
                                  stroke: "grey"
                                }
                              }}
                              strokeWidth={5}
                              percentage={item.sadness}
                              text={`sadness`}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <CircularProgressbar
                              styles={{
                                path: {
                                  stroke: "purple"
                                }
                              }}
                              strokeWidth={5}
                              percentage={item.fear}
                              text={`Fear`}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <CircularProgressbar
                              styles={{
                                path: {
                                  stroke: "teal"
                                }
                              }}
                              strokeWidth={5}
                              percentage={item.surprise}
                              text={`Surprise`}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>

                      : null }

                    </Card.Content>
                  </Card>
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
