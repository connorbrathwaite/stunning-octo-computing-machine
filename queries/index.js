import {gql} from 'apollo-boost'
export const getReposByName = gql`
  query($name: String!) {
    search(query: $name, type: REPOSITORY, first: 10) {
      repositoryCount
      nodes {
        ... on Repository {
          id
          name
          owner {
            id
            login
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

// Authorization required to fetch collaborators with Graph api...
export const getRepoByOwnerAndName = gql`
  query {
    repository(owner: "facebook", name: "react") {
      id
      nameWithOwner
      homepageUrl
      collaborators(first: 5) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`