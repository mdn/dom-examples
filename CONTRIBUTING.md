# Contribution guide

The "dom-examples" repository accompany various MDN DOM and Web API documentation pages on [MDN Web Docs](https://developer.mozilla.org).
This document will help you get started with contributions!

## Types of contribution

> [!NOTE]
> You can include an example directly in MDN pages using [`{{EmbedLiveSample()}}` macros](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Macros/Commonly_used_macros#code_samples) or regular Markdown code blocks.
> These methods are simpler to maintain as the code lives beside the rest of the content.
> Only add examples to this repository if your example doesn't easily run on MDN pages for technical or security reasons.

There are many ways you can help improve this repository! For example:

- **Write a new example.** If you would like to add a new example, make sure this feature is supported by a stable version of modern browsers.
- **Improve an existing example.** You could make improvements or add some other changes which would make example more helpful to the users.
- **Fix a bug:** we have a list of [issues](https://github.com/mdn/dom-examples/issues), or maybe you found your own.

## Getting started

You will need to have Git and GitHub set up to be able to contribute.

### Set up Git and GitHub

For more information on setting up Git on your machine, [read this article](https://help.github.com/articles/set-up-git/).
With the above dependencies satisfied, [create your new account on GitHub](https://github.com/join).

Next up, you need to fork and clone the repo to be able to contribute to it.
You can [learn about forking on GitHub](https://help.github.com/articles/fork-a-repo).
Once you have your own fork, [clone it to your local machine](https://help.github.com/articles/cloning-a-repository/).

### Serving

You should serve your example locally to see the results before submitting your changes.
There are a few different ways to do this depending on your preferred tooling methods.
See [Running a simple local HTTP server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/set_up_a_local_testing_server#running_a_simple_local_http_server) for information on setting up a server.

```bash
cd my-cool-example
python3 -m http.server
```

### Open a pull request

Once you're satisfied, the final step is to [submit your pull request](https://help.github.com/articles/creating-a-pull-request/).
You can find more information about submitting pull requests in our [Community guidelines](https://developer.mozilla.org/en-US/docs/MDN/Community/Pull_requests) docs.

### Including your example on MDN

After your pull request is reviewed and merged, you can publish your example on MDN Web Docs.

## Thank you

Thanks a lot for your contribution!
If you'd like to ask questions or get in touch, feel free to drop by in [Discord](https://developer.mozilla.org/discord) or say hello in one of [our communication channels](https://developer.mozilla.org/en-US/docs/MDN/Community/Communication_channels).
