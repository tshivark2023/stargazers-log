const repositoryList = document.querySelector("#repository-list");

function addTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.append(element);
  return element;
}

function renderRepository(repository) {
  const item = document.createElement("li");
  item.className = "repository-card";

  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repository.url;
  link.textContent = `${repository.owner}/${repository.name}`;
  heading.append(link);
  item.append(heading);

  addTextElement(item, "p", "", repository.description);

  const metadata = document.createElement("div");
  metadata.className = "repository-meta";
  if (repository.language) {
    addTextElement(metadata, "span", "", repository.language);
  }
  const starredAt = addTextElement(metadata, "time", "", `Starred ${repository.starred_at}`);
  starredAt.dateTime = repository.starred_at;
  item.append(metadata);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("Repository data must be a list");
    }

    repositoryList.replaceChildren();
    if (repositories.length === 0) {
      addTextElement(repositoryList, "li", "status-message", "No starred repositories yet.");
      return;
    }

    for (const repository of repositories) {
      repositoryList.append(renderRepository(repository));
    }
  } catch (error) {
    console.error("Could not load starred repositories:", error);
    repositoryList.replaceChildren();
    addTextElement(
      repositoryList,
      "li",
      "status-message",
      "Repositories could not be loaded. Please try again later.",
    );
  }
}

loadRepositories();
