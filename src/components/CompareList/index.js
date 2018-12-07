import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import api from '../../services/api';

import { Container, Repository, Button } from './styles';

const CompareList = ({ repositories }) => {
  const handleRefresh = async (repo) => {
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
      // set array in local storage
      localStorage.setItem('storageRepositories', JSON.stringify(listRepoNew));
      // refresh force page
      window.location.reload();
    } catch (e) {
      localStorage.setItem('storageRepositories', '');
    }
  };

  const handleRemove = (repo) => {
    const string = localStorage.getItem('storageRepositories');
    try {
      const listRepo = JSON.parse(string);
      const listRepoNew = listRepo.filter(item => item.id !== repo.id);
      localStorage.setItem('storageRepositories', JSON.stringify(listRepoNew));
      window.location.reload();
    } catch (e) {
      localStorage.setItem('storageRepositories', '');
    }
  };
  return (
    <Container>
      {repositories.map(repository => (
        <Repository key={repository.id}>
          <Button>
            <button type="button" title="Refresh" onClick={handleRefresh.bind(this, repository)}>
              <i className="fa fa-refresh fa-lg" />
            </button>
            <button type="button" title="Remove" onClick={handleRemove.bind(this, repository)}>
              <i className="fa fa-remove fa-lg" />
            </button>
          </Button>
          <header>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <strong>{repository.name}</strong>
            <small>{repository.owner.login}</small>
          </header>

          <ul>
            <li>
              {repository.stargazers_count}
              <small> stars</small>
            </li>
            <li>
              {repository.forks_count}
              <small> forks</small>
            </li>
            <li>
              {repository.open_issues_count}
              <small> issues</small>
            </li>
            <li>
              {repository.lastCommit}
              <small> last commit</small>
            </li>
          </ul>
        </Repository>
      ))}
    </Container>
  );
};

CompareList.propTypes = {
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      stargazers_count: PropTypes.number,
      forks_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      pushed_at: PropTypes.string,
    }),
  ).isRequired,
};

export default CompareList;
