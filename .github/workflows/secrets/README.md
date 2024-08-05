# Repo secrets

This directory contains secrets used during CI.

## `id_ed25519`

SSH key. Since the app has Git integration, this SSH key is used to access a
small number of repos used for testing purposes.

### Granting access to a GitHub repo

1. Copy the public key from `.github/workflows/secrets/id_ed25519.pub`
2. Visit the "Deploy keys" settings for the repo you wish to grant access to.
3. Choose to add a new key, and paste the public key. Ensure you allow write
   access.

The test suite should then be able to clone and push to the repo in CI.

### Regenerating the key

```sh
# Generate SSH key
ssh-keygen -t ed25519 -f .github/workflows/secrets/id_ed25519 -C "maddy-portfolio" -N ""
# Generate encryption password
export PASSWORD=$(pwgen 32 1)
# And encrypt it
gpg --passphrase $PASSWORD --cipher-algo AES256 --output .github/workflows/secrets/id_ed25519.enc --symmetric --batch .github/workflows/secrets/id_ed25519C
# Copy the password to your clipboard
echo $PASSWORD
```

Make sure to update the `SSH_ENCRYPTION_KEY` in the repo's GitHub Actions
secrets settings. Its value should be set to the password you copied.

### Decrypting the key

```sh
gpg --batch --passphrase $PASSWORD --output .github/workflows/secrets/id_ed25519.new --decrypt .github/workflows/secrets/id_ed25519.enc
```

### Sources

* [GitHub actions](https://stackoverflow.com/a/76888551/6335363)
* [Encrypting the keys](https://stackoverflow.com/a/31552829/6335363)
