import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: [],
    };
  }
  async getJokes() {
    let jokes = this.state.jokes;
    let jokeVotes = JSON.parse(
      window.localStorage.getItem('jokeVotes') || '{}'
    );
    let seenJokes = new Set(jokes.map((j) => j.id));
    try {
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get('https://icanhazdadjoke.com', {
          headers: { Accept: 'application/json' },
        });
        let { status, ...jokeObj } = res.data;
        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          jokeVotes[jokeObj.id] = jokeVotes[jokeObj.id] || 0;
          jokes.push({ ...jokeObj, votes: 0 });
        } else {
          console.error('Duplicate Found!');
        }
      }
      this.setState({ jokes });
    } catch (e) {
      console.log(e);
    }
  }
}

export default JokeList;
