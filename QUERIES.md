# Relevant Github Queries

```gql
query {
  repository(owner:"facebook", name:"react") {
    id
    nameWithOwner
    homepageUrl
    watchers (first: 5) {
      edges {
        node {
          id
          avatarUrl
          name
        }
      }
    }
  }
}
```

```gql
{
  search(query: "react", type: REPOSITORY, first: 5) {
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
  }
}
```