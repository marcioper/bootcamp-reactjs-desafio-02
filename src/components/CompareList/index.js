import React from 'react';
import PropTypes from 'prop-types';

import { Container, Repository, Button } from './styles';

const CompareList = ({ repositories, handleRefresh, handleRemove }) => (
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
  handleRefresh: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default CompareList;
