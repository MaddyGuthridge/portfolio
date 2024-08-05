# Setup process

1. User specifies a data repository URL, which is then cloned.
2. If the repo is empty, some default data is configured:
    * `config.json` with the site's default configuration
    * `.gitignore` with a simple gitignore to ignore the local configuration
3. Otherwise, the `.gitignore` is checked to ensure that `config.local.json`
   will be ignored (lest auth information be leaked).
4. A secure password is generated, and stored securely in `config.local.json`.
   It is shown to the user once, and they are prompted to take note of it.

The site is then fully configured.
