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

  handleRefresh = async (repo) => {
    const string = localStorage.getItem('storageRepositories');
    try {
      // Array in localStorage
      const listRepo = JSON.parse(string);
      // Find index of object in array to update
      const index = listRepo.findIndex(item => item.id === repo.id);
      // Create new object
      const listRepoNew = [...listRepo];
      // get update data in repository api
      const { data: repository } = await api.get(`/repos/${repo.full_name}`);
      // convert data pushed to last commit
      repository.lastCommit = moment(repository.pushed_at).fromNow();
      // update new object in array
      listRepoNew[index] = repository;
      // set array in state and local storage
      this.setState({
        repositories: listRepoNew,
      });
      localStorage.setItem('storageRepositories', JSON.stringify(listRepoNew));
    } catch (e) {
      localStorage.setItem('storageRepositories', '');
    }
  };

  handleRemove = (repo) => {
    const string = localStorage.getItem('storageRepositories');
    try {
      const listRepo = JSON.parse(string);
      const listRepoNew = listRepo.filter(item => item.id !== repo.id);
      this.setState({
        repositories: listRepoNew,
      });
      localStorage.setItem('storageRepositories', JSON.stringify(listRepoNew));
    } catch (e) {
      localStorage.setItem('storageRepositories', '');
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

        <CompareList
          repositories={repositories}
          handleRefresh={this.handleRefresh}
          handleRemove={this.handleRemove}
        />
      </Container>
    );
  }
}
