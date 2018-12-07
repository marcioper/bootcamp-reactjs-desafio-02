import React, { Component } from 'react';
import moment from 'moment';
import api from '../../services/api';

import logo from '../../assets/logo.png';

import { Container, Form } from './styles';

import CompareList from '../../components/CompareList';

export default class Main extends Component {
  state = {
    repositoryError: false,
    repositoryInput: '',
    repositories: [],
    loading: false,
  };

  componentDidMount() {
    const string = localStorage.getItem('storageRepositories');

    // parse the localStorage string and setState
    try {
      const repositories = JSON.parse(string);
      this.setState({ repositories });
    } catch (e) {
      // handle empty string
      this.setState({ repositories: [] });
    }
  }

  handleAddRepository = async (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    try {
      const { repositoryInput, repositories } = this.state;
      const { data: repository } = await api.get(`/repos/${repositoryInput}`);
      repository.lastCommit = moment(repository.pushed_at).fromNow();

      this.setState(
        {
          repositoryInput: '',
          repositories: [...repositories, repository],
          repositoryError: false,
        },
        () => {
          const { repositories: listRepo } = this.state;
          localStorage.setItem('storageRepositories', JSON.stringify(listRepo));
        },
      );
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      repositories, repositoryInput, repositoryError, loading,
    } = this.state;

    return (
      <Container>
        <img src={logo} alt="Github Compare" />

        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            onChange={e => this.setState({ repositoryInput: e.target.value })}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>

        <CompareList repositories={repositories} />
      </Container>
    );
  }
}
